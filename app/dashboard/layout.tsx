import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"

type Props = {
	children: React.ReactNode
}
export default function DashboardLayout({ children } : Props) {

	return (
		<div className="flex flex-row w-full">
			<Sidebar />
			<div className="flex flex-col w-full h-full ">
				<Header />
				<div className="flex flex-col h-full sm:ml-14">
					{ children }
				</div>
			</div>
		</div>
	)
}
