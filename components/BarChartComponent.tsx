"use client"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Category, Collaborator, Expense, Project } from "@/prisma/prisma-client"

type Props = {
	projectData: {
		expenses: Expense[] | undefined,
		project: Project | undefined,
		collaborators: Collaborator[] | undefined,
		categories: Category[] | undefined
	}
}
export function BarChartComponent({ projectData }: Props) {
	const { expenses, categories } = projectData;
	console.log(expenses, categories)
	const data: {
		category: string,
		total: number,
		fill: string
	}[] = [] 
	if (expenses && categories) {
		for (let cat of categories) {
			const categoryItem = {
				category: cat.name.toLowerCase(),
				total: 0,
				fill: `var(--color-${cat.name.toLowerCase()})`
			}
			expenses.forEach(exp => {
				if (exp.category === cat.id) categoryItem.total += Number(exp.amount) 
			})
			data.push(categoryItem)
		}
		console.log(data)
	}
	const config = {
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
	const numOfCategories = categories?.length || 1
	console.log(numOfCategories)
	const maxH = (numOfCategories*80)+'px' 


  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by category</CardTitle>
        <CardDescription>All time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer 
					config={config} 
					className={`min-h-[200px] w-full max-w-[1024px]`}
					style={{ maxHeight: `${maxH}` }}
				>
          <BarChart
						barSize={40}
						barCategoryGap={1}
						barGap={1}
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="category"
							width={96}
							className="-mr-4"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                config[value as keyof typeof config]?.label
              }
            />
            <XAxis dataKey="total" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="total" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
      </CardFooter>
    </Card>
  )
}
