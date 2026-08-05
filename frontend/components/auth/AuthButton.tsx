type AuthButtonProps = {
  children: React.ReactNode;
};

export default function AuthButton({
  children,
}: AuthButtonProps) {
  return (
    <button
      className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
    >
      {children}
    </button>
  );
}