import authenticateUser from "@/app/actions/authenticateUser"
import getAllAboutProject from "@/app/actions/getAllAboutProject"
import { Category, Collaborator, Expense, Project } from "@/prisma/prisma-client"
import GraphPageContent from "@/components/GraphPageContent"

type Props = {
	params: {
		id: string
	}
}
export default async function GraphPage({ params } : Props) {
	authenticateUser()
	const id = params.id
	let projectData: {
		expenses: Expense[] | undefined,
		project: Project | undefined,
		collaborators: Collaborator[] | undefined,
		categories: Category[] | undefined
	}
	projectData = JSON.parse(JSON.stringify(await getAllAboutProject(id)))

	return (
		<div className="p-4 bg-muted/40 h-[calc(100vh-56px)]">
			<GraphPageContent projectData={projectData} />
		</div>
	)
}
