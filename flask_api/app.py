from __future__ import annotations

import os
from pathlib import Path
from typing import Any, Dict

import joblib
import numpy as np
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS
from sklearn.ensemble import RandomForestClassifier

app = Flask(__name__)
CORS(app)

FEATURE_ORDER = [
    "age_years",
    "weight",
    "height",
    "gender",
    "ap_hi",
    "ap_lo",
    "cholesterol",
    "gluc",
    "smoke",
    "alco",
    "active",
    "bmi",
]

DEFAULT_MODEL_PATH = Path(__file__).resolve().parents[1] / "artifacts" / "best_random_forest_tuned.joblib"
MODEL_PATH = Path(os.getenv("MODEL_PATH", str(DEFAULT_MODEL_PATH)))
MODEL = None
MODEL_LOAD_ERROR = ""
MODEL_SOURCE = "none"

NOTEBOOK_DATASET_NAME = "cardio_train_properly_separated_comma.csv"


def _dataset_candidates() -> list[Path]:
    configured = os.getenv("DATASET_PATH")
    project_root = Path(__file__).resolve().parents[1]
    workspace_root = project_root.parent
    return [
        Path(configured) if configured else Path(""),
        project_root / NOTEBOOK_DATASET_NAME,
        workspace_root / NOTEBOOK_DATASET_NAME,
    ]


def _find_dataset_path() -> Path | None:
    for candidate in _dataset_candidates():
        if not str(candidate):
            continue
        if candidate.exists() and candidate.is_file():
            return candidate
    return None


def _prepare_training_frame(df: pd.DataFrame) -> pd.DataFrame:
    prepared = df.copy()

    if "age_years" not in prepared.columns and "age" in prepared.columns:
        prepared["age_years"] = (prepared["age"] / 365.25).round(2)

    if "bmi" not in prepared.columns and {"weight", "height"}.issubset(prepared.columns):
        height_m = prepared["height"] / 100.0
        prepared["bmi"] = prepared["weight"] / np.maximum(height_m * height_m, 1e-6)

    missing = [c for c in FEATURE_ORDER + ["cardio"] if c not in prepared.columns]
    if missing:
        raise ValueError(f"Dataset missing required columns: {', '.join(missing)}")

    prepared = prepared.dropna(subset=FEATURE_ORDER + ["cardio"])
    return prepared


def _train_model_from_dataset(dataset_path: Path) -> Any:
    df = pd.read_csv(dataset_path)
    prepared = _prepare_training_frame(df)

    x = prepared[FEATURE_ORDER].astype(float)
    y = prepared["cardio"].astype(int)

    # Mirrors tuned notebook setup (best params from Project2.ipynb).
    model = RandomForestClassifier(
        n_estimators=400,
        max_depth=10,
        min_samples_split=5,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(x, y)
    return model


def _to_number(value: Any) -> float:
    try:
        return float(value)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"Value '{value}' is not numeric") from exc


def _normalize_features(features: Dict[str, Any]) -> Dict[str, float]:
    normalized: Dict[str, float] = {}
    for key in FEATURE_ORDER:
        if key not in features:
            raise ValueError(f"Missing field: {key}")
        normalized[key] = _to_number(features[key])

    # Preserve training encoding where 1 means "normal" and UI can send 0.
    for encoded in ("cholesterol", "gluc"):
        if normalized[encoded] in (0.0, 1.0, 2.0):
            normalized[encoded] += 1.0

    return normalized


def _load_model() -> None:
    global MODEL, MODEL_LOAD_ERROR, MODEL_SOURCE
    try:
        MODEL = joblib.load(MODEL_PATH)
        MODEL_LOAD_ERROR = ""
        MODEL_SOURCE = "artifact"
        return
    except Exception as load_exc:  # pragma: no cover - startup path
        MODEL = None
        MODEL_LOAD_ERROR = str(load_exc)

    dataset_path = _find_dataset_path()
    if dataset_path is None:
        MODEL_SOURCE = "none"
        searched = [str(p) for p in _dataset_candidates() if str(p)]
        MODEL_LOAD_ERROR = (
            f"{MODEL_LOAD_ERROR}. Also could not find dataset '{NOTEBOOK_DATASET_NAME}'. "
            f"Searched: {searched}"
        )
        return

    try:
        MODEL = _train_model_from_dataset(dataset_path)
        MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(MODEL, MODEL_PATH)
        MODEL_SOURCE = f"trained-from:{dataset_path}"
        MODEL_LOAD_ERROR = ""
    except Exception as train_exc:
        MODEL = None
        MODEL_SOURCE = "none"
        MODEL_LOAD_ERROR = f"Model load failed, then training failed: {train_exc}"


_load_model()


@app.get("/health")
def health() -> Any:
    return jsonify(
        {
            "status": "ok" if MODEL is not None else "error",
            "model_path": str(MODEL_PATH),
            "model_loaded": MODEL is not None,
            "model_source": MODEL_SOURCE,
            "dataset_expected": NOTEBOOK_DATASET_NAME,
            "error": MODEL_LOAD_ERROR if MODEL is None else None,
        }
    )


@app.post("/predict")
def predict() -> Any:
    if MODEL is None:
        return (
            jsonify(
                {
                    "error": "Model is not loaded.",
                    "details": f"Expected model at '{MODEL_PATH}'.",
                    "load_error": MODEL_LOAD_ERROR,
                }
            ),
            500,
        )

    payload = request.get_json(silent=True) or {}
    features = payload.get("features")
    if not isinstance(features, dict):
        return jsonify({"error": "Invalid payload. 'features' object is required."}), 400

    try:
        normalized = _normalize_features(features)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    vector = np.array([[normalized[col] for col in FEATURE_ORDER]], dtype=float)

    try:
        pred = int(MODEL.predict(vector)[0])
        prob_1 = float(MODEL.predict_proba(vector)[0][1])
    except Exception as exc:
        return jsonify({"error": "Model inference failed", "details": str(exc)}), 500

    prob_0 = 1.0 - prob_1
    if prob_1 < 0.40:
        risk_level = "Low"
    elif prob_1 < 0.70:
        risk_level = "Medium"
    else:
        risk_level = "High"

    return jsonify(
        {
            "prediction": pred,
            "probability": [round(prob_0, 4), round(prob_1, 4)],
            "risk_level": risk_level,
            "model": "Random Forest (Tuned)",
        }
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
