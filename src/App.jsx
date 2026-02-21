import { useState } from 'react'
import { Route } from './constants.js'
import AppHeader from './components/AppHeader.jsx'
import HomePage from './pages/HomePage.jsx'
import ScreenTestPage from './pages/ScreenTestPage.jsx'

export default function App() {
  const [route, setRoute] = useState(Route.HOME)

  return (
    <div className="min-h-screen flex flex-col bg-bg text-white font-display">
      <AppHeader route={route} />
      {route === Route.HOME
        ? <HomePage onNavigate={setRoute} />
        : <ScreenTestPage onNavigate={setRoute} />}
    </div>
  )
}