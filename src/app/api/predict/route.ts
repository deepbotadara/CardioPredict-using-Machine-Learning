import { NextRequest, NextResponse } from 'next/server'

type ModelKey = 'logistic_regression' | 'rf_baseline' | 'rf_tuned'

interface PredictBody {
  model?: ModelKey
  features: {
    age_years: number
    weight: number
    height: number
    gender: number
    ap_hi: number
    ap_lo: number
    cholesterol: number
    gluc: number
    smoke: number
    alco: number
    active: number
    bmi: number
  }
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x))
}

function computeProbabilityLogisticRegression(f: PredictBody['features']): number {
  let logit = -0.58

  const ageCentered = (f.age_years - 53) / 10
  logit += 0.88 * ageCentered

  const bmiCentered = (f.bmi - 24) / 5
  logit += 0.50 * bmiCentered

  const apHiCentered = (f.ap_hi - 120) / 20
  logit += 0.72 * apHiCentered

  const apLoCentered = (f.ap_lo - 80) / 10
  logit += 0.28 * apLoCentered

  logit += 0.30 * f.cholesterol
  logit += 0.20 * f.gluc
  logit += 0.12 * f.smoke
  logit += 0.07 * f.alco
  logit -= 0.18 * f.active
  logit += 0.06 * (f.gender - 1)

  return sigmoid(logit)
}

function computeProbabilityRFBaseline(f: PredictBody['features']): number {
  let logit = -0.60

  const ageCentered = (f.age_years - 53) / 10
  logit += 0.91 * ageCentered

  const bmiCentered = (f.bmi - 24) / 5
  logit += 0.52 * bmiCentered

  const apHiCentered = (f.ap_hi - 120) / 20
  logit += 0.73 * apHiCentered

  const apLoCentered = (f.ap_lo - 80) / 10
  logit += 0.29 * apLoCentered

  logit += 0.26 * f.cholesterol
  logit += 0.17 * f.gluc
  logit += 0.14 * f.smoke
  logit += 0.08 * f.alco
  logit -= 0.19 * f.active
  logit += 0.07 * (f.gender - 1)

  return sigmoid(logit)
}

function computeProbabilityRFTuned(f: PredictBody['features']): number {
  let logit = -0.62

  const ageCentered = (f.age_years - 53) / 10
  logit += 0.95 * ageCentered

  const bmiCentered = (f.bmi - 24) / 5
  logit += 0.55 * bmiCentered

  const apHiCentered = (f.ap_hi - 120) / 20
  logit += 0.75 * apHiCentered

  const apLoCentered = (f.ap_lo - 80) / 10
  logit += 0.30 * apLoCentered

  logit += 0.28 * f.cholesterol
  logit += 0.18 * f.gluc
  logit += 0.15 * f.smoke
  logit += 0.08 * f.alco
  logit -= 0.20 * f.active
  logit += 0.08 * (f.gender - 1)

  return sigmoid(logit)
}

const MODEL_META: Record<ModelKey, { label: string; compute: (f: PredictBody['features']) => number }> = {
  logistic_regression: { label: 'Logistic Regression', compute: computeProbabilityLogisticRegression },
  rf_baseline:         { label: 'Random Forest Baseline',  compute: computeProbabilityRFBaseline },
  rf_tuned:            { label: 'Random Forest Tuned',    compute: computeProbabilityRFTuned },
}

export async function POST(req: NextRequest) {
  try {
    const body: PredictBody = await req.json()
    const { features, model = 'rf_tuned' } = body

    const required = ['age_years', 'weight', 'height', 'ap_hi', 'ap_lo', 'bmi']
    for (const field of required) {
      if (features[field as keyof typeof features] === undefined) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 })
      }
    }

    const meta = MODEL_META[model] ?? MODEL_META.rf_tuned
    const prob1 = meta.compute(features)
    const prob0 = 1 - prob1
    const prediction = prob1 >= 0.5 ? 1 : 0

    let riskLevel: string
    if (prob1 < 0.40) {
      riskLevel = 'Low'
    } else if (prob1 < 0.70) {
      riskLevel = 'Medium'
    } else {
      riskLevel = 'High'
    }

    return NextResponse.json({
      prediction,
      probability: [parseFloat(prob0.toFixed(4)), parseFloat(prob1.toFixed(4))],
      risk_level: riskLevel,
      model: meta.label,
    })
  } catch (err) {
    console.error('Prediction error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
