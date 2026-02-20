import { useState } from 'react'
import { Route } from './constants.js'
import styles from './styles.js'
import AppHeader from './components/AppHeader.jsx'
import HomePage from './pages/HomePage.jsx'
import ScreenTestPage from './pages/ScreenTestPage.jsx'

export default function App() {
  const [route, setRoute] = useState(Route.HOME)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="app">
        <AppHeader route={route} />
        {route === Route.HOME
          ? <HomePage onNavigate={setRoute} />
          : <ScreenTestPage onNavigate={setRoute} />}
      </div>
    </>
  )
}