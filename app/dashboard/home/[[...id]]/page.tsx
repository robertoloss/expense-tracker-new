import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import getAllUserProjects from "../../../actions/getAllUserProjects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProjectLink from "@/components/ProjectLink";

export const dynamic = 'force-dynamic' 

export default async function ProtectedPage() {
  const supabase = createClient();
  const { data: { user }, } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }
	const projects = await getAllUserProjects(user)
	console.log(projects)
	
  return (
		<div className="p-4 bg-muted/40 h-[calc(100vh-56px)]">
			<Card x-chunk="dashboard-06-chunk-0" className="flex flex-col h-full">
				<CardHeader>
					<CardTitle className="font-normal text-lg">
						My projects	
					</CardTitle>
					<CardDescription>
					</CardDescription>
				</CardHeader>
				<CardContent>
					{
						projects && projects.map(p => (
							<ProjectLink project={p.project} />
						))
					}
				</CardContent>
			</Card>
		</div>
  );
}
