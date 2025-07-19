import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRouter } from './pages/ProtectedRouter'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Pages } from './pages/Pages'
import { Settings } from './pages/Settings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRouter>
              <Dashboard />
            </ProtectedRouter>
          }
        />
        <Route
          path="/pages"
          element={
            <ProtectedRouter>
              <Pages />
            </ProtectedRouter>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRouter>
              <Settings />
            </ProtectedRouter>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
