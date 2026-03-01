import { useState, useRef, useEffect } from "react";

export default function Segmentbar({
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

  useEffect(() => {
    const btn = ref.current?.querySelectorAll("button")[active] as HTMLElement;
    if (!btn) return;

    setStyle({
      left: btn.offsetLeft,
      width: btn.offsetWidth,
    });
  }, [active]);

  const select = (i: number) => {
    setActive(i);
    onSelect?.(i);
  };

  return (
    <div
      ref={ref}
      className={`relative flex ${width} ${height} bg-[var(--gray)] rounded-xl overflow-hidden px-2`}
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
        className="absolute top-1/2 h-[75%] bg-white rounded-xl -translate-y-1/2 transition-all duration-300 z-0 shadow-md"
        style={style}
      />
    </div>
  );
}