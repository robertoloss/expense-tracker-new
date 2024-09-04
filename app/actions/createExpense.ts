'use server'
import { createClient } from "@/utils/supabase/server"


export default async function createExpense(username: string) {
	const supabase = createClient()
	const { data, error } = await supabase.from('Expense')
		.insert([
			{kind: username}
		])
		.select()
}
