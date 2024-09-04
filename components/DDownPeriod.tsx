import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"


type Props = {
	handlePeriodChange: (s: string)=>void
	reset: boolean
}
export default function DDownPeriod({ handlePeriodChange, reset } : Props) {
	const [currentValue, setCurrentValue] = useState("all")

  const handleChange = (value: string) => {
    setCurrentValue(value)
    handlePeriodChange(value)
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
				<SelectValue placeholder="xx" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectItem value="all">All</SelectItem>
					<SelectItem value="thisMonth">This Month</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}
