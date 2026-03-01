import { useState, useEffect } from "react"
import { tick } from "../data"

type SidebarListItemProps = {
    text: string
    checked?: boolean
    onCheckChange?: (isChecked: boolean, text: string) => void
}

export default function SidebarListItem({ text, checked = false, onCheckChange }: SidebarListItemProps) {
    const [isChecked, setIsChecked] = useState(checked)

    useEffect(() => {
        setIsChecked(checked)
    }, [checked])

    const handleToggle = () => {
        const next = !isChecked
        setIsChecked(next)
        onCheckChange?.(next, text)
    }

    const inputId = `sidebar__input_${text}`

    return (
        // remove onClick from li and rely on native input/label behavior
        <li className="w-full h-fit flex gap-4 my-1 items-center hover:translate-x-4 transition">
            <input
                type="checkbox"
                id={inputId}
                checked={isChecked}
                onChange={handleToggle}
                className="appearance-none w-6 h-6 bg-[var(--gray-dark)] rounded cursor-pointer bg-center bg-cover bg-no-repeat"
                style={{ backgroundImage: isChecked ? `url(${tick})` : "none" }}
            />
            <label htmlFor={inputId} className="text-[1.1rem] font-medium cursor-pointer">
                {text}
            </label>
        </li>
    )
}
