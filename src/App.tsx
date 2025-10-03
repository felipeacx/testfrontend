import React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { useAuth } from "./hooks/useAuth"
import { Login } from "./views/Login"
import { Dashboard } from "./views/Dashboard"

const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </Router>
  )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
