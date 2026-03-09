import { logo, login, box, taxIcon, delivery, removeIcon } from '../data/data'
import { totalPrice, tax } from './MainPage';
import Title from '../components/shared/Title'
import Line from '../components/shared/Line'
import PriceDetail from "../components/Checkout/PriceDetail";

export default function CheckoutPage() {
    // make delivery according to geo position!
    const deliveryPrice = 120
    return (
        <>
            <header className="h-[10vh] w-full relative top-0 left-0 border-b-2 border-[var(--gray)] flex justify-between items-center px-4 bg-white">
                <img src={logo} alt="" className="scale-[1.05]" />
                <button className="border-2 border-[var(--orange)] rounded-xl w-[9%] h-[65%] flex items-center justify-center gap-2 text-[var(--orange)] font-medium text-big">
                    <img src={login} alt="Login" className="w-5 h-5" />
                    Login
                </button>
            </header>
            <div className="w-[90vw] h-[90vh] mx-auto bg-yellow-50 pt-2">
                <Title titleContent='Checkout' fontSize='text-large' bold="font-bold"/>
                <div className="flex flex-col flex-wrap justify-between items-center w-full h-[90%] bg-red-50">
                    <div className="w-[60%] h-[32%] bg-blue-500 rounded-xl">1</div>
                    <div className="w-[60%] h-[32%] bg-blue-500 rounded-xl">2</div>
                    <div className="w-[60%] h-[32%] bg-blue-500 rounded-xl">3</div>
                    <div className="w-[30%] h-[60%] bg-blue-500 rounded-xl flex flex-col gap-2">
                            <p className='text-medium'>Overall:</p>
                            <Title titleContent={`${totalPrice + tax + deliveryPrice}`}/>
                        <Line width='w-full' margin='my-2' />
                            <div className="w-full h-[28%] flex flex-col justify-center items-center px-[5%] gap-2">
                            <PriceDetail image={box} text="Product's price:" value={`${totalPrice}$`} />
                            <PriceDetail image={taxIcon} text="Taxes:" value={`${tax}$`}/>
                            <PriceDetail image={delivery} text="Delivery:" value={`${deliveryPrice}$`}/>
                            </div>
                        <Line width='w-full' margin='my-2' />
                            <div className="w-full h-28% flex flex-col justify-center items-center gap-2 px-[5%]">
                                <button className='text-medium text-[var(--gray)]'>I have promocode</button>
                                <button className='orangeBtn-styles w-full py-4'>Start payment</button>
                            </div>
                    </div>
                </div>
            </div>
        </>
    )
}