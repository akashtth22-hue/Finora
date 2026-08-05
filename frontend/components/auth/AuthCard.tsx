type AuthCardProps = {
    title: string;
    subtitle: string;
    children: React.ReactNode;
};

export default function AuthCard({
    title,
    subtitle,
    children,
}: AuthCardProps) {
    return (
        <div className="w-full max-w-sm rounded-[32px] border border-white/60 bg-white/90 p-8 shadow-2xl backdrop-blur-md transition-all duration-300">
            <div className="mb-6 text-center">

                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 shadow-lg">

                    <span className="text-2xl text-white">
                        ₹
                    </span>

                </div>

                <h2 className="text-lg font-semibold tracking-wide text-purple-600">
                    FINORA
                </h2>

                <h1 className="mt-3 text-3xl font-bold text-gray-900">
                    {title}
                </h1>

                <p className="mt-3 text-gray-500">
                    {subtitle}
                </p>

            </div>
            {children}

        </div>
    );
}