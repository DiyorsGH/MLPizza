import { useState, useEffect } from "react"
import Counter from "../shared/Counter"
import Line from "../shared/Line"
import { plus, detectTags } from "../../data/data"
import type { PizzaCategoryT, PizzaDataType, PizzaTypeT } from "../../data/data"

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
  const [loading, setLoading] = useState(true)
  const pizzaCount = count
  const tags = detectTags(pizzaCategory)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    // Skeleton Loader
    return (
      <div className="card-container border-2 border-[var(--gray)] rounded-2xl bg-white shadow-sm flex flex-col overflow-hidden w-full h-full animate-skeleton-fade">
        <div className="relative w-full h-[140px] flex items-center justify-center bg-white">
          <div className="w-[120px] h-[120px] rounded-full bg-[var(--gray)] skeleton" />
        </div>
        <Line width="w-full"/>
        <div className="p-3 px-4 flex flex-col justify-between h-[132px] bg-white">
          <div className="w-[120px] h-[20px] bg-[var(--gray)] rounded-xl skeleton"></div>
          <div className="h-[30px] w-full bg-[var(--gray)] rounded-xl skeleton"></div>
          <div className="flex justify-between items-center">
            <div className="h-[20px] w-[50px] bg-[var(--gray)] rounded-xl skeleton"></div>
            <div className="w-[70px] h-[20px] bg-[var(--gray)] rounded-xl skeleton"></div>
          </div>
        </div>
      </div>
    )
  }

  // Real card
  return (
    <div 
      className="border-2 border-[var(--gray)] rounded-2xl bg-white shadow-sm hover:shadow-xl hover:translate-y-[-3px] hover:translate-x-[-3px] transition flex flex-col overflow-hidden w-full h-full"
    >
      <div className="relative w-full h-[140px] flex items-center justify-center bg-orange-50">
        {tags.length > 0 && (
          <div className="absolute top-4 right-4 flex flex-col gap-1 items-end z-10">
            {tags.map(tag => (
              <div key={tag.key}>
                <img src={tag.img} alt={tag.key} className={`w-${tag.width} h-${tag.height}`} />
              </div>
            ))}
          </div>
        )}
        <img
          src={img}
          alt={name}
          className="w-[130px] h-[130px] object-contain bg-white"
          style={{ clipPath: "circle(48% at 50% 50%)" }}
        />
      </div>

      <div className="p-2 px-4 flex flex-col justify-between h-[132px]">
        <span className="text-big font-bold">{name}</span>

        <p className="text-small text-gray-600 flex-1">{ingredients}</p>

        <div className="flex justify-between items-center">
          <p className="text-big font-bold">{price} $</p>

          <div className="w-[120px] flex justify-end">
            {pizzaCount === 0 ? (
              <button
                className="bg-orange-50 h-8 w-[80%] gap-2 rounded-lg flex items-center justify-center text-medium transition"
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