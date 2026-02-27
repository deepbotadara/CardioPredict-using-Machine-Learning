'use client'

import React from 'react'
import { HeartPulse, Menu, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavbarProps {
  setSidebarOpen: (open: boolean) => void
}

export default function Navbar({ setSidebarOpen }: NavbarProps) {
  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-none">CardioPredict</h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">Cardiovascular Risk AI</p>
            </div>
          </div>
        </div>

        {/* Center Section */}
        <div className="hidden md:block text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Cardiovascular Disease Risk Predictor
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
