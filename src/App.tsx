import { AlgoClientProvider } from './clients/AlgoClientProvider'
import { DashboardTabs } from './components/dashboard/DashboardTabs'

export default function App() {
  return (
    <AlgoClientProvider>
      <DashboardTabs />
    </AlgoClientProvider>
  )
}
