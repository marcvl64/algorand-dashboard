import { AlgoClientProvider } from './clients/AlgoClientProvider'
import { Dashboard } from './components/dashboard/Dashboard'

export default function App() {
  return (
    <AlgoClientProvider>
      <Dashboard />
    </AlgoClientProvider>
  )
}
