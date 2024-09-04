import getProject from "./getProject";
import getProjectCategories from "./getProjectCategories";
import getProjectCollaborators from "./getProjectCollaborators";
import getProjectExpenses from "./getProjectExpenses";


export default async function(pId: string) {
	const [ expenses, collaborators, project, categories ] = await Promise.all([
		getProjectExpenses(pId as any),
		getProjectCollaborators(pId as any),
		getProject(pId as any),
		getProjectCategories(pId as any)
	])
	const obj = { expenses, collaborators, project, categories }
	return obj
}


