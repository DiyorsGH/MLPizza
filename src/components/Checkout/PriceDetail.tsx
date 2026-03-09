export default function PriceDetail({ image, text, value } : { image: string, text: string, value: string }) {
    return (
        <div className="w-full h-fit flex justify-between items-baseline">
            <div className="flex gap-2 whitespace-nowrap items-center">
                <img src={image} alt="" />
                <p className="text-brown-500">{text}</p>
            </div>
            <span className="dots"></span>
            <p className="font-bold text-medium whitespace-nowrap">{value}</p>
        </div>
    )
}