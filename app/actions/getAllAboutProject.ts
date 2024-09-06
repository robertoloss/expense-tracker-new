import getProject from "./getProject";
import getProjectCategories from "./getProjectCategories";
import getProjectCollaborators from "./getProjectCollaborators";
import getProjectExpenses from "./getProjectExpenses";


export default async function(id: string) {
	const pId = { projectId: id }
	const [ expenses, collaborators, project, categories ] = await Promise.all([
		getProjectExpenses(pId),
		getProjectCollaborators(pId),
		getProject(pId),
		getProjectCategories(pId)
	])
	const obj = { expenses, collaborators, project, categories }
	return obj
}


