"use client";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
} from "recharts";

const COLORS = [
    "#7C3AED",
    "#A855F7",
    "#EC4899",
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#6366F1",
    "#14B8A6",
];

type ExpenseItem = {
    name: string;
    value: number;
    percentage: number;
};

type Props = {
    data: ExpenseItem[];
};

function formatCurrency(
    value: number
): string {
    return `₹${Number(
        value || 0
    ).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
    })}`;
}

export default function ExpenseChart({
    data,
}: Props) {
    const total = data.reduce(
        (sum, item) =>
            sum + Number(item.value || 0),
        0
    );

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            {/* ================= HEADER ================= */}

            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Expense by Category
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Current month
                    </p>
                </div>

                <span className="shrink-0 rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-600">
                    This Month
                </span>
            </div>

            {/* ================= EMPTY STATE ================= */}

            {data.length === 0 ? (
                <div className="flex h-[360px] items-center justify-center text-center">
                    <div>
                        <p className="font-semibold text-gray-700">
                            No expenses yet
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Add expenses to see your spending breakdown.
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    {/* ================= PIE CHART ================= */}

                    <div className="relative mt-5 h-[250px]">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >
                            <PieChart>

                                <Pie
                                    data={data}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={65}
                                    outerRadius={95}
                                    paddingAngle={3}
                                >
                                    {data.map(
                                        (
                                            entry,
                                            index
                                        ) => (
                                            <Cell
                                                key={`${entry.name}-${index}`}
                                                fill={
                                                    COLORS[
                                                        index %
                                                            COLORS.length
                                                    ]
                                                }
                                            />
                                        )
                                    )}
                                </Pie>

                                <Tooltip
                                    formatter={(
                                        value
                                    ) =>
                                        formatCurrency(
                                            Number(
                                                value
                                            )
                                        )
                                    }
                                />

                            </PieChart>
                        </ResponsiveContainer>

                        {/* ================= CENTER TOTAL ================= */}

                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <div className="text-center">

                                <p className="text-2xl font-extrabold text-gray-900">
                                    {formatCurrency(
                                        total
                                    )}
                                </p>

                                <p className="text-xs text-gray-500">
                                    Total
                                </p>

                            </div>
                        </div>
                    </div>

                    {/* ================= CATEGORY LIST ================= */}

                    <div className="mt-3 space-y-3">

                        {data
                            .slice(0, 6)
                            .map(
                                (
                                    item,
                                    index
                                ) => (
                                    <div
                                        key={
                                            item.name
                                        }
                                        className="flex items-center justify-between gap-3"
                                    >

                                        <div className="flex min-w-0 items-center gap-3">

                                            <div
                                                className="h-3 w-3 shrink-0 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        COLORS[
                                                            index %
                                                                COLORS.length
                                                        ],
                                                }}
                                            />

                                            <span className="truncate text-sm text-gray-700">
                                                {
                                                    item.name
                                                }
                                            </span>

                                        </div>

                                        <div className="flex shrink-0 items-center gap-3">

                                            <span className="text-xs text-gray-400">
                                                {Number(
                                                    item.percentage ||
                                                        0
                                                ).toFixed(
                                                    0
                                                )}
                                                %
                                            </span>

                                            <span className="text-sm font-semibold text-gray-900">
                                                {formatCurrency(
                                                    Number(
                                                        item.value ||
                                                            0
                                                    )
                                                )}
                                            </span>

                                        </div>

                                    </div>
                                )
                            )}

                    </div>
                </>
            )}
        </div>
    );
}