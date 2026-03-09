import Segmentbar from "./Segmentbar";

interface CategoryBarProps {
  segments: string[];
  activeSegment: number;
  setActiveSegment: (i: number) => void;

  activeSort: number;
  setActiveSort: (i: number) => void;

  sortOptions: string[];
  sortIcon: string;
}

export default function CategoryBar({
  segments,
  activeSegment,
  setActiveSegment,
  activeSort,
  setActiveSort,
  sortOptions,
  sortIcon,
}: CategoryBarProps) {
  return (
    <div className="h-[8vh] w-[80vw] fixed top-[10vh] right-0 px-2 pr-4 border-b-2 border-[var(--gray)] flex items-center justify-between z-[20]">
      
      <Segmentbar
        elems={segments}
        selectedIndex={activeSegment}
        onSelect={(i) => setActiveSegment(i)}
        width="w-[65%]"
        height="h-[80%]"
      />

      <div className="w-[25%] h-[80%] bg-[var(--gray)] rounded-xl flex items-center justify-center gap-2 px-2">
        <img src={sortIcon} className="w-5 h-5" />
        <p className="text-medium mr-1">Sort by:</p>

        <select
          value={activeSort}
          onChange={(e) => setActiveSort(Number(e.target.value))}
          className="bg-transparent appearance-none outline-none text-[var(--orange)] cursor-pointer text-medium"
        >
          {sortOptions.map((sortOption, index) => (
            <option key={sortOption} value={index}>
              {sortOption}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}