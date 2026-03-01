export default function Counter({
  count,
  setCount,
}: {
  count: number
  setCount: (c: number) => void
}) {
  return (
    <div className="w-[80%] flex items-center justify-between">
      
      <button
        className="hover:brightness-95 w-8 h-8 bg-[var(--orange)] text-white text-[1.2rem] rounded-lg flex items-center justify-center active:scale-[0.96]"
        onClick={() => setCount(count > 0 ? count - 1 : 0)}
      >
        −
      </button>

      <span className="text-lg font-bold">{count}</span>

      <button
        className="hover:brightness-95 w-8 h-8 bg-[var(--orange)] text-white text-[1.2rem] rounded-lg flex items-center justify-center active:scale-[0.96]"
        onClick={() => setCount(count + 1)}
      >
        +
      </button>

    </div>
  )
}