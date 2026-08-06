import { LeaderboardTable } from '@/components/ranking/LeaderboardTable'

export function RankingPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Ranking de Exploradores</h1>
        <p className="mt-1 text-sm text-text-muted">
          Reconocimiento y motivación social — ordenado por XP total. Datos de otros exploradores son mock.
        </p>
      </div>
      <LeaderboardTable />
    </div>
  )
}
