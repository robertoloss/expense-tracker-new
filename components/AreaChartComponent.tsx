"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Category, Collaborator, Expense, Project } from "@/prisma/prisma-client"
import { ChartConfigType } from "./GraphPageContent"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]
type Props = {
	projectData: {
		expenses: Expense[] | undefined,
		project: Project | undefined,
		collaborators: Collaborator[] | undefined,
		categories: Category[] | undefined
	},
	chartConfig: ChartConfigType
}
export function AreaChartComponent({ projectData, chartConfig }: Props) {
	const { expenses, categories } = projectData;

	console.log("categories: ", categories)
	console.log("expenses: ", expenses)

	const data = []

	if (expenses && categories) {
		let prevDate = new Date('1900/01/01')
		let entry: { [key: string]: string | number }  = { date: '' }
		let first = true

		for (let i=0; i<expenses.length; i++) {
			const expense = expenses[i];
			const expenseMonth =  new Date(expense.expense_date).getMonth();
			const monthFormatted = new Date(expense.expense_date).toLocaleString('en-US', { month: 'long' });
			if (expenseMonth != prevDate.getMonth()) {
				if (!first) {
					data.push(entry)
				} else {
					first = false
				}
				entry = { date: monthFormatted }
			} 
			const expCatArray = categories.filter(cat => cat.id = expense.category);
			if (expCatArray.length === 0) { console.log("continuing"); continue }
			const expCategory = expCatArray[0]
			if (!Object.hasOwn(entry, expCategory.name)) {
				entry[expCategory.name] = 0	
			}
			(entry[expCategory.name] as number) += Number(expense.amount)
			if (i = expenses.length-1) data.push(entry)	
		}
	}
	console.log(data)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart - Legend</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="var(--color-mobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
