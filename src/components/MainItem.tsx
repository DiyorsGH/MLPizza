// removed unused useState import
import Counter from "./Counter"
import { plus, detectTags } from "../data"
import type { PizzaCategoryT, PizzaDataType, PizzaTypeT } from "../data"

export default function MainItem({
  img,
  name,
  ingredients,
  price,
  pizzaType,
  pizzaCategory,
  purchase,
  openToppingsModal,
  count,
  setCount,
}: {
  img: string
  name: string
  ingredients: string
  price: number
  pizzaType: PizzaTypeT
  pizzaCategory?: PizzaCategoryT | PizzaCategoryT[]
  purchase: number
  openToppingsModal: (pizza: PizzaDataType) => void
  count: number
  setCount: (c: number) => void
}) {
  // count is now controlled by parent (cart)
  const pizzaCount = count

  const tags = detectTags(pizzaCategory)

  return (
    <div 
      className="border-2 border-[var(--gray)] rounded-2xl bg-white shadow-sm hover:shadow-xl hover:translate-y-[-3px] hover:translate-x-[-3px] transition flex flex-col overflow-hidden w-full h-full cursor-not-allowed"
    >
      
      <div className="relative w-full h-[140px] flex items-center justify-center bg-orange-50">
        
        {tags.length > 0 && (
          <div className="absolute top-4 right-4 flex flex-col gap-1 items-end z-10">
            {tags.map(tag => (
              <div
                key={tag.key}
              >
                <img src={tag.img} alt={tag.key} className={`w-${tag.width} h-${tag.height}`} />
              </div>
            ))}
          </div>
        )}

        <img
          src={img}
          alt={name}
          className="w-[130px] h-[130px] object-contain bg-white"
          style={{ clipPath: "circle(47% at 50% 50%)" }}
        />
      </div>

      <div className="p-2 px-4 flex flex-col justify-between h-[132px]">
        
        <span className="text-[1.2rem] font-bold">{name}</span>

        <p className="text-[0.8rem] text-gray-600 flex-1">
          {ingredients}
        </p>

        <div className="flex justify-between items-center">
          <p className="text-lg font-bold">{price} $</p>

          <div className="w-[120px] flex justify-end">
            {pizzaCount === 0 ? (
              <button
                className="bg-orange-50 h-8 w-[80%] gap-2 rounded-lg flex items-center justify-center text-[1.1rem] transition"
                onClick={() => {
                  openToppingsModal({img, name, ingredients, price, pizzaType, pizzaCategory, purchase})
                }}
              >
                <img src={plus} alt="" className="h-3 w-3" />
                Add
              </button>
            ) : (
              <Counter count={pizzaCount} setCount={setCount} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}