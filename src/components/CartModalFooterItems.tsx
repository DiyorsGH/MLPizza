export default function CartModalFooterItems({
    text,
    value
}: {
    text: string
    value: number
}) {
  return (
    <div className="w-[100%] h-[10%] flex items-baseline">
        <span className="whitespace-nowrap text-[1.2rem]">{text} :</span>
        <span className="dots"></span>
        <span className="whitespace-nowrap font-bold text-[1.2rem]">{Math.round(value * 100) / 100} $</span>
    </div>
  );
}
