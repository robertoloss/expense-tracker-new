'use server'

import { createClient } from "@/utils/supabase/server"

type Args = {
	projectId: string
}
export default async function getProjectExpenses({ projectId }: Args) {
	const supabase = createClient()
	const { data } = await supabase
		.from('Expense')
		.select('*')
		.eq('project', projectId)
	if (data) {
		return data
	}
}
