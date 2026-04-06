import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './AppRouter.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { TransactionsProvider } from './context/TransactionsContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'

createRoot(document.getElementById('root')).render(
  <ToastProvider>
    <AuthProvider>
      <TransactionsProvider>
        <AppRouter />
      </TransactionsProvider>
    </AuthProvider>
  </ToastProvider>,
)
