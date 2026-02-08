import { redirect } from 'next/navigation'

interface SohbetPageProps {
  params: {
    uuid: string
  }
}

export default function SohbetPage({ params }: SohbetPageProps) {
  redirect(`/dashboard/sohbet/${params.uuid}`)
}
