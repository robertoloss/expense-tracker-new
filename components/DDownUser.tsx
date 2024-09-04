import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Profile } from "@/prisma/prisma-client"
import { useEffect, useState } from "react"


type Props = {
	handleUserChange: (s: string)=>void
	users: Profile[] | undefined
	reset: boolean
}
export default function DDownUser({ handleUserChange, users, reset } : Props) {
	const [currentValue, setCurrentValue] = useState("all")

  const handleChange = (value: string) => {
    setCurrentValue(value)
    handleUserChange(value)
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
					{users?.map(user => {
						const userName = (user.first_name && user.last_name) ? (user.first_name + ' ' + user.last_name) : 'anon'
						return <SelectItem 
							value={user.id}
							key={user.id}
						>
							{userName}
						</SelectItem>
					})}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}
