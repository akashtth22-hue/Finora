import Button from "@/components/ui/Button";

export default function CTA() {
    return (
        <section className="bg-gradient-to-r from-purple-600 to-violet-600 py-8">
            <div className="mx-auto max-w-5xl px-8 text-center text-white">
                <h2 className="text-4xl font-bold leading-tight">
                    Ready to Make Smarter Financial Decisions?
                </h2>

                <p className="mx-auto mt-6 max-w-2xl text-lg text-purple-100">
                    Join Finora and let AI help you make confident money decisions
                    before you spend.
                </p>

                <div className="mt-8 flex justify-center">
                    <Button variant="light">
                        Get Started Free
                    </Button>
                </div>

            </div>
        </section>
    );
}