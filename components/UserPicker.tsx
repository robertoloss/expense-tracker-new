import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Dispatch, SetStateAction, useState } from "react"
import { Profile } from "@/prisma/prisma-client"

type Props = {
	userValue: string
	setUserValue: Dispatch<SetStateAction<string>>
	collaborators: Profile[] | undefined
}
export function UserPicker({ userValue, setUserValue, collaborators }: Props) {
  const [ open, setOpen ] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full min-w-[200px] justify-between"
        >
          {userValue
            ? collaborators?.find((collaborator) => collaborator.id === userValue)?.first_name + ' ' +
							collaborators?.find((collaborator) => collaborator.id === userValue)?.last_name
            : "User"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command
					filter={(value, search) => {
						const collab = collaborators?.find((collaborator) => collaborator.id === value) 
						if (collab?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
								collab?.last_name?.toLowerCase().includes(search.toLowerCase())
						) return 1
						return 0
					}}
				>
          <CommandInput placeholder="Search collaborator..." />
          <CommandList>
            <CommandEmpty>No collaborator found.</CommandEmpty>
            <CommandGroup>
              {collaborators?.map((collaborator) => (
                <CommandItem
                  key={collaborator.id}
                  value={collaborator.id}
                  onSelect={(currentuserValue) => {
                    setUserValue(currentuserValue === userValue ? "" : currentuserValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      userValue === collaborator.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {collaborator.first_name} {collaborator.last_name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
