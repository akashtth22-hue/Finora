"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

type ScrollMotionProps = {
    children: React.ReactNode;
    className?: string;
    strength?: number;
};

export default function ScrollMotion({
    children,
    className = "",
    strength = 28,
}: ScrollMotionProps) {
    const ref = useRef<HTMLDivElement>(null);

    const [progress, setProgress] =
        useState(0);

    useEffect(() => {
        let frame = 0;

        const update = () => {
            if (!ref.current) return;

            const rect =
                ref.current.getBoundingClientRect();

            const viewportHeight =
                window.innerHeight;

            const raw =
                (viewportHeight - rect.top) /
                (viewportHeight + rect.height);

            const next = Math.max(
                0,
                Math.min(1, raw)
            );

            setProgress(next);

            frame = 0;
        };

        const handleScroll = () => {
            if (!frame) {
                frame =
                    window.requestAnimationFrame(
                        update
                    );
            }
        };

        update();

        window.addEventListener(
            "scroll",
            handleScroll,
            { passive: true }
        );

        window.addEventListener(
            "resize",
            update
        );

        return () => {
            window.removeEventListener(
                "scroll",
                handleScroll
            );

            window.removeEventListener(
                "resize",
                update
            );

            if (frame) {
                window.cancelAnimationFrame(
                    frame
                );
            }
        };
    }, []);

    const centered =
        progress - 0.5;

    const translateY =
        -centered * strength;

    const scale =
        0.97 +
        Math.max(
            0,
            1 -
                Math.abs(
                    centered
                ) * 1.6
        ) *
            0.035;

    const opacity =
        0.78 +
        Math.max(
            0,
            1 -
                Math.abs(
                    centered
                ) * 2
        ) *
            0.22;

    return (
        <div
            ref={ref}
            className={className}
            style={{
                transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
                opacity,
                willChange:
                    "transform, opacity",
            }}
        >
            {children}
        </div>
    );
}