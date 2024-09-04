'use client'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Category, Expense, Profile, Project } from "@/prisma/prisma-client"
import TableComponent from "./TableComponent"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useOptimistic, useState } from "react"
import getExpenses from "@/app/actions/getExpenses"
import AddExpense from "./AddExpense"
import { User } from "@supabase/supabase-js"
import DDownPeriod from "./DDownPeriod"
import DDownCategory from "./DDownCategory"
import DDownUser from "./DDownUser"
import DollarAmountCardBig from "./DollarAmountCardBig"
import ResetDDownsButton from "./ResetDDownsButton"

export type UpdateExpenses = (action: {
    action: 'create' | 'delete' | 'update';
    expense?: Expense | undefined;
    id?: string | undefined;
}) => void

type Props = {
 expenses: Expense[]	| null | undefined
 user: User | null
 collaborators: Profile[] | undefined
 project: Project | undefined
 categories: Category[] | undefined
}
export default function Dashboard({ expenses, user, collaborators, project, categories}: Props)  {
	const supabase = createClient()
	const [ reset, setReset ] = useState(false)
	const [ total, setTotal ] = useState(expenses?.reduce((acc, expense)=> acc + (expense.amount as unknown as number), 0))
	const [ filteredExpenses, setFilteredExpenses ] = useState<Expense[] | null | undefined>(expenses)
	const [ period, setPeriod ] = useState('all')
	const [ selectedCategory, setSelectedCategory ] = useState('all')
	const [ selectedUser, setSelectedUser ] = useState('all')
	const [ optimisticExpenses, updateExpenses ] = useOptimistic(filteredExpenses, 
		(state, {action, expense, id} : 
		{action: 'create' | 'delete' | 'update', expense?: Expense, id?: string }) => {
			switch (action) {
				case "create":
					if (expense && state && state.length > 0) {
						const newArray = [expense, ...state].sort(
							(a,b) => {
								const aTime = new Date(a.expense_date)
								const bTime = new Date(b.expense_date)
								return bTime.getTime() - aTime.getTime()
							}
						)
						return newArray
					}
					return state || null 
				case "delete":
					return id && state ? state.filter(e => e.id.toString() != id) : state || []
				case "update":
					const newArr: Expense[] = state?.filter(e => e.id != expense?.id) || []
					return expense ? [...newArr, expense] : state 
		}
	})

	useEffect(()=>{	
		const channel = supabase.channel('expenses')
			.on(
				'postgres_changes', 
				{event: '*', schema: 'public', table: 'Expense'}, 
				()=>getExpenses()
			).subscribe()
		return () => {
      channel.unsubscribe();
    };
	},[supabase])


	useEffect(() => {
		//console.log("use effect in Dashboard")
		if (!expenses) return
		let newExpenses = [...expenses]
    if (period === "thisMonth") {
      const now = new Date()
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
			//console.log(firstDayOfMonth, lastDayOfMonth)
      
      newExpenses = newExpenses?.filter(expense => {
        const expenseDate = new Date(expense.expense_date)
				expenseDate.setHours(expenseDate.getHours() + 4)
				//console.log("expenseDate: ", expenseDate)
        return expenseDate >= firstDayOfMonth && expenseDate <= lastDayOfMonth
      })
    }
		if (categories) {
			for (let category of categories) {
				if ( selectedCategory === category.name) {
					newExpenses = newExpenses?.filter(expense => expense.category === category.id)
					break
				}
			}
		}
		if (collaborators) {
			for (let user of collaborators) {
				if ( selectedUser === user.id) {
					newExpenses = newExpenses?.filter(expense => expense.made_by === user.id)
					break
				}
			}
		}
		newExpenses.sort((a, b) => {
			const dateAnew =  new Date(a.expense_date) ;
			const dateBnew =  new Date(b.expense_date) ;
			const dateA = dateAnew.getTime()
			const dateB = dateBnew.getTime()
			return dateB - dateA;
		})
		setFilteredExpenses(newExpenses || [])
		setTotal(newExpenses?.reduce((acc, expense)=> acc + (expense.amount as unknown as number), 0))
  }, [ period, selectedCategory, expenses, selectedUser ])
	

	const handlePeriodChange = (value: string) => {
    setPeriod(value)
  }
	const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
  }
	const handleUserChange = (value: string) => {
    setSelectedUser(value)
  }


  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 overflow-y-hidden">
      <div className="flex flex-col sm:gap-4 sm:py-4 ">
        <main className="grid flex-1 items-start p-4 sm:px-6 sm:py-0 gap-4">
					{project && 
						<h1 className="font-semibold text-2xl hidden lg:block">
							{project.name}
						</h1>
					}
					<div className="flex items-center gap-x-10">
						<div className="flex flex-col gap-2 items-start h-full">
							<div className="flex flex-row gap-2">
								<DDownPeriod 
									handlePeriodChange={handlePeriodChange} 
									reset={reset}
								/>
								<DDownCategory 
									handleCategoryChange={handleCategoryChange}
									categories={categories}
									reset={reset}
								/>
								<DDownUser 
									handleUserChange={handleUserChange} 
									users={collaborators}
									reset={reset}
								/>
								<ResetDDownsButton onClick={()=>setReset(p=>!p)} disabled={false}/>
							</div>
						</div>
						<div className="ml-auto flex items-end h-full gap-2">
							<AddExpense 
								categories={categories}
								collaborators={collaborators}
								updateExpenses={updateExpenses}
								project={project}
								user={user}
								setTotal={setTotal}
								total={total}
							/>	
						</div>
					</div>
					<Card x-chunk="dashboard-06-chunk-0">
						<CardHeader>
							<CardTitle className="font-normal text-lg">
								<DollarAmountCardBig amount={total} />
							</CardTitle>
							<CardDescription>
							</CardDescription>
						</CardHeader>
						<CardContent>
							<TableComponent 
								categories={categories}
								collaborators={collaborators}
								expenses={optimisticExpenses} 
								updateExpenses={updateExpenses}
							/>
						</CardContent>
					</Card>
        </main>
      </div>
    </div>
  )
}


