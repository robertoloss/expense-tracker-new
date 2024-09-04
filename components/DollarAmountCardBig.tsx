
const formatDollarAmount = (amount: number | undefined) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

type Props = {
	amount: number | undefined
}
export default function DollarAmountCardBig({ amount }: Props) {

  return (
		<div className="flex items-baseline space-x-2">
			<span className="text-xl text-foreground">Total:</span>
			<span 
				className="text-xl font-bold text-foreground" 
				aria-label={`${formatDollarAmount(amount)}`}
			>
				{formatDollarAmount(amount)}
			</span>
		</div>
  )
}
