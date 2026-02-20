export default function AppHeader({ route }) {
  return (
    <header className="header">
      <div className="header-dot" />
      <span className="header-title">
        {route === 'HOME'
          ? 'screen-share-test / home'
          : 'screen-share-test / screen-test'}
      </span>
    </header>
  )
}