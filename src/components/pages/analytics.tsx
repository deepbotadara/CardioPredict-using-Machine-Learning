'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, Gauge, Lightbulb } from 'lucide-react'

const learningCurveData = [
  { size: 1000, train: 0.68, test: 0.64 },
  { size: 5000, train: 0.72, test: 0.70 },
  { size: 10000, train: 0.74, test: 0.72 },
  { size: 20000, train: 0.76, test: 0.74 },
  { size: 40000, train: 0.78, test: 0.76 },
  { size: 56000, train: 0.81, test: 0.78 },
]

const featureImportanceData = [
  { name: 'age (years)', importance: 45 },
  { name: 'systolic_bp (ap_hi)', importance: 20 },
  { name: 'weight (kg)', importance: 16 },
  { name: 'diastolic_bp (ap_lo)', importance: 8 },
  { name: 'cholesterol', importance: 6 },
  { name: 'Others', importance: 5 },
]

const summaryStats = [
  { label: 'Best ROC AUC', value: '79.8%', sub: 'RF Tuned model', icon: TrendingUp, accent: 'emerald' },
  { label: 'Overfitting Gap', value: '3.2%', sub: 'Train–Test difference', icon: Gauge, accent: 'indigo' },
  { label: 'Tuning Impact', value: '+1.5%', sub: 'Accuracy improvement', icon: TrendingDown, accent: 'violet' },
]

const accentBg: Record<string, string> = {
  emerald: 'bg-emerald-50 dark:bg-emerald-950/50',
  indigo: 'bg-indigo-50 dark:bg-indigo-950/50',
  violet: 'bg-violet-50 dark:bg-violet-950/50',
}
const accentText: Record<string, string> = {
  emerald: 'text-emerald-600 dark:text-emerald-400',
  indigo: 'text-indigo-600 dark:text-indigo-400',
  violet: 'text-violet-600 dark:text-violet-400',
}
const accentBar: Record<string, string> = {
  emerald: 'bg-emerald-500',
  indigo: 'bg-indigo-500',
  violet: 'bg-violet-500',
}

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">Deep Analysis</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Insights</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Deep dive into model performance and learning patterns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryStats.map((s) => (
          <Card key={s.label} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className={`h-1 ${accentBar[s.accent]}`} />
            <CardContent className="pt-4 pb-4">
              <div className={`w-8 h-8 rounded-lg ${accentBg[s.accent]} flex items-center justify-center mb-3`}>
                <s.icon className={`w-4 h-4 ${accentText[s.accent]}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
              <p className={`text-xs font-semibold mt-1 ${accentText[s.accent]}`}>{s.label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Learning Curve Analysis</CardTitle>
          <CardDescription className="text-xs">Model performance vs training data size — indicates no underfitting</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={learningCurveData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="size" stroke="#94a3b8" tick={{ fontSize: 11 }}
                label={{ value: 'Training Samples', position: 'insideBottomRight', offset: -5, fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }}
                label={{ value: 'Accuracy', angle: -90, position: 'insideLeft', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e1b4b', border: '1px solid #3730a3', borderRadius: '10px', fontSize: 12 }}
                labelStyle={{ color: '#e0e7ff' }}
                formatter={(value) => (Number(value) * 100).toFixed(1) + '%'}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="train" stroke="#6366f1" dot={{ fill: '#6366f1', r: 4 }}
                name="Training Accuracy" strokeWidth={2.5} />
              <Line type="monotone" dataKey="test" stroke="#10b981" dot={{ fill: '#10b981', r: 4 }}
                name="Test Accuracy" strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Feature Importance — Random Forest</CardTitle>
          <CardDescription className="text-xs">Which features contribute most to predictions (%)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {featureImportanceData.map((f, i) => {
              const colors = ['bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-blue-500', 'bg-cyan-500', 'bg-teal-500']
              return (
                <div key={f.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{f.name}</span>
                    <span className="text-xs font-bold text-gray-900 dark:text-white">{f.importance}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full ${colors[i]} transition-all`} style={{ width: `${f.importance * 2}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">5-Fold Cross-Validation</CardTitle>
            <CardDescription className="text-xs">Model stability across different data splits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { fold: 'Fold 1', score: 0.7862 },
                { fold: 'Fold 2', score: 0.7881 },
                { fold: 'Fold 3', score: 0.7845 },
                { fold: 'Fold 4', score: 0.7858 },
                { fold: 'Fold 5', score: 0.7868 },
              ].map((item) => (
                <div key={item.fold}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{item.fold}</span>
                    <span className="text-xs font-bold text-gray-900 dark:text-white">{item.score.toFixed(4)}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                    <div className="h-2 bg-indigo-500 rounded-full" style={{ width: `${item.score * 100}%` }} />
                  </div>
                </div>
              ))}
              <div className="mt-4 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900">
                <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium uppercase tracking-wider mb-1">Average CV Score</p>
                <p className="text-xl font-bold text-indigo-900 dark:text-indigo-100">0.7864 <span className="text-sm font-normal">± 0.0026</span></p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Model Comparison Summary</CardTitle>
            <CardDescription className="text-xs">Key metrics across all trained models</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { model: 'Logistic Regression', auc: 0.786, accuracy: 0.724, best: false },
                { model: 'RF Baseline', auc: 0.783, accuracy: 0.721, best: false },
                { model: 'RF Tuned', auc: 0.798, accuracy: 0.732, best: true },
              ].map((item) => (
                <div key={item.model} className={`p-3 rounded-xl border ${item.best ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{item.model}</h4>
                    {item.best && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500 text-white">BEST</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><p className="text-gray-400">ROC AUC</p><p className="font-bold text-gray-900 dark:text-white">{item.auc.toFixed(3)}</p></div>
                    <div><p className="text-gray-400">Accuracy</p><p className="font-bold text-gray-900 dark:text-white">{(item.accuracy * 100).toFixed(1)}%</p></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Key Insights</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Random Forest (Tuned) achieves best performance with 79.8% ROC AUC',
              'Low overfitting gap (3.2%) indicates good generalization capability',
              'age, systolic_bp, and weight are the top 3 predictive features',
              'CV stability (±0.003) shows consistent performance across data splits',
              'Hyperparameter tuning improved accuracy by +1.5%',
              'ROC AUC improved from 0.783 → 0.798 after tuning',
            ].map((insight) => (
              <div key={insight} className="flex items-start gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                <span className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                </span>
                <p className="text-xs text-gray-700 dark:text-gray-300">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
