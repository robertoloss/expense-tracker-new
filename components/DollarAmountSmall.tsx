
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
export default function DollarAmountSmall({ amount }: Props) {

  return (
		<span 
			className=" font-light" 
			aria-label={`${formatDollarAmount(amount)}`}
		>
			{formatDollarAmount(amount)}
		</span>
  )
}
