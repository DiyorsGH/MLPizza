        import { useEffect, useRef, createContext } from "react";

        import CartModalPizza from "./CartModalPizza";
        import CartModalFooterItems from "./CartModalFooterItems";
        import type { PizzaDataType } from "../../data/data";
        import { emptyCart } from "../../data/data";
import { Link } from "react-router-dom";

        export const PizzaContext = createContext<{
        onChangeCount: (pizza: PizzaDataType, newCount: number) => void;
        } | null>(null);

        export default function CartModal({
        onClose,
        cartItems,
        onChangeCount,
        overallAmount,
        totalPrice
        }: {
        onClose: () => void;
        cartItems: {
            pizza: PizzaDataType;
            count: number;
            size?: string | null;
            crust?: string | null;
            adds?: string[] | null;
            addsPrice: number;
        }[];
        onChangeCount: (pizza: PizzaDataType, newCount: number) => void;
        overallAmount: number;
        totalPrice: number;
        }) {
        const dialogRef = useRef<HTMLDialogElement>(null);
        const closeBtnRef = useRef<HTMLButtonElement>(null);


        useEffect(() => {
            const dialog = dialogRef.current;
            if (!dialog) return;

            dialog.classList.add("cartModalAppear");
            dialog.showModal();

            let isClosing = false;
            const fadeOutAndClose = () => {
            if (isClosing) return;
            isClosing = true;
            dialog.classList.remove("cartModalAppear");
            dialog.classList.add("cartModalDisappear");
            setTimeout(() => {
                dialog.classList.remove("cartModalDisappear");
                dialog.close();
                onClose();
            }, 300);
            };

            (dialog as any)._fadeOutAndClose = fadeOutAndClose;

            return () => {
            delete (dialog as any)._fadeOutAndClose;
            };
        }, [onClose]);


        return (
            <dialog
            ref={dialogRef}
            className="fixed w-[30vw] h-[100vh] max-h-none bg-[var(--gray)] rounded-l-xl flex flex-col z-[60] ml-[70%] backdrop:m-0 "
            >
            <div className="w-full h-[10%] flex justify-between items-center p-4">
                <p className="text-3xl m-4">
                <span className="font-bold">{overallAmount} items</span> in the cart
                </p>
                <button
                onClick={() => {
                    const dialog = dialogRef.current;
                    if (!dialog) return;
                    if (typeof (dialog as any)._fadeOutAndClose === "function") {
                    (dialog as any)._fadeOutAndClose();
                    }
                }}
                ref={closeBtnRef}
                className="closeBtn absolute top-4 right-4 text-4xl"
                >
                ×
                </button>
            </div>

            {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1">
                <img src={emptyCart} alt="Empty cart" className="w-[50%]" />
                <p className="text-gray-600 mt-4">Your cart is empty</p>
                <button
                    className="orangeBtn-styles px-5 py-3 mt-4 text-[1.25rem]"
                    onClick={() => {
                    const dialog = dialogRef.current;
                    if (!dialog) return;
                    if (typeof (dialog as any)._fadeOutAndClose === "function") {
                        (dialog as any)._fadeOutAndClose();
                    }
                    }}
                    ref={closeBtnRef}
                >
                    ← Start Shopping
                </button>
                </div>
            ) : (
                <>
                <PizzaContext.Provider value={{ onChangeCount }}>
                    <div className="flex-1 overflow-y-auto space-y-4 hide-scrollbar">
                    {cartItems.map(({ pizza, count, size, crust, adds, addsPrice }) => (
                        <CartModalPizza
                        key={pizza.name} // важно: key
                        pizza={pizza}
                        count={count}
                        size={size}
                        crust={crust}
                        adds={adds}
                        addsPrice={addsPrice}
                        />
                    
                    ))}
                    </div>
                </PizzaContext.Provider>
                <div className="w-full h-[26%] bg-white flex flex-col items-center justify-center p-4 border-t-2 border-[var(--gray-dark)] gap-10">
                    <CartModalFooterItems text="Total" value={totalPrice} />
                    <CartModalFooterItems text="Tax 5%" value={totalPrice * 0.05} />
                    <Link to="/checkout" className="w-full">
                    <button
                    className="orangeBtn-styles w-full py-3 text-[1.25rem]"
                    onClick={() => {
                        const dialog = dialogRef.current;
                        if (!dialog) return;
                        if (typeof (dialog as any)._fadeOutAndClose === "function") {
                        (dialog as any)._fadeOutAndClose();
                        }
                    }}
                    ref={closeBtnRef}
                    >
                    Checkout →
                    </button>
                    </Link>
                    
                </div>
                </>
            )}
            </dialog>
        );
        }
