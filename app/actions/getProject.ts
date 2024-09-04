'use server'

import { Project } from "@/prisma/prisma-client"
import { createClient } from "@/utils/supabase/server"

type Args = {
	projectId: string
}
export default async function getProject({ projectId }: Args) {
	const supabase = createClient()
	const { data, error } = await supabase
		.from('Project')
		.select('*')
		.eq('id', projectId)
		.limit(1)
		.single()
	
	if (error) {
		console.error(error)
		return
	}

	return data as Project
}
