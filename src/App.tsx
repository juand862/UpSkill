import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { LandingPage } from '@/pages/LandingPage'
import { MapPage } from '@/pages/MapPage'
import { LevelDetailPage } from '@/pages/LevelDetailPage'
import { PassportPage } from '@/pages/PassportPage'
import { EvaluationPage } from '@/pages/EvaluationPage'
import { RankingPage } from '@/pages/RankingPage'
import { CommunityPage } from '@/pages/CommunityPage'
import { RewardsPage } from '@/pages/RewardsPage'
import { AccountPage } from '@/pages/AccountPage'

/**
 * App.tsx — enrutamiento del prototipo.
 * '/' es una pantalla inmersiva sin chrome (Landing); todo lo demás vive
 * bajo <AppLayout> (Header + HUD persistente).
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<AppLayout />}>
          <Route path="/mapa" element={<MapPage />} />
          <Route path="/nivel/:levelId" element={<LevelDetailPage />} />
          <Route path="/pasaporte" element={<PassportPage />} />
          <Route path="/evaluacion" element={<EvaluationPage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/comunidad" element={<CommunityPage />} />
          <Route path="/recompensas" element={<RewardsPage />} />
          <Route path="/cuenta" element={<AccountPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
