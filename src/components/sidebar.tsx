'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { HeartPulse, LayoutDashboard, Zap, BarChart2, X, Cpu } from 'lucide-react'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function Sidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }: SidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, description: 'Model & Metrics' },
    { id: 'predict', label: 'Predictions', icon: Zap, description: 'New Prediction' },
    { id: 'analytics', label: 'Analytics', icon: BarChart2, description: 'Deep Analysis' },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static left-0 top-0 h-screen w-60 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform z-40 shadow-lg lg:shadow-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile close */}
        <div className="lg:hidden flex justify-end p-3 border-b border-gray-100 dark:border-gray-800">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Logo block */}
        <div className="px-5 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">CardioPredict</p>
              <p className="text-[10px] text-gray-400 leading-none mt-0.5">Risk AI Platform</p>
            </div>
          </div>
        </div>

        {/* Nav label */}
        <div className="px-5 pt-5 pb-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Navigation</p>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-2 flex-1 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false) }}
              className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center gap-3 group ${
                activeTab === item.id
                  ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                activeTab === item.id
                  ? 'bg-indigo-500 shadow-md shadow-indigo-200 dark:shadow-indigo-900'
                  : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
              }`}>
                <item.icon className={`w-4 h-4 ${ activeTab === item.id ? 'text-white' : 'text-gray-500 dark:text-gray-400' }`} />
              </div>
              <div>
                <p className={`text-sm font-semibold leading-none ${ activeTab === item.id ? 'text-indigo-700 dark:text-indigo-300' : '' }`}>{item.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{item.description}</p>
              </div>
              {activeTab === item.id && (
                <div className="ml-auto w-1.5 h-5 bg-indigo-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Footer status */}
        <div className="mx-3 mb-4 p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950 dark:to-violet-950 border border-indigo-100 dark:border-indigo-900">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-3.5 h-3.5 text-indigo-500" />
            <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">Model Status</p>
          </div>
          <div className="space-y-1 mb-1.5">
            {['Logistic Regression', 'RF Baseline', 'RF Tuned'].map((m) => (
              <div key={m} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0" />
                <span className="text-[10px] text-gray-600 dark:text-gray-400">{m}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-indigo-100 dark:border-indigo-900">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">All systems operational</p>
          </div>
        </div>
      </aside>
    </>
  )
}
