import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import ErrorBoundary from '@/components/ui/ErrorBoundary/ErrorBoundary'
import router from '@/router'

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  )
}
