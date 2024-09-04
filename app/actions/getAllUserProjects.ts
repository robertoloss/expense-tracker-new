'use server'
import { Project } from "@/prisma/prisma-client"
import { createClient } from "@/utils/supabase/server"
import { User } from "@supabase/supabase-js"


export default async function getAllUserProjects(user: User) {
	const supabase = createClient()

	const { data: profile, error } = await supabase
		.from('Profile')
		.select('*')
		.eq('user', user.id)
		.limit(1)
		.single()

	if (error) {
		console.error("Couldn't retrieve the user's profile: ", error)
		return
	}
	console.log("Profile retrieved: ", profile)
	
	const { data: projects, error: err }  = await supabase
		.from('Collaborator')
		.select(`
			project (
				*
			)
		`)
		.eq('profile', profile.id)
	
		if (err) {
			console.error("Couldn't retrieve the projects: ", err)
			return
		}

		return projects as unknown as { project: Project}[]
}
