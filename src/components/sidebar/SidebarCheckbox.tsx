import { useEffect, useState } from "react";
import { Translate } from "../translate/Translate";

type SidebarCheckboxProps = {
	text: string;
	checked?: boolean;
	onCheckChange?: (isChecked: boolean, text: string) => void;
};

export default function SidebarCheckbox({
	text,
	checked = false,
	onCheckChange,
}: SidebarCheckboxProps) {
	const [isChecked, setIsChecked] = useState(checked);

	useEffect(() => {
		setIsChecked(checked);
	}, [checked]);

	const handleToggle = () => {
		const next = !isChecked;
		setIsChecked(next);
		onCheckChange?.(next, text);
	};

	// Make ID safe for spaces and special chars
	const inputId = `sidebar__input_${text.replace(/\s+/g, "_")}`;

	return (
		<li className="w-full flex gap-4 items-center rounded-xl px-2 py-[2px] transition hover:bg-[var(--orange-soft)]">
			<input
				type="checkbox"
				id={inputId}
				checked={isChecked}
				onChange={handleToggle}
				className={`${isChecked ? "customCheckbox border-[var(--orange)] bg-[var(--orange-light)]" : "border-[var(--gray-dark)] bg-[var(--surface)]"} appearance-none w-6 h-6 rounded-lg border cursor-pointer bg-center bg-contain bg-no-repeat shrink-0 transition`}
			/>
			<label
				htmlFor={inputId}
				className="text-[1.05rem] font-medium cursor-pointer select-none"
			>
				<Translate>{text}</Translate>
			</label>
		</li>
	);
}
