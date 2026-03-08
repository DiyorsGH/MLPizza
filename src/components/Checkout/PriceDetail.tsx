export default function PriceDetail({ image, text, value } : { image: string, text: string, value: string }) {
    return (
        <div className="w-full h-[10%] flex justify-between items-baseline">
            <div className="flex gap-2 whitespace-nowrap">
                <img src={image} alt="" />
                <p className="text-brown-500">{text}</p>
            </div>
            <span className="dots"></span>
            <p className="font-bold text-[1rem] whitespace-nowrap"></p>
        </div>
    )
}