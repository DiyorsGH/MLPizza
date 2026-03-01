import { useEffect, useRef, useState } from "react"
import type { PizzaDataType } from "../data"
import Title from "./Title"
import ToppingsSegmentbar from "./ToppingsSegmentbar"
import ToppingsAdds from "./ToppingsAdds"

export default function ToppingsModal({ onClose, pizza, onConfirm }: { onClose: () => void, pizza: PizzaDataType, onConfirm?: (payload: { adds: string[]; size: string | null; crust: string | null }) => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedCrust, setSelectedCrust] = useState<string | null>(null)
  const [selectedAdds, setSelectedAdds] = useState<string[]>([])

  const addsData = [
    {
        image: '../src/public/images/utilityImg/chedar.svg',
        name: 'Cheddar',
        price: '179$'
    },
    {
        image: '../src/public/images/utilityImg/mozarella.svg',
        name: 'Mozzarella',
        price: '79$'
    },
    {
        image: '../src/public/images/utilityImg/cheeseBorder.svg',
        name: 'Cheese Border',
        price: '79$'
    }
  ]

  const toggleAdd = (id: string) => {
    setSelectedAdds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const addOnsPrice = selectedAdds.reduce((sum, id) => {
    const add = addsData.find(a => a.name === id)
    if (!add) return sum
    // attempt to parse numeric part of price string
    const num = Number(String(add.price).replace(/[^0-9.-]+/g, ""))
    return sum + (isNaN(num) ? 0 : num)
  }, 0)

  const totalPrice = pizza.price + addOnsPrice

  useEffect(() => {
    const dialog = dialogRef.current
    const closeBtn = closeBtnRef.current
    if (!dialog) return
    if (!closeBtn) return

    dialog.classList.add("toppingsModalAppear")
    closeBtn.classList.add("toppingsModalAppear")
    dialog.showModal()

    let isClosing = false
    const fadeOutAndClose = () => {
      if (isClosing) return
      isClosing = true
      dialog.classList.remove("toppingsModalAppear")
      dialog.classList.add("toppingModalDisappear")
      closeBtn.classList.remove("toppingsModalAppear")
      closeBtn.classList.add("toppingModalDisappear")
      setTimeout(() => {
        dialog.classList.remove("toppingModalDisappear")
        closeBtn.classList.remove("toppingModalDisappear")
        onClose()
      }, 300)
    }

    (dialog as any)._fadeOutAndClose = fadeOutAndClose

    return () => {
      delete (dialog as any)._fadeOutAndClose
    }
  }, [onClose])

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current
    const closeBtn = closeBtnRef.current
    if (!dialog || !closeBtn) return

    const rect = dialog.getBoundingClientRect()

    const clickedOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom

    if (clickedOutside) {
      if (typeof (dialog as any)._fadeOutAndClose === "function") {
        (dialog as any)._fadeOutAndClose()
      }
    }
  }
  const pizzaSizes = ["Small", "Medium", "Large"]
  const doughTypes = ["Thin Crust", "Traditional"]

  useEffect(() => {
    // default to first options so parent always receives a value
    if (!selectedSize) setSelectedSize(pizzaSizes[0])
    if (!selectedCrust) setSelectedCrust(doughTypes[0])
  }, [])

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="fixed w-[75%] h-[80%] rounded-xl shadow-2xl p-0 z-[60]"
    >
      <div className="flex w-full h-full bg-white rounded-xl overflow-hidden">
        
        <div className="w-1/2 h-full bg-white flex items-center justify-center">
            <img src={pizza.img} alt={pizza.name} className="w-[400px]" />
        </div>

        <div className="w-1/2 h-full flex flex-col justify-between bg-[var(--gray-dark)] p-6">
            <Title titleContent={pizza.name} bold="font-bold" fontSize="text-[2rem]"/>
            <p className="text-gray-500">{pizza.ingredients}</p>
            <ToppingsSegmentbar
              elems={pizzaSizes}
              width="w-[95%]"
              height="h-[10%]"
              onSelect={(i) => setSelectedSize(pizzaSizes[i])}
            />
            <ToppingsSegmentbar
              elems={doughTypes}
              width="w-[95%]"
              height="h-[10%]"
              onSelect={(i) => setSelectedCrust(doughTypes[i])}
            />
            <Title titleContent="Toppings" bold="font-bold" fontSize="text-[1.5rem]"/>
            <div className="flex gap-2">
              {addsData.map((add) => (
                <ToppingsAdds
                  key={add.name}
                  id={add.name}
                  image={add.image}
                  name={add.name}
                  price={add.price}
                  selected={selectedAdds.includes(add.name)}
                  onToggle={toggleAdd}
                />
              ))}
            </div>
            <button
              className="orangeBtnHover w-[95%] h-[10%] bg-[var(--orange)] rounded-xl text-white text-[1.1rem]"
              onClick={() => {
                // notify parent about selected add-ons, size and crust
                onConfirm?.({ adds: selectedAdds, size: selectedSize, crust: selectedCrust })
                const dialog = dialogRef.current
                if (!dialog) return
                if (typeof (dialog as any)._fadeOutAndClose === "function") {
                  (dialog as any)._fadeOutAndClose()
                }
              }}
            >
              Add to the cart for {totalPrice} $
            </button>
        </div>

        <button
          onClick={() => {
            const dialog = dialogRef.current
            if (!dialog) return
            if (typeof (dialog as any)._fadeOutAndClose === "function") {
              (dialog as any)._fadeOutAndClose()
            }
          }}
          ref={closeBtnRef}
          className="closeBtn toppingsModalAppear absolute top-4 right-4 text-3xl"
        >
          ×
        </button>

      </div>
    </dialog>
  )
}

// useEffect(() => {
//     const dialog = dialogRef.current
//     const closeBtn = closeBtnRef.current

//     if (!dialog || !closeBtn) return

//     dialog.classList.add("toppingsModalAppear")
//     closeBtn.classList.add("toppingsModalAppear")
//     dialog.showModal()

//     // Unified fade-out handler
//     let isClosing = false
//     const fadeOutAndClose = () => {
//       if (isClosing) return
//       isClosing = true
//       dialog.classList.remove("toppingsModalAppear")
//       dialog.classList.add("toppingModalDisappear")
//       closeBtn.classList.remove("toppingsModalAppear")
//       closeBtn.classList.add("toppingModalDisappear")
//       setTimeout(() => {
//         dialog.classList.remove("toppingModalDisappear")
//         closeBtn.classList.remove("toppingModalDisappear")
//         onClose()
//       }, 300)
//     }

//     // Store handler for use in button and backdrop
//     (dialog as any)._fadeOutAndClose = fadeOutAndClose

//     return () => {
//       delete (dialog as any)._fadeOutAndClose
//     }
//   }, [onClose])

//   const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
//     const dialog = dialogRef.current
//     if (!dialog) return