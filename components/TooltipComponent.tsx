import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip"
import Link from "next/link"

type Props = {
	href: string,
	label: string,
	children: React.ReactNode
}
export default function TooltipComponent({ href, label, children }: Props) {

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Link
					href={href}
					className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground
						transition-colors hover:text-foreground md:h-8 md:w-8"
					prefetch={true}
				>
					{children}
					<span className="sr-only">{ label }</span>
				</Link>
			</TooltipTrigger>
			<TooltipContent side="right">
				{label}
			</TooltipContent>
		</Tooltip>
	)
}
