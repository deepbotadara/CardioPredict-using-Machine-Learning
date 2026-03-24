'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Activity, Brain, CheckCircle2, Layers, ShieldCheck } from 'lucide-react'

const modelMetrics: Array<{ name: string; accuracy: number; auc: number | null }> = [
  { name: 'Logistic Regression', accuracy: 0.7203815626592879, auc: null },
  { name: 'RF Baseline', accuracy: 0.719216, auc: 0.781161 },
  { name: 'RF Tuned', accuracy: 0.731013, auc: 0.800544 },
]

const confusionData = [
  { category: 'True Negative', value: 5470, fill: '#6366f1' },
  { category: 'False Positive', value: 1534, fill: '#ef4444' },
  { category: 'False Negative', value: 2220, fill: '#f97316' },
  { category: 'True Positive', value: 4776, fill: '#10b981' },
]

const performanceData = [
  { metric: 'Accuracy', 'LR': 72.04, 'RF-B': 71.92, 'RF-T': 73.10 },
  { metric: 'Precision', 'LR': null, 'RF-B': 72.42, 'RF-T': 75.78 },
  { metric: 'Recall', 'LR': null, 'RF-B': 69.89, 'RF-T': 67.11 },
  { metric: 'F1 Score', 'LR': null, 'RF-B': 71.13, 'RF-T': 71.18 },
  { metric: 'ROC AUC', 'LR': null, 'RF-B': 78.12, 'RF-T': 80.05 },
]

const kpis = [
  { label: 'Best Accuracy', value: '73.2%', sub: 'RF Tuned Model', icon: TrendingUp, color: 'indigo' },
  { label: 'Best ROC AUC', value: '0.800544', sub: 'Random Forest (Tuned)', icon: Activity, color: 'emerald' },
  { label: 'Models Active', value: '3', sub: 'All tuned & ready', icon: Layers, color: 'violet' },
  { label: 'Best CV ROC AUC', value: '0.7994', sub: 'GridSearchCV (cv=3)', icon: ShieldCheck, color: 'amber' },
]

const colorMap: Record<string, string> = {
  indigo: 'bg-indigo-500',
  emerald: 'bg-emerald-500',
  violet: 'bg-violet-500',
  amber: 'bg-amber-500',
}
const textColorMap: Record<string, string> = {
  indigo: 'text-indigo-600 dark:text-indigo-400',
  emerald: 'text-emerald-600 dark:text-emerald-400',
  violet: 'text-violet-600 dark:text-violet-400',
  amber: 'text-amber-600 dark:text-amber-400',
}
const bgColorMap: Record<string, string> = {
  indigo: 'bg-indigo-50 dark:bg-indigo-950/50',
  emerald: 'bg-emerald-50 dark:bg-emerald-950/50',
  violet: 'bg-violet-50 dark:bg-violet-950/50',
  amber: 'bg-amber-50 dark:bg-amber-950/50',
}

export default function Overview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">Overview</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Model Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Real-time model performance and analytics</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">All systems ready</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className={`h-1 ${colorMap[k.color]}`} />
            <CardContent className="pt-4 pb-4">
              <div className={`w-8 h-8 rounded-lg ${bgColorMap[k.color]} flex items-center justify-center mb-3`}>
                <k.icon className={`w-4 h-4 ${textColorMap[k.color]}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{k.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{k.label}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{k.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Performance Comparison</CardTitle>
            <CardDescription className="text-xs">All models across key metrics (%)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={performanceData} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="metric" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} domain={[60, 85]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e1b4b', border: '1px solid #3730a3', borderRadius: '10px', fontSize: 12 }}
                  labelStyle={{ color: '#e0e7ff' }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="LR" name="Log. Reg." fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="RF-B" name="RF Baseline" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="RF-T" name="RF Tuned" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Confusion Matrix — RF Tuned</CardTitle>
            <CardDescription className="text-xs">Best model predictions on test data</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={confusionData}
                  cx="50%" cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ category, value }) => `${category}: ${value}`}
                  labelLine={false}
                >
                  {confusionData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip formatter={(v) => Number(v).toLocaleString()} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Model Details</CardTitle>
          <CardDescription className="text-xs">Comprehensive metrics for all trained models</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modelMetrics.map((model, i) => (
              <div key={model.name} className={`rounded-xl p-4 border ${ i === 2 ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50' }`}>
                <div className="flex items-center gap-2 mb-3">
                  {i === 2 && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500 text-white">BEST</span>}
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{model.name}</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Accuracy</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{(model.accuracy * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${ i === 2 ? 'bg-indigo-500' : 'bg-gray-400' }`} style={{ width: `${model.accuracy * 100}%` }} />
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">ROC AUC</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{model.auc === null ? 'N/A' : model.auc.toFixed(3)}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${ i === 2 ? 'bg-emerald-500' : 'bg-gray-400' }`} style={{ width: `${(model.auc ?? 0) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardContent className="pt-5">
          <div className="flex flex-wrap gap-4">
            {['All models loaded successfully', 'Prediction API operational', 'Ready for inference'].map(msg => (
              <div key={msg} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{msg}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

