import { useState, useMemo } from "react"
import { pizzaData } from "./data"

export default function usePizzaFilters() {
  const [headerSearchQuery, setHeaderSearchQuery] = useState("")

  const [draftPriceFrom, setDraftPriceFrom] = useState("")
  const [draftPriceTo, setDraftPriceTo] = useState("")

  const [draftSelectedIngredients, setDraftSelectedIngredients] = useState<string[]>([])
  const [draftSelectedPizzaTypes, setDraftSelectedPizzaTypes] = useState<string[]>([])

  const [appliedPriceFrom, setAppliedPriceFrom] = useState("")
  const [appliedPriceTo, setAppliedPriceTo] = useState("")
  const [appliedIngredients, setAppliedIngredients] = useState<string[]>([])
  const [appliedPizzaTypes, setAppliedPizzaTypes] = useState<string[]>([])

  const [activeSegment, setActiveSegment] = useState(0)
  const [activeSort, setActiveSort] = useState(0)

  const segments = ["All", "Meat", "Spicy", "Sweet", "Vegetarian", "Chicken"]
  const sortOptions = ["Popularity", "Price", "Alphabet"]

  const submitFilters = () => {
    setAppliedPriceFrom(draftPriceFrom)
    setAppliedPriceTo(draftPriceTo)
    setAppliedIngredients(draftSelectedIngredients)
    setAppliedPizzaTypes(draftSelectedPizzaTypes)
  }

  const resetFilters = () => {
    setDraftPriceFrom("")
    setDraftPriceTo("")
    setDraftSelectedIngredients([])
    setDraftSelectedPizzaTypes([])

    setAppliedPriceFrom("")
    setAppliedPriceTo("")
    setAppliedIngredients([])
    setAppliedPizzaTypes([])
  }

  const filteredPizzas = useMemo(() => {
    let result = [...pizzaData]

    if (headerSearchQuery.trim()) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(headerSearchQuery.toLowerCase())
      )
    }

    if (appliedPriceFrom) {
      result = result.filter(p => p.price >= Number(appliedPriceFrom))
    }

    if (appliedPriceTo) {
      result = result.filter(p => p.price <= Number(appliedPriceTo))
    }

    if (appliedIngredients.length > 0) {
      result = result.filter(p =>
        appliedIngredients.every(ing =>
          p.ingredients.toLowerCase().includes(ing.toLowerCase())
        )
      )
    }

    if (appliedPizzaTypes.length > 0) {
      result = result.filter(p =>
        appliedPizzaTypes.includes(p.pizzaType as string)
      )
    }

    const selectedSegment = segments[activeSegment]

    if (selectedSegment !== "All") {
      const seg = selectedSegment.toLowerCase()

      result = result.filter(p => {
        if (!p.pizzaCategory) return false

        if (Array.isArray(p.pizzaCategory)) {
          return p.pizzaCategory.includes(seg as any)
        }

        return p.pizzaCategory === seg
      })
    }

    const selectedSort = sortOptions[activeSort]

    if (selectedSort === "Price") {
      result.sort((a, b) => a.price - b.price)
    } else if (selectedSort === "Alphabet") {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else {
      result.sort((a, b) => b.purchase - a.purchase)
    }

    return result
  }, [
    headerSearchQuery,
    appliedPriceFrom,
    appliedPriceTo,
    appliedIngredients,
    appliedPizzaTypes,
    activeSegment,
    activeSort
  ])

  return {
    headerSearchQuery,
    setHeaderSearchQuery,

    draftPriceFrom,
    draftPriceTo,
    setDraftPriceFrom,
    setDraftPriceTo,

    draftSelectedIngredients,
    setDraftSelectedIngredients,

    draftSelectedPizzaTypes,
    setDraftSelectedPizzaTypes,

    filteredPizzas,
    submitFilters,
    resetFilters,

    activeSegment,
    setActiveSegment,
    segments,

    activeSort,
    setActiveSort,
    sortOptions
  }
}