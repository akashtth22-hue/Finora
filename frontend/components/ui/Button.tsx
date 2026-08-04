type ButtonProps = {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "light";
};

export default function Button({
    children,
    variant = "primary",
}: ButtonProps) {
    const base =
        "rounded-xl px-8 py-4 font-semibold transition duration-300";

    const styles = {
        primary:
            "bg-gradient-to-r from-purple-600 to-violet-600 px-7 py-3.5 text-white transition-all duration-300 hover:scale-105 hover:shadow-xl",

        secondary:
            "border border-gray-300 bg-white px-7 py-3.5 text-gray-700 transition-all duration-300 hover:scale-105 hover:bg-gray-50",

        light:
            "bg-white px-7 py-3.5 text-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg",
    };
    return (
        <button className={`${base} ${styles[variant]}`}>
            {children}
        </button>
    );
}