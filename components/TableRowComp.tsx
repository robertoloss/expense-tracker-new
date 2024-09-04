import { TableRow, TableCell } from "@/components/ui/table"
import { Category, Expense, Profile } from "@/prisma/prisma-client"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Badge } from "./ui/badge"
import { Button } from "@/components/ui/button"
import { MoveHorizontalIcon } from "./ui/icons"
import DeleteExpense from "./DeleteExpense"
import { UpdateExpenses } from "./Dashboard"
import { useAppStore } from "@/utils/zustand/store"
import DollarAmountSmall from "./DollarAmountSmall"

type Props = {
	expense: Expense
	updateExpenses: UpdateExpenses
	collaborators: Profile[] | undefined
	categories: Category[] | undefined
}
export default function TableRowComp({ expense, updateExpenses, collaborators, categories }: Props) {
	const date = new Date(expense.expense_date)
	const year = date.getFullYear()
	const month = date.getMonth() + 1;
	const day = date.getDate();

	const isLoading = useAppStore(state => state.isLoading)
	const formattedDate = (year + '-' + (month < 10?'0':'') + month + '-' + (day<10 ? '0' : '' ) + day);

	const collaboratorArr = collaborators?.filter(c => c.id === expense.made_by) || []
	let collaborator: Profile | null = null
	if (collaboratorArr.length > 0) collaborator = collaboratorArr[0]

	const categoryArr = categories?.filter(c => c.id === expense.category) || []
	let category: Category | null = null
	if (categoryArr.length > 0) category = categoryArr[0]

	return (
		<TableRow>
			<TableCell className="font-medium">{collaborator?.first_name} {collaborator?.last_name}</TableCell>
			<TableCell>
				<Badge variant="outline">{category ? category.name : 'Uncategorized'}</Badge>
			</TableCell>
			<TableCell className="hidden md:table-cell">
				<DollarAmountSmall amount={expense.amount as unknown as number} />
			</TableCell>
			<TableCell className="hidden md:table-cell">{formattedDate}</TableCell>
			<TableCell>
				<DropdownMenu>
					<DropdownMenuTrigger asChild disabled={isLoading}>
						<Button aria-haspopup="true" size="icon" variant="ghost">
							<MoveHorizontalIcon className="h-4 w-4" />
							<span className="sr-only">Toggle menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem>
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem onSelect={(e)=>e.preventDefault()}>
							<DeleteExpense 
								expense={expense}
								updateExpenses={updateExpenses}
							/>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	)
}
