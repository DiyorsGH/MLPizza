import { useEffect, useRef, useState } from "react";
import type { PizzaDataType } from "../../data/data";
import { addsData } from "../../data/data";
import Title from "../shared/Title";
import ToppingsSegmentbar from "./ToppingsSegmentbar";
import ToppingsAdds from "./ToppingsAdds";

export default function ToppingsModal({
  onClose,
  pizza,
  onConfirm,
}: {
  onClose: () => void;
  pizza: PizzaDataType;
  onConfirm?: (payload: {
    adds: string[];
    size: string | null;
    crust: string | null;
    addsPrice: number;
  }) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedCrust, setSelectedCrust] = useState<string | null>(null);
  const [selectedAdds, setSelectedAdds] = useState<string[]>([]);

  const toggleAdd = (id: string) => {
    setSelectedAdds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const addOnsPrice = selectedAdds.reduce((sum, id) => {
    const add = addsData.find(a => a.name === id);
    if (!add) return sum;
    const num = Number(add.price.replace(/[^0-9.-]+/g, ""));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const totalPrice = pizza.price + addOnsPrice;

  const pizzaSizes = ["Small", "Medium", "Large"];
  const doughTypes = ["Thin Crust", "Traditional"];

  useEffect(() => {
    if (!selectedSize) setSelectedSize(pizzaSizes[0]);
    if (!selectedCrust) setSelectedCrust(doughTypes[0]);
  }, []);

  // Modal appear animation
  useEffect(() => {
    const dialog = dialogRef.current;
    const closeBtn = closeBtnRef.current;
    if (!dialog || !closeBtn) return;

    // Add appear classes
    dialog.classList.add("toppingsModalAppear");
    closeBtn.classList.add("toppingsModalAppear");

    dialog.showModal();

    let isClosing = false;

    const fadeOutAndClose = () => {
      if (isClosing) return;
      isClosing = true;

      // Remove appear and add disappear
      dialog.classList.remove("toppingsModalAppear");
      dialog.classList.add("toppingModalDisappear");
      closeBtn.classList.remove("toppingsModalAppear");
      closeBtn.classList.add("toppingModalDisappear");

      // Wait for animation duration
      setTimeout(() => {
        dialog.classList.remove("toppingModalDisappear");
        closeBtn.classList.remove("toppingModalDisappear");
        dialog.close();
        onClose();
      }, 300); // match your CSS fadeOut duration
    };

    // Save for button
    (dialog as any)._fadeOutAndClose = fadeOutAndClose;

    return () => {
      delete (dialog as any)._fadeOutAndClose;
    };
  }, [onClose]);

  return (
    <dialog ref={dialogRef} className="fixed w-[75%] h-[80%] rounded-xl p-0 z-[60]">
      <div className="flex w-full h-full bg-white rounded-xl overflow-hidden">
        <div className="w-1/2 flex items-center justify-center">
          <img src={pizza.img || ""} alt={pizza.name} className="w-[400px]" />
        </div>

        <div className="w-1/2 flex flex-col justify-between bg-[var(--gray-dark)] p-6">
          <Title titleContent={pizza.name} bold="font-bold" fontSize="text-[2rem]" />
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

          <Title titleContent="Toppings" bold="font-bold" fontSize="text-[1.5rem]" />

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
            className="orangeBtnHover w-[95%] h-[10%] bg-[var(--orange)] rounded-xl text-white text-[1rem]"
            onClick={() => {
              onConfirm?.({
                adds: selectedAdds,
                size: selectedSize,
                crust: selectedCrust,
                addsPrice: addOnsPrice,
              });
              (dialogRef.current as any)?._fadeOutAndClose?.();
            }}
          >
            Add to the cart for {totalPrice} $
          </button>
        </div>

        <button
          onClick={() => (dialogRef.current as any)?._fadeOutAndClose?.()}
          ref={closeBtnRef}
          className="absolute top-4 right-4 text-3xl"
        >
          ×
        </button>
      </div>
    </dialog>
  );
}


