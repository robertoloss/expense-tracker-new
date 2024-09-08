import { Category, Collaborator, Expense, Project } from "@/prisma/prisma-client"
import { BarChartComponent } from "./BarChartComponent"
import { PieChartComponent } from "./PieChartComponent"
import { ChartConfig } from "./ui/chart"
import { AreaChartComponent } from "./AreaChartComponent"

const chartConfig = {
	total: {
		label: "Total"
	},
	groceries: {
		label: "Groceries",
		color: "hsl(var(--chart-1))",
	},
	electronics: {
		label: "Electronics",
		color: "hsl(var(--chart-2))",
	},
	liquor: {
		label: "Liquor",
		color: "hsl(var(--chart-3))",
	},
} satisfies ChartConfig

export type ChartConfigType = typeof chartConfig

type Props = {
	projectData: {
		expenses: Expense[] | undefined,
		project: Project | undefined,
		collaborators: Collaborator[] | undefined,
		categories: Category[] | undefined
	}
}
export default function GraphPageContent({ projectData }: Props) {
	return (
		<div className="flex flex-col gap-y-4">
			<div className="flex flex-row gap-4 flex-wrap">
				<BarChartComponent projectData={projectData} chartConfig={chartConfig} />
				<PieChartComponent projectData={projectData} chartConfig={chartConfig}/>
			</div>
			<div className="flex flex-row gap-4 flex-wrap">
				<AreaChartComponent projectData={projectData} chartConfig={chartConfig}/>
			</div>
		</div>
	)
}
