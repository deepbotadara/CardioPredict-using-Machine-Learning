'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertCircle, CheckCircle2, Zap, Heart, Loader2,
  User, Activity, Cigarette, FlaskConical, ShieldCheck,
  TrendingUp, Info, AlertTriangle, ChevronRight, ChevronLeft,
} from 'lucide-react'

interface PredictionResult {
  model: string
  prediction: number
  prob0: number
  prob1: number
  riskLevel: string
  confidence: number
}

const riskConfig = {
  low: {
    bar: 'bg-emerald-500',
    border: 'border-emerald-300 dark:border-emerald-700',
    headerBg: 'bg-emerald-50 dark:bg-emerald-950/60',
    badge: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700',
    text: 'text-emerald-600 dark:text-emerald-400',
    icon: CheckCircle2,
    label: 'Low Risk',
    advice: 'Your cardiovascular health indicators look good. Maintain your current lifestyle with regular exercise and a balanced diet.',
  },
  medium: {
    bar: 'bg-amber-500',
    border: 'border-amber-300 dark:border-amber-700',
    headerBg: 'bg-amber-50 dark:bg-amber-950/60',
    badge: 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700',
    text: 'text-amber-600 dark:text-amber-400',
    icon: AlertCircle,
    label: 'Medium Risk',
    advice: 'Some risk factors detected. Consider consulting a cardiologist and improving diet, exercise, and blood pressure monitoring.',
  },
  high: {
    bar: 'bg-rose-500',
    border: 'border-rose-300 dark:border-rose-700',
    headerBg: 'bg-rose-50 dark:bg-rose-950/60',
    badge: 'bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-700',
    text: 'text-rose-600 dark:text-rose-400',
    icon: AlertTriangle,
    label: 'High Risk',
    advice: 'High risk detected. Immediate consultation with a cardiologist is strongly recommended. Monitor blood pressure and lifestyle closely.',
  },
}

const getBmiCategory = (bmi: number) => {
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500' }
  if (bmi < 25)   return { label: 'Normal',      color: 'text-emerald-500' }
  if (bmi < 30)   return { label: 'Overweight',  color: 'text-amber-500' }
  return             { label: 'Obese',           color: 'text-rose-500' }
}

const getBpCategory = (sys: number) => {
  if (sys < 120) return { label: 'Normal',         color: 'text-emerald-500' }
  if (sys < 130) return { label: 'Elevated',       color: 'text-amber-400' }
  if (sys < 140) return { label: 'Stage 1 Hyper',  color: 'text-amber-600' }
  return           { label: 'Stage 2 Hyper',       color: 'text-rose-500' }
}

export default function PredictionForm() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [resultPage, setResultPage] = useState(0)
  const [formData, setFormData] = useState({
    age_years: 45, weight: 70, height: 170, gender: 1,
    cholesterol: 1, gluc: 1, ap_hi: 120, ap_lo: 80,
    smoke: 0, alco: 0, active: 1,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: isNaN(Number(value)) ? value : Number(value) }))
  }

  const handlePredict = async () => {
    setLoading(true)
    try {
      const heightM = formData.height / 100
      const bmi = formData.weight / (heightM * heightM)
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'random_forest', features: { ...formData, bmi } }),
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || `API error: ${response.status}`)
      }
      const data = await response.json()
      setResultPage(0)
      setResult({
        model: 'Random Forest (Tuned)',
        prediction: data.prediction,
        prob0: data.probability[0],
        prob1: data.probability[1],
        riskLevel: data.risk_level.toLowerCase(),
        confidence: data.probability[1] * 100,
      })
    } catch (error) {
      alert(`Error making prediction: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600 transition"
  const labelCls = "block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide"

  const bmi = formData.weight / ((formData.height / 100) ** 2)
  const bmiCat = getBmiCategory(bmi)
  const bpCat  = getBpCategory(formData.ap_hi)

  const riskFactors = [
    { label: 'Age',             value: `${formData.age_years} yrs`,   flagged: formData.age_years > 55 },
    { label: 'Systolic BP',     value: `${formData.ap_hi} mmHg`,      flagged: formData.ap_hi >= 130 },
    { label: 'Diastolic BP',    value: `${formData.ap_lo} mmHg`,      flagged: formData.ap_lo >= 90 },
    { label: 'BMI',             value: `${bmi.toFixed(1)} kg/m2`,     flagged: bmi >= 25 },
    { label: 'Cholesterol',     value: ['Normal','Above Normal','Well Above Normal'][formData.cholesterol] ?? 'Normal', flagged: formData.cholesterol >= 1 },
    { label: 'Glucose',         value: ['Normal','Above Normal','Well Above Normal'][formData.gluc] ?? 'Normal',        flagged: formData.gluc >= 1 },
    { label: 'Smoking',         value: formData.smoke ? 'Yes' : 'No',  flagged: formData.smoke === 1 },
    { label: 'Alcohol',         value: formData.alco  ? 'Yes' : 'No',  flagged: formData.alco  === 1 },
    { label: 'Physical Active', value: formData.active ? 'Yes' : 'No', flagged: formData.active === 0 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">AI Prediction</span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">Make a Prediction</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Enter patient vitals to assess cardiovascular disease risk</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900">
          <ShieldCheck className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">RF Tuned Model</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 space-y-4">

          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500" />
            <CardHeader className="pb-3 pt-4 px-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">Personal Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className={labelCls}>Age <span className="normal-case font-normal text-gray-400">(yrs)</span></label>
                  <input type="number" name="age_years" value={formData.age_years} onChange={handleInputChange} min="18" max="80" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Weight <span className="normal-case font-normal text-gray-400">(kg)</span></label>
                  <input type="number" name="weight" value={formData.weight} onChange={handleInputChange} min="30" max="150" step="0.1" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Height <span className="normal-case font-normal text-gray-400">(cm)</span></label>
                  <input type="number" name="height" value={formData.height} onChange={handleInputChange} min="120" max="220" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange} className={inputCls}>
                    <option value="1">Female</option>
                    <option value="2">Male</option>
                  </select>
                </div>
              </div>
              <div className="mt-3 px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Calculated BMI</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${bmiCat.color}`}>{bmiCat.label}</span>
                  <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">{isNaN(bmi) ? '--' : bmi.toFixed(1)} <span className="text-[10px] font-normal">kg/m2</span></span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="h-0.5 bg-gradient-to-r from-rose-400 to-pink-500" />
            <CardHeader className="pb-3 pt-4 px-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                </div>
                <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">Blood Pressure & Cholesterol</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Systolic BP <span className="normal-case font-normal text-gray-400">(mmHg)</span></label>
                  <input type="number" name="ap_hi" value={formData.ap_hi} onChange={handleInputChange} min="80" max="200" className={inputCls} />
                  <p className={`text-[10px] mt-1 font-medium ${bpCat.color}`}>{bpCat.label}</p>
                </div>
                <div>
                  <label className={labelCls}>Diastolic BP <span className="normal-case font-normal text-gray-400">(mmHg)</span></label>
                  <input type="number" name="ap_lo" value={formData.ap_lo} onChange={handleInputChange} min="40" max="130" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Cholesterol</label>
                  <select name="cholesterol" value={formData.cholesterol} onChange={handleInputChange} className={inputCls}>
                    <option value="0">Normal</option>
                    <option value="1">Above Normal</option>
                    <option value="2">Well Above Normal</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="h-0.5 bg-gradient-to-r from-amber-400 to-orange-500" />
            <CardHeader className="pb-3 pt-4 px-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center">
                  <Cigarette className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">Glucose & Lifestyle Factors</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className={labelCls}>Blood Glucose</label>
                  <select name="gluc" value={formData.gluc} onChange={handleInputChange} className={inputCls}>
                    <option value="0">Normal</option>
                    <option value="1">Above Normal</option>
                    <option value="2">Well Above Normal</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Smoking</label>
                  <select name="smoke" value={formData.smoke} onChange={handleInputChange} className={inputCls}>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Alcohol</label>
                  <select name="alco" value={formData.alco} onChange={handleInputChange} className={inputCls}>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Physical Activity</label>
                  <select name="active" value={formData.active} onChange={handleInputChange} className={inputCls}>
                    <option value="0">Inactive</option>
                    <option value="1">Active</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handlePredict}
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 text-sm shadow-lg shadow-indigo-200 dark:shadow-indigo-900"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analysing patient data...</>
            ) : (
              <><Zap className="w-4 h-4 mr-2" />Run Cardiovascular Risk Assessment</>
            )}
          </Button>

        </div>

        <div className="lg:col-span-2 space-y-4">
          {result ? (() => {
            const cfg = riskConfig[result.riskLevel as keyof typeof riskConfig] ?? riskConfig.medium
            const Icon = cfg.icon
            const flaggedCount = riskFactors.filter(f => f.flagged).length
            const pages = [
              { id: 0, label: 'Result',       PageIcon: Activity },
              { id: 1, label: 'Risk Factors', PageIcon: AlertCircle },
              { id: 2, label: 'Models',       PageIcon: FlaskConical },
            ]

            const NavBar = () => (
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40">
                <button
                  onClick={() => setResultPage(p => Math.max(0, p - 1))}
                  disabled={resultPage === 0}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:border-indigo-300 dark:hover:border-indigo-700"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <div className="flex items-center gap-1">
                  {pages.map(p => (
                    <button key={p.id} onClick={() => setResultPage(p.id)} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${ resultPage === p.id ? 'bg-indigo-50 dark:bg-indigo-950' : 'hover:bg-gray-100 dark:hover:bg-gray-800' }`}>
                      <p.PageIcon className={`w-3.5 h-3.5 transition-all ${ resultPage === p.id ? 'text-indigo-500' : 'text-gray-400 dark:text-gray-500' }`} />
                      <span className={`text-[10px] font-semibold hidden sm:block ${ resultPage === p.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500' }`}>{p.label}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setResultPage(p => Math.min(2, p + 1))}
                  disabled={resultPage === 2}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:border-indigo-300 dark:hover:border-indigo-700"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            )

            if (resultPage === 2) {
              return (
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 overflow-hidden">
                  <NavBar />
                  <div className="px-5 pt-4 pb-2 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
                      <FlaskConical className="w-3.5 h-3.5 text-indigo-500" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Available Models</span>
                  </div>
                  <CardContent className="px-5 pb-5 pt-3">
                    <div className="space-y-3">
                      {[
                        { name: 'Logistic Regression',    accuracy: 72.4, auc: 0.786, color: 'bg-indigo-500',  textColor: 'text-indigo-600 dark:text-indigo-400',  bgColor: 'bg-indigo-50 dark:bg-indigo-950/50',  best: false },
                        { name: 'Random Forest Baseline', accuracy: 72.1, auc: 0.783, color: 'bg-violet-500',  textColor: 'text-violet-600 dark:text-violet-400',  bgColor: 'bg-violet-50 dark:bg-violet-950/50',  best: false },
                        { name: 'Random Forest Tuned',    accuracy: 73.2, auc: 0.798, color: 'bg-emerald-500', textColor: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-950/50', best: true  },
                      ].map((m) => (
                        <div key={m.name} className={`rounded-xl p-3 border ${ m.best ? `border-emerald-200 dark:border-emerald-800 ${m.bgColor}` : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50' }`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${m.color}`} />
                              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{m.name}</span>
                            </div>
                            {m.best && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">ACTIVE</span>}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-[10px] text-gray-400 mb-1">Accuracy</p>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                <div className={`h-1.5 rounded-full ${m.color}`} style={{ width: `${m.accuracy}%` }} />
                              </div>
                              <p className={`text-[10px] font-bold mt-0.5 ${m.textColor}`}>{m.accuracy}%</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-400 mb-1">ROC AUC</p>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                <div className={`h-1.5 rounded-full ${m.color}`} style={{ width: `${m.auc * 100}%` }} />
                              </div>
                              <p className={`text-[10px] font-bold mt-0.5 ${m.textColor}`}>{m.auc}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            }

            if (resultPage === 1) {
              return (
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 overflow-hidden">
                  <NavBar />
                  <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">Risk Factor Analysis</span>
                    </div>
                    {flaggedCount > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-300">{flaggedCount} flagged</span>
                    )}
                  </div>
                  <CardContent className="px-4 pb-4 pt-2">
                    <div className="space-y-1.5">
                      {riskFactors.map(({ label, value, flagged }) => (
                        <div key={label} className={`flex items-center justify-between px-3 py-2 rounded-lg ${ flagged ? 'bg-rose-50 dark:bg-rose-950/40' : 'bg-gray-50 dark:bg-gray-800/50' }`}>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${ flagged ? 'bg-rose-500' : 'bg-emerald-500' }`} />
                            <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
                          </div>
                          <span className={`text-xs font-semibold ${ flagged ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400' }`}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            }

            return (
              <Card className={`bg-white dark:bg-gray-900 border-2 ${cfg.border} overflow-hidden`}>
                <NavBar />
                <div className={`${cfg.headerBg} px-5 py-4 border-b ${cfg.border}`}>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${cfg.badge}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {cfg.label}
                  </div>
                  <p className={`text-2xl font-bold mt-2 ${cfg.text}`}>
                    {result.prediction === 1 ? 'Disease Present' : 'Disease Absent'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {result.prediction === 1
                      ? 'Cardiovascular disease detected with elevated probability'
                      : 'No cardiovascular disease detected at this time'}
                  </p>
                </div>
                <CardContent className="px-5 py-4 space-y-4">

                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider mb-2.5">Probability Breakdown</p>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">No Disease</span>
                          <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{(result.prob0 * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                          <div className="h-2 rounded-full bg-emerald-500 transition-all" style={{ width: `${result.prob0 * 100}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className={`text-xs font-medium ${cfg.text}`}>Disease Present</span>
                          <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{(result.prob1 * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                          <div className={`h-2 rounded-full ${cfg.bar} transition-all`} style={{ width: `${result.prob1 * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider mb-2.5">Patient Summary</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Age',         value: `${formData.age_years} yrs` },
                        { label: 'BMI',         value: `${bmi.toFixed(1)} kg/m2`, extra: bmiCat.label, extraColor: bmiCat.color },
                        { label: 'Systolic BP', value: `${formData.ap_hi} mmHg`,  extra: bpCat.label,  extraColor: bpCat.color },
                        { label: 'Diastolic BP',value: `${formData.ap_lo} mmHg` },
                        { label: 'Gender',      value: formData.gender === 2 ? 'Male' : 'Female' },
                        { label: 'Model',       value: 'RF Tuned' },
                      ].map(({ label, value, extra, extraColor }) => (
                        <div key={label} className="px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                          <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">{value}</p>
                          {extra && <p className={`text-[10px] font-medium ${extraColor}`}>{extra}</p>}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`rounded-xl px-4 py-3 ${cfg.headerBg} border ${cfg.border}`}>
                    <div className="flex items-start gap-2">
                      <Info className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${cfg.text}`} />
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{cfg.advice}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })() : (
            <>
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500" />
                <CardContent className="pt-5 pb-5 px-5">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center flex-shrink-0">
                      <Activity className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Ready to Assess</p>
                      <p className="text-[10px] text-gray-400">Follow these steps to get your prediction</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {([
                      { step: '1', Icon: User,      text: 'Enter age, weight, height & gender' },
                      { step: '2', Icon: Heart,     text: 'Set blood pressure & cholesterol' },
                      { step: '3', Icon: Cigarette, text: 'Fill glucose & lifestyle factors' },
                      { step: '4', Icon: Zap,       text: 'Click "Run Assessment" for results' },
                    ] as const).map(({ step, Icon: StepIcon, text }) => (
                      <div key={step} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                        <span className="w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">{step}</span>
                        <StepIcon className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">{text}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
                      <FlaskConical className="w-3 h-3 text-indigo-500" />
                    </div>
                    <CardTitle className="text-xs font-semibold text-gray-900 dark:text-white">Model Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="space-y-2">
                    {[
                      ['Algorithm',    'Random Forest'],
                      ['Accuracy',     '73.2%'],
                      ['ROC AUC',      '0.798'],
                      ['Train Samples','70,000'],
                      ['CV Stability', '+/-0.003'],
                      ['Features',     '11 clinical'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{k}</span>
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{v}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
