'use client'

import React, { useState } from 'react'
import Navbar from '@/components/navbar'
import Sidebar from '@/components/sidebar'
import Overview from '@/components/pages/overview'
import PredictionForm from '@/components/pages/prediction-form'
import Analytics from '@/components/pages/analytics'

export default function MainDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderPage = () => {
    switch (activeTab) {
      case 'overview': return <Overview />
      case 'predict': return <PredictionForm />
      case 'analytics': return <Analytics />
      default: return <Overview />
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {renderPage()}
          </div>
          <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-center gap-2">
              <span className="text-xs text-gray-400 dark:text-gray-500">Crafted with</span>
              <span className="text-xs text-rose-400">♥</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">by</span>
              <span className="text-xs font-semibold bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">Deep Botadara</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
