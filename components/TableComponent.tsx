import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { UpdateExpenses } from "./Dashboard"
import TableRowComp from "./TableRowComp"
import { v4 as uuidv4 } from 'uuid';
import { Category, Expense, Profile } from "@/prisma/prisma-client";

type Props = {
	expenses: Expense[] | null | undefined
	updateExpenses: UpdateExpenses
	collaborators: Profile[] | undefined
	categories: Category[] | undefined
}
export default function TableComponent({ expenses, updateExpenses, collaborators, categories } : Props) {

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Status</TableHead>
					<TableHead className="hidden md:table-cell">Price</TableHead>
					<TableHead className="hidden md:table-cell">Date</TableHead>
					<TableHead>
						<span className="sr-only">Actions</span>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody className="w-full">
				{expenses?.length === 0 && 
					<TableRow>
						<TableCell className="flex flex-row text-sm font-semibold mt-4">
							There are no expenses to display
						</TableCell>
					</TableRow>
				}
				{expenses?.map(expense => 
					<TableRowComp 
						categories={categories}
						key={uuidv4()} 
						expense={expense} 
						updateExpenses={updateExpenses}
						collaborators={collaborators}
					/>
				)}
			</TableBody>
		</Table>
	)
}
