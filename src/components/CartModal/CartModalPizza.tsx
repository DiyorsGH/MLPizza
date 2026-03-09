import Counter from "../shared/Counter";
import Line from "../shared/Line";
import type { PizzaDataType } from "../../data/data";
import { useContext } from "react";
import { PizzaContext } from "./CartModal";

function CartModalPizza({
  pizza,
  count,
  size,
  crust,
  adds,
  addsPrice,
}: {
  pizza: PizzaDataType;
  count: number;
  size?: string | null;
  crust?: string | null;
  adds?: string[] | null;
  addsPrice: number;
}) {
  const pizzaContext = useContext(PizzaContext);

  const pricePerItem = pizza.price + (addsPrice ?? 0);

  return (
    <div className="w-full h-[140px] grid grid-cols-5 grid-rows-2 gap-2 bg-white p-2 my-2">
      
      <img
        src={pizza.img}
        alt={pizza.name}
        className="row-start-1 col-start-1 w-full h-full object-contain"
      />

      <div className="row-start-1 col-start-2 col-span-4">
        <p className="font-semibold truncate text-xl">
          {pizza.name}
        </p>

        <p className="font-semibold text-small text-gray-600 mb-1">
          {size}, {crust}, {pizza.pizzaType}
          {adds && adds.length > 0 && `, + ${adds.join(", ")}`}
        </p>

        <Line width="w-full" />
      </div>

      <div className="row-start-2 col-start-2 col-span-4 flex items-center justify-between gap-3">
        <Counter
          count={count}
          setCount={(newCount: number) => {
            pizzaContext?.onChangeCount(pizza, newCount);
          }}
        />

        <span className="text-medium text-gray-600">
          {pricePerItem} $ each
        </span>
      </div>
    </div>
  );
}

export default CartModalPizza;