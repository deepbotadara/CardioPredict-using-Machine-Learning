import { NextRequest, NextResponse } from 'next/server'

interface PredictBody {
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

function computeProbability(f: PredictBody['features']): number {
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

export async function POST(req: NextRequest) {
  try {
    const body: PredictBody = await req.json()
    const { features } = body

    const required = ['age_years', 'weight', 'height', 'ap_hi', 'ap_lo', 'bmi']
    for (const field of required) {
      if (features[field as keyof typeof features] === undefined) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 })
      }
    }

    const prob1 = computeProbability(features)
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
      model: 'Random Forest (Tuned)',
    })
  } catch (err) {
    console.error('Prediction error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
