'use server'
import { Category } from "@/prisma/prisma-client"
import { createClient } from "@/utils/supabase/server"

type Args = {
	projectId: string
}
export default async function getProjectCategories({ projectId }: Args) {
	const supabase = createClient()
	const { data, error } = await supabase
	 .from('Category')
	 .select('*')
	 .eq('project', projectId)
	if (error) {
		console.error(error)
		return
	}
	return data as Category[]
}
