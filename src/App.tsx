import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './services/ProtectedRouterService'
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
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pages"
          element={
            <ProtectedRoute>
              <Pages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
