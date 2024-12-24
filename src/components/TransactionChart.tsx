import React from "react";
import {
    BarChart,
    Bar,
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

const TransactionChart: React.FC<Props> = ({ transactions }: Props) => {
    // Group transactions by month and calculate revenue/expenditure
    const monthlyData:  { [key: string]: Data } = transactions.reduce<Record<string, Data>>(
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

    const chartData: {month: string, revenue: number, expenditure: number}[] = Object.values(monthlyData)
        .sort()
        .map((data: Data) => ({
            month: data.month,
            revenue: parseFloat(data.revenue.toFixed(2)), // Ensure proper rounding
            expenditure: parseFloat((-data.expenditure).toFixed(2)), // Make expenditure positive for chart
        }));

    return (
        <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#4caf50" name="Ingresos" />
                    <Bar dataKey="expenditure" fill="#f44336" name="Gastos" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TransactionChart;
