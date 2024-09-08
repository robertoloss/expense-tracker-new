"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Category, Collaborator, Expense, Project } from "@/prisma/prisma-client"
import { ChartConfigType } from "./GraphPageContent"
import ChartDataFromExpCat from "@/utils/chartDataFromExpCat"


type Props = {
	projectData: {
		expenses: Expense[] | undefined,
		project: Project | undefined,
		collaborators: Collaborator [] | undefined,
		categories: Category[] | undefined
	},
	chartConfig: ChartConfigType
}
export function PieChartComponent({ projectData, chartConfig }: Props) {
	const { expenses, categories } = projectData;
  const totalExpenses = React.useMemo(() => {
    return !expenses ? 0 : expenses.reduce((acc, curr) => acc + Number(curr.amount), 0)
  }, [])
	const data = ChartDataFromExpCat({ expenses, categories})

  return (
    <Card className="flex flex-col min-w-[340px] flex-grow">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Expenses</CardTitle>
        <CardDescription>All time</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalExpenses.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
        </div>
        <div className="leading-none text-muted-foreground">
        </div>
      </CardFooter>
    </Card>
  )
}

