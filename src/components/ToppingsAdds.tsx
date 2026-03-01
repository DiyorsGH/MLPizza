export default function ToppingsAdds({
  id,
  image,
  name,
  price,
  selected = false,
  onToggle,
}: {
  id: string
  image: string
  name: string
  price: string
  selected?: boolean
  onToggle?: (id: string) => void
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onToggle?.(id)}
      className={`toppingCard w-[30%] h-[95%] flex flex-col gap-2 items-center p-3 bg-white border-2 rounded-xl transition cursor-pointer active:scale-[0.96] ${
        selected
          ? "border-[var(--orange)] shadow-[0_10px_26px_rgba(255,107,53,0.35)] hover:translate-y-[-5px] hover:brightness-95"
          : "border-gray-200 hover:brightness-95 hover:translate-y-[-5px]"
      }`}
    >
      <img src={image} alt="" className="w-[90%]" />
      <div className="flex flex-col gap-1 items-center">

        <p className="text-[0.9rem]">{name}</p>
        <p className="toppingPrice text-[0.9rem] text-[var(--orange)] font-bold">
          {price}
        </p>
      </div>
    </button>
  )
}