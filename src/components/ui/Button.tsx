import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	margin?: string;
	isLoading?: boolean;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ children, margin, className, disabled, isLoading, ...props }, ref) => {
		const isDisabled = disabled || isLoading;

		return (
			<button
				ref={ref}
				{...props}
				disabled={isDisabled}
				aria-busy={isLoading}
				className={`
          flex justify-center items-center text-white text-medium w-full h-12 rounded-2xl
          transition-all duration-200 px-4 font-semibold shadow-sm ${margin ?? ""} ${className ?? ""}
          ${
						isDisabled
							? "bg-gray-400 cursor-not-allowed hover:brightness-100 active:scale-100 opacity-80"
							: "bg-[var(--orange)] hover:brightness-[1.06] active:brightness-[0.92] active:scale-[0.98]"
					}
        `}
			>
				{isLoading ? "Processing..." : children}
			</button>
		);
	},
);

export default Button;
