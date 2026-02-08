import DashboardPage from '../../page'

interface SohbetPageProps {
  params: Promise<{
    uuid: string
  }>
}

export default async function SohbetPage({ params }: SohbetPageProps) {
  const { uuid } = await params
  return <DashboardPage initialConversationId={uuid} />
}
