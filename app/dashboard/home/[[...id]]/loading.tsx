import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Loading() {
  return (
		<div className="p-4 bg-muted/40 h-[calc(100vh-56px)]">
			<Card x-chunk="dashboard-06-chunk-0" className="flex flex-col h-full">
				<CardHeader className="flex flex-col gap-8">
					<CardTitle className="flex flex-col font-normal text-lg gap-4">
						<Skeleton className="h-10 w-[400px]" />	
						<Skeleton className="h-5 w-[200px]"/>
						<Skeleton className="h-5 w-[200px]"/>
					</CardTitle>
					<div className="flex flex-col gap-4">
						{Array(15).fill(0).map(() => <Skeleton className="h-8 w-full"/>)}
					</div>
				</CardHeader>
				<CardContent>
				</CardContent>
			</Card>
		</div>
	)
}
