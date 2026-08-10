"use client";

import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
    Bar,
    BarChart,
} from "recharts";

import { useQuery } from "@tanstack/react-query";

type CategoryData = {
    category: string;
    amount: number;
    percentage: number;
};

type MonthlyData = {
    month: string;
    income: number;
    expenses: number;
    net: number;
};

type AnalyticsData = {
    summary: {
        totalIncome: number;
        totalExpenses: number;
        netCashFlow: number;
        savingsRate: number;
    };
    categoryBreakdown: CategoryData[];
    topCategories: CategoryData[];
    monthlyData: MonthlyData[];
};

const pieColors = [
    "#7c3aed",
    "#2563eb",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#ec4899",
    "#06b6d4",
    "#8b5cf6",
];

const formatCurrency = (value: number) =>
    `₹${value.toLocaleString("en-IN")}`;

const formatMonth = (month: string) => {
    const date = new Date(`${month}-01T00:00:00`);

    return date.toLocaleDateString("en-IN", {
        month: "short",
        year: "2-digit",
    });
};

const formatChartCurrency = (value: number) => {
    if (value >= 100000) {
        return `₹${(value / 100000).toFixed(1)}L`;
    }

    if (value >= 1000) {
        return `₹${(value / 1000).toFixed(0)}K`;
    }

    return `₹${value}`;
};

export default function AnalyticsContent() {
    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useQuery<AnalyticsData>({
        queryKey: ["analytics"],

        queryFn: async () => {
            const response = await fetch(
                "/api/analytics",
                {
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch analytics"
                );
            }

            const result = await response.json();

            return {
                summary: result.summary,
                categoryBreakdown:
                    result.categoryBreakdown,
                topCategories:
                    result.topCategories,
                monthlyData:
                    result.monthlyData,
            };
        },
    });

    if (isLoading) {
        return (
            <div className="py-20 text-center text-gray-500">
                Loading analytics...
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 py-16 text-center">

                <h3 className="text-lg font-semibold text-red-700">
                    Failed to load analytics
                </h3>

                <p className="mt-2 text-sm text-red-600">
                    Something went wrong while loading
                    your financial analytics.
                </p>

                <button
                    onClick={() => refetch()}
                    className="mt-6 rounded-xl bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700"
                >
                    Try Again
                </button>

            </div>
        );
    }

    const {
        totalIncome,
        totalExpenses,
        netCashFlow,
        savingsRate,
    } = data.summary;

    const pieData = data.categoryBreakdown.map(
        (category) => ({
            name: category.category,
            value: category.amount,
        })
    );

    return (
        <div className="space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Analytics
                </h1>

                <p className="mt-2 text-gray-500">
                    Understand your financial performance
                    and spending patterns.
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Total Income
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-green-600">
                        {formatCurrency(totalIncome)}
                    </h2>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Total Expenses
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-red-500">
                        {formatCurrency(totalExpenses)}
                    </h2>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Net Cash Flow
                    </p>

                    <h2
                        className={`mt-2 text-2xl font-bold ${
                            netCashFlow >= 0
                                ? "text-purple-600"
                                : "text-red-500"
                        }`}
                    >
                        {formatCurrency(netCashFlow)}
                    </h2>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Savings Rate
                    </p>

                    <h2
                        className={`mt-2 text-2xl font-bold ${
                            savingsRate >= 0
                                ? "text-green-600"
                                : "text-red-500"
                        }`}
                    >
                        {savingsRate.toFixed(1)}%
                    </h2>
                </div>

            </div>

            {/* Income vs Expenses */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                        Income vs Expenses
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Compare your monthly income and
                        spending over time.
                    </p>
                </div>

                {data.monthlyData.length === 0 ? (
                    <div className="flex h-[320px] items-center justify-center text-gray-500">
                        No transaction data available yet.
                    </div>
                ) : (
                    <div className="h-[320px] w-full">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >
                            <BarChart
                                data={data.monthlyData}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: 0,
                                    bottom: 5,
                                }}
                                barGap={8}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="month"
                                    tickFormatter={
                                        formatMonth
                                    }
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{
                                        fontSize: 12,
                                    }}
                                />

                                <YAxis
                                    tickFormatter={
                                        formatChartCurrency
                                    }
                                    tickLine={false}
                                    axisLine={false}
                                    width={60}
                                    tick={{
                                        fontSize: 11,
                                    }}
                                />

                                <Tooltip
                                    formatter={(
                                        value,
                                        name
                                    ) => [
                                        formatCurrency(
                                            Number(value)
                                        ),
                                        name ===
                                        "income"
                                            ? "Income"
                                            : "Expenses",
                                    ]}
                                    labelFormatter={(
                                        label
                                    ) =>
                                        formatMonth(
                                            String(
                                                label
                                            )
                                        )
                                    }
                                    contentStyle={{
                                        borderRadius:
                                            "12px",
                                        border: "1px solid #e5e7eb",
                                        boxShadow:
                                            "0 8px 24px rgba(0,0,0,0.08)",
                                    }}
                                />

                                <Legend />

                                <Bar
                                    dataKey="income"
                                    name="Income"
                                    fill="#10b981"
                                    radius={[
                                        5,
                                        5,
                                        0,
                                        0,
                                    ]}
                                    maxBarSize={32}
                                />

                                <Bar
                                    dataKey="expenses"
                                    name="Expenses"
                                    fill="#ef4444"
                                    radius={[
                                        5,
                                        5,
                                        0,
                                        0,
                                    ]}
                                    maxBarSize={32}
                                />

                            </BarChart>
                        </ResponsiveContainer>

                    </div>
                )}

            </div>

            {/* Category + Top Spending */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                {/* Expense Breakdown */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-gray-900">
                            Expense Breakdown
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            See how your expenses are
                            distributed.
                        </p>
                    </div>

                    {pieData.length === 0 ? (
                        <div className="flex h-[320px] items-center justify-center text-gray-500">
                            No expense data available yet.
                        </div>
                    ) : (
                        <div className="h-[320px] w-full">

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <PieChart>

                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="48%"
                                        innerRadius="55%"
                                        outerRadius="78%"
                                        paddingAngle={3}
                                        dataKey="value"
                                        nameKey="name"
                                    >
                                        {pieData.map(
                                            (
                                                entry,
                                                index
                                            ) => (
                                                <Cell
                                                    key={`cell-${entry.name}`}
                                                    fill={
                                                        pieColors[
                                                            index %
                                                                pieColors.length
                                                        ]
                                                    }
                                                />
                                            )
                                        )}
                                    </Pie>

                                    <Tooltip
                                        formatter={(
                                            value,
                                            name
                                        ) => [
                                            formatCurrency(
                                                Number(
                                                    value
                                                )
                                            ),
                                            String(
                                                name
                                            ),
                                        ]}
                                        contentStyle={{
                                            borderRadius:
                                                "12px",
                                            border: "1px solid #e5e7eb",
                                            boxShadow:
                                                "0 8px 24px rgba(0,0,0,0.08)",
                                        }}
                                    />

                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        wrapperStyle={{
                                            fontSize:
                                                "12px",
                                        }}
                                    />

                                </PieChart>
                            </ResponsiveContainer>

                        </div>
                    )}

                </div>

                {/* Top Spending */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900">
                            Top Spending
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Your biggest expense categories.
                        </p>
                    </div>

                    {data.topCategories.length ===
                    0 ? (
                        <div className="flex h-[250px] items-center justify-center text-gray-500">
                            No spending data available yet.
                        </div>
                    ) : (
                        <div className="space-y-4">

                            {data.topCategories.map(
                                (
                                    category,
                                    index
                                ) => (
                                    <div
                                        key={
                                            category.category
                                        }
                                        className="flex items-center gap-4 rounded-xl bg-gray-50 p-4"
                                    >

                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 font-bold text-purple-600">
                                            {index +
                                                1}
                                        </div>

                                        <div className="min-w-0 flex-1">

                                            <p className="truncate font-semibold text-gray-900">
                                                {
                                                    category.category
                                                }
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                {category.percentage.toFixed(
                                                    1
                                                )}
                                                % of expenses
                                            </p>

                                        </div>

                                        <p className="font-bold text-gray-900">
                                            {formatCurrency(
                                                category.amount
                                            )}
                                        </p>

                                    </div>
                                )
                            )}

                        </div>
                    )}

                </div>

            </div>

            {/* Detailed Category List */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                        Spending by Category
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Detailed breakdown of your expenses.
                    </p>
                </div>

                {data.categoryBreakdown.length ===
                0 ? (
                    <div className="py-12 text-center text-gray-500">
                        No expense data available yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        {data.categoryBreakdown.map(
                            (category) => (
                                <div
                                    key={
                                        category.category
                                    }
                                    className="rounded-xl border border-gray-100 p-4"
                                >

                                    <div className="flex items-center justify-between gap-4">

                                        <span className="font-medium text-gray-700">
                                            {
                                                category.category
                                            }
                                        </span>

                                        <span className="font-semibold text-gray-900">
                                            {formatCurrency(
                                                category.amount
                                            )}
                                        </span>

                                    </div>

                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">

                                        <div
                                            className="h-full rounded-full bg-purple-600 transition-all"
                                            style={{
                                                width: `${Math.min(
                                                    category.percentage,
                                                    100
                                                )}%`,
                                            }}
                                        />

                                    </div>

                                    <p className="mt-2 text-xs text-gray-400">
                                        {category.percentage.toFixed(
                                            1
                                        )}
                                        % of total expenses
                                    </p>

                                </div>
                            )
                        )}

                    </div>
                )}

            </div>

        </div>
    );
}