'use client'

import React from 'react'
import { HeartPulse, LayoutDashboard, Zap, BarChart2, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavbarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const navItems = [
  { id: 'overview',  label: 'Dashboard',   icon: LayoutDashboard },
  { id: 'predict',   label: 'Predictions', icon: Zap },
  { id: 'analytics', label: 'Analytics',   icon: BarChart2 },
]

export default function Navbar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40">
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 h-0.5" />
      <nav className="bg-white/95 dark:bg-gray-950/95 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center h-14 px-4 sm:px-6 lg:px-8 gap-6">
          {/* Hamburger – visible only on mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 flex-shrink-0"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow">
              <HeartPulse className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-gray-900 dark:text-white tracking-tight hidden sm:block">CardioPredict</span>
          </div>

          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 flex-shrink-0 hidden lg:block" />

          {/* Tab nav – hidden on mobile (sidebar handles it) */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className={`w-4 h-4 ${ activeTab === item.id ? 'text-indigo-500' : '' }`} />
                {item.label}
                {activeTab === item.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  )
}
