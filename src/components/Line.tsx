export default function Line({ width, isMargin }: { width: string, isMargin?: boolean }) {
    return (
        <div className={`h-0.5 rounded-2xl w-[${width}] bg-[color:var(--gray)] ${isMargin ? 'my-4' : ''}`}></div>
    )
}