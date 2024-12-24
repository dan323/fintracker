import React, { useState } from "react";
import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import './transaction-chart.css'
import { Transaction } from "../models/transaction";

interface Props {
    transactions: Transaction[];
}

interface Data { month: string; revenue: number; expenditure: number }

// Map of Spanish month names to their numeric indices (0 for January, 11 for December)
const monthMap: { [key: string]: number } = {
    ene: 0,
    feb: 1,
    mar: 2,
    abr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    ago: 7,
    sept: 8,
    oct: 9,
    nov: 10,
    dic: 11,
};

const TransactionChart: React.FC<Props> = ({ transactions }: Props) => {
    // Group transactions by month and calculate revenue/expenditure
    const [showRevenue, setShowRevenue] = useState(true);
    const monthlyData: { [key: string]: Data } = transactions.reduce<Record<string, Data>>(
        (acc: { [key: string]: Data }, tx: Transaction) => {
            const date = new Date(tx.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`; // e.g., "2023-12"
            const monthLabel = date.toLocaleString("default", { month: "short", year: "numeric" }); // e.g., "Dec 2023"

            if (!acc[monthKey]) {
                acc[monthKey] = { month: monthLabel, revenue: 0, expenditure: 0 };
            }

            if (tx.amount > 0) {
                acc[monthKey].revenue += tx.amount;
            } else {
                acc[monthKey].expenditure += Math.abs(tx.amount);
            }

            return acc;
        },
        {}
    );

    const chartData: { month: string, revenue: number, expenditure: number, profit: number }[] = Object.values(monthlyData)
        .map((data: Data) => ({
            month: data.month,
            revenue: parseFloat(data.revenue.toFixed(2)), // Ensure proper rounding
            expenditure: parseFloat((-data.expenditure).toFixed(2)), // Make expenditure positive for chart
            profit: parseFloat((data.revenue - data.expenditure).toFixed(2)) // Difference
        }))
        .sort((d1, d2) => {
            const parseDate = (monthYear: string): Date => {
                const [month, year] = monthYear.split(" ");
                const monthIndex = monthMap[month.toLowerCase()]; // Get the numeric index for the month
                return new Date(Number(year), monthIndex);
            };

            const dateA = parseDate(d1.month);
            const dateB = parseDate(d2.month);

            return dateA.getTime() - dateB.getTime(); // Compare timestamps
        });

    return (
        <div style={{ width: "100%", height: 300 }}>
            <div className="chart-controls">
                <label>Dividir en gastos e ingresos</label>
                <div
                    className={`toggle-switch ${showRevenue ? "on" : "off"}`}
                    onClick={() => setShowRevenue((prev: boolean) => !prev)}
                >
                    <span className="toggle-text">{showRevenue ? "On" : "Off"}</span>
                </div>
            </div>
            <ResponsiveContainer>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value: number) => `$${value.toFixed(2)}`} />
                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                    <Legend />
                    {showRevenue && <Bar dataKey="revenue" fill="#4caf50" name="Revenue" />}
                    {showRevenue && <Bar dataKey="expenditure" fill="#f44336" name="Expenditure" />}
                    {!showRevenue && <Bar dataKey="profit" name="Profit">
                        {chartData.map((entry, index) => {
                            return (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.profit >= 0 ? "#4caf50" : "#f44336"}
                                />
                            );
                        })}
                    </Bar>}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TransactionChart;
