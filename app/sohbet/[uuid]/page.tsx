import { redirect } from 'next/navigation'

interface SohbetPageProps {
  params: Promise<{
    uuid: string
  }>
}

export default async function SohbetPage({ params }: SohbetPageProps) {
  const { uuid } = await params
  redirect(`/dashboard/sohbet/${uuid}`)
}
