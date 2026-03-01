import SidebarListItem from "./SidebarListItem"
import Line from "./Line"
import SidebarPriceInput from "./SidebarPriceInput"
import Title from "./Title"
import type { Dispatch, SetStateAction } from "react"

type FilterSidebarProps = {
    draftPriceFrom: string
    draftPriceTo: string
    setDraftPriceFrom: (val: string) => void
    setDraftPriceTo: (val: string) => void
    draftSelectedIngredients: string[]
    setDraftSelectedIngredients: Dispatch<SetStateAction<string[]>>
    draftSelectedPizzaTypes: string[]
    setDraftSelectedPizzaTypes: Dispatch<SetStateAction<string[]>>
    submitFilters: () => void
    resetFilters: () => void
    sidebarIngredients: string[]
}

export default function FilterSidebar({
    draftPriceFrom,
    draftPriceTo,
    setDraftPriceFrom,
    setDraftPriceTo,
    draftSelectedIngredients,
    setDraftSelectedIngredients,
    draftSelectedPizzaTypes,
    setDraftSelectedPizzaTypes,
    submitFilters,
    resetFilters,
    sidebarIngredients
}: FilterSidebarProps) {

    const handleIngredientChange = (checked: boolean, ingredient: string) => {
        setDraftSelectedIngredients((prev: string[]) => {
        if (checked) return [...prev, ingredient.toLowerCase()]
        else return prev.filter((ing: string) => ing !== ingredient.toLowerCase())
    })
}

    const handlePizzaTypeChange = (checked: boolean, pizzaType: string) => {
        setDraftSelectedPizzaTypes((prev: string[]) => {
            if (checked) return [...prev, pizzaType.toLowerCase()]
            else return prev.filter((type: string) => type !== pizzaType.toLowerCase())
        })
    }

    return (
        <aside className="w-[20vw] fixed left-0 top-[10vh] bottom-0 p-4 border-r-2 border-[var(--gray)] z-[20]">
            <Title titleContent="Filters" fontSize="text-4xl" margin="mb-4" bold="font-bold" />

            <SidebarListItem text="New" checked={draftSelectedPizzaTypes.includes("new")} onCheckChange={handlePizzaTypeChange} />
            <SidebarListItem text="Classic" checked={draftSelectedPizzaTypes.includes("classic")} onCheckChange={handlePizzaTypeChange} />

            <Line width="w-full" />

            <Title titleContent="Price from & to" fontSize="text-xl" margin="mb-3" />
            <div className="flex gap-4">
                <SidebarPriceInput currency="$" value={draftPriceFrom} onChange={setDraftPriceFrom} />
                <SidebarPriceInput currency="$" value={draftPriceTo} onChange={setDraftPriceTo} />
            </div>

            <Line width="w-full" />

            <Title titleContent="Ingredients" fontSize="text-xl" margin="mb-3" />
            {sidebarIngredients.map(ingredient => (
                <SidebarListItem
                    key={ingredient}
                    text={ingredient}
                    checked={draftSelectedIngredients.includes(ingredient.toLowerCase())}
                    onCheckChange={handleIngredientChange}
                />
            ))}

            <button
                onClick={submitFilters}
                className="orangeBtnHover w-full h-12 bg-[var(--orange)] text-white rounded-xl mt-4 font-medium text-[1.2rem]"
            >Submit</button>

            <button
                onClick={resetFilters}
                className="orangeBtnHover w-full h-12 bg-[var(--orange)] text-white rounded-xl mt-4 font-medium text-[1.2rem]"
            >Reset</button>
        </aside>
    )
}
