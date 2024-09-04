'use server'
import { Expense } from "@/prisma/prisma-client";
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache";

export default async function getExpenses() {
	const supabase = createClient()
	const { data: { user }, } = await supabase.auth.getUser();

	const { data: profile_id } = await supabase
		.from('Profile')
		.select('id')
		.eq('user', user?.id)
		.limit(1)
		.single()
	if (!profile_id) {
		console.error("No profile id found")
		return
	}	
	//console.log("profile_id: ", profile_id)

	const { data: projects } = await supabase
		.from('Collaborator')
		.select('project')
		.eq('profile', profile_id.id)
	if (!projects) {
		console.error("No project found")
		return
	}
	//console.log("projects: ", projects)

	const { data: expenses } = await supabase
		.from('Expense')
		.select('*')
		.in('project', projects.map(p=>p.project))
	//console.log("expenses: ", expenses)

	revalidatePath('/dashboard')
	return expenses as Expense[]
}
