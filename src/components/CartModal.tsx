import { useEffect, useRef } from "react";

import Counter from "./Counter"
import type { PizzaDataType } from "../data"
import { emptyCart } from "../data"

export default function CartModal({
    onClose,
    cartItems,
    onChangeCount,
}: {
    onClose: () => void
    cartItems: { pizza: PizzaDataType; count: number }[]
    onChangeCount: (pizza: PizzaDataType, newCount: number) => void
}) {
    const dialogRef = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return
        dialog.classList.add("cartModalAppear")

        dialog.showModal()

        let isClosing = false
        const fadeOutAndClose = () => {
            if (isClosing) return
            isClosing = true
            dialog.classList.remove("cartModalAppear")
            dialog.classList.add("cartModalDisappear")
            setTimeout(() => {
                dialog.classList.remove("cartModalDisappear")
                dialog.close()
                onClose()
            }, 300)
        }

        (dialog as any)._fadeOutAndClose = fadeOutAndClose

    return () => {
      delete (dialog as any)._fadeOutAndClose
    }
    }, [onClose])
    return (
        <dialog
            ref={dialogRef}
            // browsers impose a default max-height on <dialog> (often ~75vh)
            // which prevents it from ever reaching 100vh. add a utility to
            // override that so the element can truly span the viewport.
            className="fixed w-[30vw] h-[100vh] max-h-none bg-blue-50 rounded-l-xl flex flex-col z-[60] ml-[70%] backdrop:m-0 p-4"
        >
        <h1 className="text-2xl font-bold mb-4">Cart</h1>
        {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1">
                <img
                    src={emptyCart}
                    alt="Empty cart"
                    className="w-32 h-32 opacity-50"
                />
                <p className="text-gray-600 mt-4">Your cart is empty</p>
            </div>
        ) : (
            <div className="flex-1 overflow-y-auto space-y-4">
                {cartItems.map(({ pizza, count }) => (
                    <div
                        key={pizza.name}
                        className="flex items-center justify-between p-2 bg-white rounded-lg shadow"
                    >
                        <div className="flex-1">
                            <p className="font-medium">{pizza.name}</p>
                        </div>
                        <Counter
                            count={count}
                            setCount={(c) => onChangeCount(pizza, c)}
                        />
                    </div>
                ))}
            </div>
        )}
        <button
            className="mt-4 self-end px-4 py-2 bg-red-500 text-white rounded"
            onClick={() => {
            const dialog = dialogRef.current
            if (!dialog) return
            if (typeof (dialog as any)._fadeOutAndClose === "function") {
              (dialog as any)._fadeOutAndClose()
            }
          }}
        >
            Close
        </button>
        </dialog>
    );
}