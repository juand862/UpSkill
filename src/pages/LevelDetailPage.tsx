import { useParams } from 'react-router-dom'
import { PlaceholderScreen } from '@/components/ui/PlaceholderScreen'

export function LevelDetailPage() {
  const { levelId } = useParams()
  return (
    <PlaceholderScreen
      icono="school"
      titulo={`Detalle del nivel ${levelId ?? ''}`}
      bloque={5}
      descripcion="Módulos del nivel, XP por módulo y la acción de completar cada uno."
    />
  )
}
