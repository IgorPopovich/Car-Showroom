import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import VehiclesPage from './pages/VehiclesPage/VehiclesPage'
import VehicleDetailsPage from './pages/VehicleDetailsPage/VehicleDetailsPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<VehiclesPage />} />
        <Route path="/vehicles/:vehicleId" element={<VehicleDetailsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
