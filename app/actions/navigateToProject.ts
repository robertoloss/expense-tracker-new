'use server'
import { redirect } from "next/navigation"

export default async function navigateToProject(projectId: string) {
  redirect(`/dashboard/${projectId}`)
}
