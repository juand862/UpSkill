import { Outlet } from 'react-router-dom'
import { Header } from '@/components/layout/Header'

/** Layout base de todas las pantallas post-landing: Header + HUD persistente + contenido */
export function AppLayout() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
