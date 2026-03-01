import { useState, useRef, useEffect } from "react";

export default function ToppingsSegmentbar({
    elems,
    selectedIndex = 0,
    onSelect,
    width,
    height
}: {
    elems: string[];
    selectedIndex?: number;
    onSelect?: (i: number) => void;
    width?: string;
    height?: string;
}) {
const [active, setActive] = useState(selectedIndex);
const ref = useRef<HTMLDivElement>(null);
const [style, setStyle] = useState({ left: 0, width: 0 });
useEffect(() => {
    setActive(selectedIndex);
}, [selectedIndex]);

// useLayoutEffect so measurement happens after DOM updates but before paint
useEffect(() => {
    const btn = ref.current?.querySelectorAll("button")[active] as HTMLElement;
    if (!btn) return;

    setStyle({
    left: btn.offsetLeft,
    width: btn.offsetWidth,
    });
}, [active, elems]);

// also update when the component first mounts, in case selectedIndex
// defaults to 0 but the buttons haven't been measured yet
useEffect(() => {
    // schedule measurement on next tick
    requestAnimationFrame(() => {
    const btn = ref.current?.querySelectorAll("button")[active] as HTMLElement;
    if (!btn) return;
    setStyle({ left: btn.offsetLeft, width: btn.offsetWidth });
    });
}, []);

const select = (i: number) => {
    setActive(i);
    onSelect?.(i);
};

return (
    <div
    ref={ref}
    className={`relative flex ${width} ${height} bg-gray-200 rounded-full overflow-hidden px-2 my-1`}
    >
    {elems.map((el, i) => (
        <button
        key={i}
        onClick={() => select(i)}
        className={`flex-1 z-10 text-[1.1rem] font-medium transition-colors ${
            active === i ? "text-[var(--orange)]" : "text-gray-700"
        }`}
        >
        {el}
        </button>
    ))}

    <div
        className="absolute top-1/2 h-[75%] bg-white rounded-full -translate-y-1/2 transition-all duration-300 z-0 shadow-md"
        style={style}
    />
    </div>
);
}