'use server'
import { Profile } from "@/prisma/prisma-client"
import { createClient } from "@/utils/supabase/server"

type Args = {
	projectId: string
}
export default async function getProjectCollaborators({ projectId }: Args) {
	const supabase = createClient()

	const { data: collaborators, error } = await supabase
		.from('Collaborator')
		.select('profile')
		.eq('project', projectId)
	if (error) {
		console.error(error)
		return
	}

	const { data } = await supabase
		.from('Profile')
		.select('*')
		.in('id', collaborators.map(c=>c.profile))
	if (error) {
		console.error(error)
		return
	}

	return data as Profile[]
}
