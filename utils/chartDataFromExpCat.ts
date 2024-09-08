import { Category, Expense } from "@/prisma/prisma-client"

type Datum = {
	category: string,
	total: number,
	fill: string
}
type Props = {
	expenses: Expense[] | undefined
	categories: Category[] | undefined
}
export default function ChartDataFromExpCat({ expenses, categories }: Props) : Datum[] {
	const data: Datum[] = [] 
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
	return data
}
