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
import { Category } from "@/prisma/prisma-client"


type Props = {
	categories: Category[] | undefined
	setCategoryValue: Dispatch<SetStateAction<string>>
	categoryValue: string 
}
export function CategoryPicker({ categories, setCategoryValue, categoryValue }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full min-w-[200px] justify-between"
        >
          {categoryValue
            ? categories?.find((category) => category.id === categoryValue)?.name
            : "Category"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command 
					filter={(value, search) => {
						if (categories?.find((category) => category.id === value)?.name.toLowerCase().includes(search.toLowerCase())) return 1
						return 0
					}}
				>
          <CommandInput placeholder="Search category..." />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categories?.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.id}
                  onSelect={(currentcategoryValue) => {
                    setCategoryValue(currentcategoryValue === categoryValue ? "" : currentcategoryValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      categoryValue === category.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {category.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
