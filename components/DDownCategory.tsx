
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Category } from "@/prisma/prisma-client"
import { useEffect, useState } from "react"


type Props = {
	categories: Category[] | undefined
	handleCategoryChange: (s: string)=>void
	reset: boolean
}
export default function DDownCategory({ handleCategoryChange, categories, reset } : Props) {
	const [currentValue, setCurrentValue] = useState("all")

  const handleChange = (value: string) => {
    setCurrentValue(value)
    handleCategoryChange(value)
  }

	useEffect(()=>{
		handleChange('all')
	},[reset])

	return (
		<Select 
			onValueChange={handleChange}
			defaultValue="all"
			value={currentValue}
		>
			<SelectTrigger 
        className={`w-[180px] transition-colors ${
          currentValue !== "all" 
            ? "border-blue-500 ring-1 ring-blue-500" 
            : ""
        }`}
      >
				<SelectValue placeholder="" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectItem value="all">
						All
					</SelectItem>
					{categories?.map(category => (
						<SelectItem 
							value={category.name}
							key={category.id}
						>
							{category.name}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}
