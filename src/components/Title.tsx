export default function Title({ titleContent, fontSize, margin, bold }: { titleContent: string, fontSize?: string, margin?: string, bold?: string }) {
  return (
    <p className={`${fontSize} font-[590] ${margin} ${bold}`}>{titleContent}</p>
  )
}