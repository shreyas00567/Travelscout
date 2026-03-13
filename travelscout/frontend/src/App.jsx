import React, { useState } from 'react'
import HomePage from './components/HomePage'
import TripPlanner from './components/TripPlanner'
import { Menu, X, MapPin, Route } from 'lucide-react'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  return (
    <div className="App">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <MapPin className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-800">TravelScout</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage('home')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === 'home'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentPage('planner')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                  currentPage === 'planner'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Route className="w-4 h-4" />
                <span>Trip Planner</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16">
        {currentPage === 'home' ? <HomePage /> : <TripPlanner />}
      </div>
    </div>
  )
}

export default App
