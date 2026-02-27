'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { HeartPulse, BarChart3, Zap, Activity, X } from 'lucide-react'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function Sidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }: SidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: BarChart3, description: 'Model & Metrics' },
    { id: 'predict', label: 'Predictions', icon: Zap, description: 'New Prediction' },
    { id: 'analytics', label: 'Analytics', icon: Activity, description: 'Deep Analysis' },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white transition-transform z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Close Button Mobile */}
        <div className="lg:hidden flex justify-end p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="text-white hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Logo */}
        <div className="px-6 py-8 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">CardioPredict</h2>
              <p className="text-xs text-slate-400">Cardiovascular Risk AI</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-8 flex-1">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                </div>
              </button>
            ))}
          </div>


        </nav>

        {/* Footer */}
        <div className="px-4 py-6 border-t border-slate-700">
          <div>
            <div className="text-xs text-slate-400 mb-2">Trained Models</div>
            <div className="text-sm font-semibold text-white">3 Models Active</div>
            <div className="text-xs text-green-400">✓ All systems operational</div>
          </div>
        </div>
      </aside>
    </>
  )
}
