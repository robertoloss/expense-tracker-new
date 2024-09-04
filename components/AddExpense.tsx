import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { CirclePlusIcon } from "./ui/icons"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { UpdateExpenses } from "./Dashboard"
import { Dispatch, SetStateAction, useRef, useState, useTransition } from "react"
import { createClient } from "@/utils/supabase/client"
import { Category, Expense, Profile, Project } from "@/prisma/prisma-client"
import getExpenses from "@/app/actions/getExpenses"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { DatePicker } from "./DatePicker"
import { Decimal } from "@prisma/client/runtime/library"
import { CategoryPicker } from "./CategoryPicker"
import { UserPicker } from "./UserPicker"
import { User } from "@supabase/supabase-js"
import { useAppStore } from "@/utils/zustand/store"

const zComment = z.string().max(50, {
	message: "Comment must have at most 50 characters.",
})
const zAmount = z.number({
	message: "Not a number"
}).nonnegative({
	message: "Amount cannot be negative"
})

type Props = {
	updateExpenses: UpdateExpenses 
	project: Project | undefined
	user: User | null
	collaborators: Profile[] | undefined
	categories: Category[] | undefined
	setTotal: Dispatch<SetStateAction<number | undefined>>
	total: number | undefined
}
export default function AddExpense({ updateExpenses, project, user, collaborators, categories, setTotal, total }: Props) {
  const [ userValue, setUserValue ] = useState("")
	const [ categoryValue, setCategoryValue ] = useState("")
	const [ open, setOpen ] = useState(false)
	const [	date, setDate ] = useState<Date>(new Date())
	const supabase = createClient()
	const [ isPending, startTransition ] = useTransition()
	const commentRef = useRef<HTMLInputElement>(null)
	const amountRef = useRef<HTMLInputElement>(null)
	const formRef = useRef<HTMLFormElement>(null)
	const { isLoading, setIsLoading } = useAppStore(state => state)

	function amountHandler() {
		if (amountRef.current) {
			const inputValue = amountRef.current.value
			const inputValueNo$ = inputValue.slice(1)
			if (inputValue.length === 1) {
				if (!zAmount.safeParse(Number(inputValue)).success) {
					amountRef.current.value = ''
				} else {
					amountRef.current.value = '$' + amountRef.current.value
				}
			} else {
				if (inputValue.slice(0,1) != '$') {
					if (zAmount.safeParse(Number(inputValue)).success) {
						amountRef.current.value = '$' + amountRef.current.value
					} else {
						amountRef.current.value = ''
					}
				}	else {
					if (!zAmount.safeParse(Number(inputValueNo$)).success) {
						amountRef.current.value = inputValue.slice(0,-1)	
					}
				}
			}
		} 
	} 
	function commentHandler() {
		if (commentRef.current && !zComment.safeParse(commentRef.current?.value).success) {
			commentRef.current.value = commentRef.current?.value.slice(0,-1)
		}
	}
	function isFormValid(): boolean {
		if (formRef.current) {
			const formData = new FormData(formRef.current)
			const comment = formData.get("comment")?.toString()
			const amount = Number(formData.get("amount")?.slice(1))
			const testComment = zComment.safeParse(comment)
			const testAmount = zAmount.safeParse(amount)
			if (!testComment.success || !testAmount || !amount) {
				console.error("test comment error: ", testComment.error?.issues)
				console.error("terst comment error issues: ", testAmount.error?.issues)
				setIsLoading(false)
				return false
			}
			if (!project || !user) {
				if (!project) console.error('No project')
				if (!user) console.error('No user')
				setIsLoading(false)
				return false
			}
			if (!userValue || userValue.length  === 0) {
				setIsLoading(false)
				return false
			}
			if (!categoryValue) {
				setIsLoading(false)
				console.error("No category selected")
				return false
			}
			return true
		} else return false
	}
  async function onSubmit(data: FormData) {
		if (!isFormValid()) return

		const comment = data.get("comment")?.toString()
		const amount = Number(data.get("amount")?.slice(1))
		const tDate = new Date(date)
		const newExpense: Expense = {
			id: 'dummyId',
			comment: comment!,
			created_at: new Date(),
			made_by: userValue,
			amount: amount as unknown as Decimal,
			expense_date: tDate.toISOString().replace('Z', '') as unknown as Date, 
			project: project!.id, 
			category: categoryValue 
		}
		startTransition(() => {
			updateExpenses({
				action: 'create',
				expense: newExpense 
			})
		})
		const newExpenseNew = {...newExpense}	
		delete (newExpenseNew as { id?: string }).id
		await supabase
			.from('Expense')
			.insert(newExpenseNew)
		await getExpenses()
		setTimeout(()=>setIsLoading(false),500)
  }

	function resetModal() {
		setDate(new Date())
		setUserValue('')
		setCategoryValue('')
		if (amountRef.current) amountRef.current.value = ''
		if (commentRef.current) commentRef.current.value =''
	}
	function handleOnOpenChange(open: boolean) {
		setOpen(open)
		resetModal()
		console.log("handleOnOpenChange")
	}

	return (
		<Dialog data-pending={isPending? "" : undefined} open={open} onOpenChange={handleOnOpenChange}>
			<DialogTrigger asChild={true} className="h-8 gap-1" disabled={isLoading}>
				<Button size="sm" className={`${isLoading ? 'bg-muted-foreground' : 'bg-foreground'}`} >
					<CirclePlusIcon className="h-3.5 w-3.5" />
					<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
						Add Expense
					</span>
				</Button>
			</DialogTrigger>
			<DialogContent aria-describedby="dialog-description">
				<DialogHeader>
					<DialogTitle>Add a new expense</DialogTitle>
					<DialogDescription>
						<VisuallyHidden>
							Description goes here
						</VisuallyHidden>
					</DialogDescription>
						<form
							ref={formRef}
							action={onSubmit}
							className="space-y-4 flex flex-col"
						>	
							<div className="flex flex-col gap-y-2">
								<div className="flex flex-row justify-between gap-4 flex-wrap min-[480px]:flex-nowrap">
									<DatePicker 
										date={date}
										setDate={setDate}
									/>
									<Input 
										type="text" 
										ref={amountRef}
										name="amount" 
										placeholder="Amount" 
										onChange={amountHandler}
									/>
								</div>
							</div>
							<div className="flex flex-row justify-between gap-4 flex-wrap min-[480px]:flex-nowrap">
								<CategoryPicker 
									categories={categories}
									categoryValue={categoryValue}
									setCategoryValue={setCategoryValue}
								/>
								<UserPicker 
									collaborators={collaborators}
									userValue={userValue}
									setUserValue={setUserValue}
								/>
							</div>
							<Input 
								type="text" 
								ref={commentRef} 
								name="comment" 
								placeholder="Comment (optional, 50 chars max)"
								onChange={commentHandler}
							/>
							<Button type="submit" 
								onClick={()=>{
									if (formRef.current) {
										if (!isFormValid()) return
										setOpen(false)
										const data = new FormData(formRef?.current)
										const amount = Number(data.get("amount")?.slice(1))
										setTotal(total || 0 + amount)
										setIsLoading(true)
									}
								}}
							>	
								Submit
							</Button>
						</form>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}




