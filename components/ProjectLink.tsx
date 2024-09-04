'use client'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Project } from '@/prisma/prisma-client'

type Props = {
	project: Project
}
export default function ProjectLink({ project }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(() => {
      router.push(`/dashboard/${project.id}`)
    })
  }

  return (
    <button 
      onClick={handleClick}
      className="text-left gap-2 transition-all flex items-center justify-between 
				p-4 bg-card hover:bg-accent rounded-lg "
    >
      <span className="text-xl font-semibold">{project.name}</span>
      {isPending && (
        <Loader2 className="animate-spin h-5 w-5 text-muted-foreground" />
      )}
    </button>
  )
}
