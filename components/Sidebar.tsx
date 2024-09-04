'use client'
import { useParams } from "next/navigation"
import { HomeIcon, LineChartIcon, Package2Icon, SettingsIcon, ShoppingCartIcon } from "./SVGIcons"
import TooltipComponent from "./TooltipComponent"
import { TooltipProvider } from "./ui/tooltip"
import Link from "next/link"

export default function Sidebar() {
	const { id } = useParams()
	const buttons = [
		{
			href:  id ? `/dashboard/home/${id}` : '/dashboard/home',
			label: 'Home',
			icon: <HomeIcon className="h-5 w-5" />
		},
		{
			href: id ? `/dashboard/${id}` : '/dashboard/home',
			label: 'Expenses',
			icon: <ShoppingCartIcon className="h-5 w-5" />
		},
		{
			href: id ? `/dashboard/${id}/graphs` : '/dashboard/home',
			label: 'Graphs',
			icon: <LineChartIcon className="h-5 w-5" />
		},
	]

	return (
		<div className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
			<nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
				<TooltipProvider>
					<Link
						href="#"
						className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full 
							bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
						prefetch={false}
					>
						<Package2Icon className="h-4 w-4 transition-all group-hover:scale-110" />
						<span className="sr-only">Acme Inc</span>
					</Link>
					{buttons.map(button => {
							return 	(
								<TooltipComponent href={button.href} label={button.label} key={button.label}>
									{button.icon}	
								</TooltipComponent>
							)
					})}
				</TooltipProvider>
			</nav>
			<nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
				<TooltipProvider>
					<TooltipComponent href="#" label="Settings">
						<SettingsIcon className="h-5 w-5" />
					</TooltipComponent>
				</TooltipProvider>
			</nav>
		</div>
	)
}

