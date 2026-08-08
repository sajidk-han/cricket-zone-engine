import { redirect } from 'next/navigation'

export default function MatchScoringPage({ params }: { params: { id: string } }) {
  redirect(`/matches/${params.id}/overview`)
}
