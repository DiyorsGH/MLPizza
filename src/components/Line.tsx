export default function Line({ width }: { width: string }) {
    return (
        <div className={`h-0.5 rounded-2xl w-[${width}] bg-[color:var(--gray)] my-4`}></div>
    )
}