import { logo, login } from '../data/data'
import Title from '../components/shared/Title'
import PriceDetail from "../components/Checkout/PriceDetail";

export default function NewPage() {
    return (
        <>
            <header className="h-[10vh] w-full relative top-0 left-0 border-b-2 border-[var(--gray)] flex justify-between items-center px-4 bg-white">
                <img src={logo} alt="" className="scale-[1.05]" />
                <button className="border-2 border-[var(--orange)] rounded-xl w-[9%] h-[65%] flex items-center justify-center gap-2 text-[var(--orange)] font-medium text-[1.2rem]">
                    <img src={login} alt="Login" className="w-5 h-5" />
                    Login
                </button>
            </header>
            <div className="w-[90vw] h-[90vh] mx-auto bg-yellow-50 pt-2">
                <Title titleContent='Checkout' fontSize='text-4xl' bold="font-bold"/>
                <div className="flex flex-col flex-wrap justify-between items-center w-full h-[90%] bg-red-50">
                    <div className="w-[60%] h-[32%] bg-blue-500 rounded-xl">1</div>
                    <div className="w-[60%] h-[32%] bg-blue-500 rounded-xl">2</div>
                    <div className="w-[60%] h-[32%] bg-blue-500 rounded-xl">3</div>
                    <div className="w-[30%] h-[50%] bg-blue-500 rounded-xl">
                        <PriceDetail image="" text="Product's price" value='dm'/>
                    </div>
                </div>
            </div>
        </>
    )
}