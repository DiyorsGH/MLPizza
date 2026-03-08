export default function SidebarPriceInput({
  currency,
  value,
  onChange,
}: {
  currency: string
  value?: string
  onChange?: (value: string) => void
}) {
  return (
    <div className="relative w-[45%]">
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const onlyNumbers = e.target.value.replace(/\D/g, "")
          onChange?.(onlyNumbers)
        }}
        className="w-full h-10 rounded-xl border-2 border-gray-300 px-3 pr-8 focus:outline-none focus:border-[var(--orange)]"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[1rem] text-gray-500 pointer-events-none">
        {currency}
      </span>
    </div>
  )
}