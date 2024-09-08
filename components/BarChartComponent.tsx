"use client"
import { Bar, BarChart, XAxis, YAxis, LabelList } from "recharts"

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
import { ContentType } from "recharts/types/component/DefaultLegendContent"

type Props = {
	projectData: {
		expenses: Expense[] | undefined,
		project: Project | undefined,
		collaborators: Collaborator[] | undefined,
		categories: Category[] | undefined
	},
	chartConfig: ChartConfigType
}
export function BarChartComponent({ projectData, chartConfig }: Props) {
	const { expenses, categories } = projectData;
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
	}
	const numOfCategories = categories?.length || 1
	const maxH = (numOfCategories*80)+'px' 

	const renderCustomizedLabel = (props: any) => {
		const { x, y, height, value } = props;

		return (
			<g>
				<rect x={x + 4} y={y + height/4} width="40" height="20" rx={4} fill="transparent"/>
				<text x={x + 24} y={y + height/2 + 1} fill="#fff" textAnchor="middle" dominantBaseline="middle">
					{value}
				</text>
			</g>
		);
	};

  return (
    <Card className="flex-grow">
      <CardHeader>
        <CardTitle>Expenses by category</CardTitle>
        <CardDescription>All time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer 
					config={chartConfig} 
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
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="total" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="total" layout="vertical" radius={5} >
							<LabelList
								content={renderCustomizedLabel}
                dataKey="total"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
      </CardFooter>
    </Card>
  )
}
