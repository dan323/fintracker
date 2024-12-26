import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Transaction } from "../../models/transaction";
import Toggle from "../toggle-switch/Toggle";
import "./pie-charts.css";
import { getColorForTransaction } from "../../utils/color";
import { Props } from "recharts/types/component/DefaultLegendContent";

interface AnalyticsProps {
    transactions: Transaction[];
}

const PieChartCategoryAccount: React.FC<AnalyticsProps> = ({ transactions }: AnalyticsProps) => {
    const [showByCategory, setShowByCategory] = useState(true);
    const [colors, setColors] = useState<Record<string, { r: number; g: number; b: number }>>({});

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
        cx, cy, midAngle, innerRadius, outerRadius, percent, value,
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
                {`${(percent * 100).toFixed(2)}%`}
            </text>
        );
    }
    // Custom legend renderer
    const renderCustomLegend = (props: Props) => {
        const { payload } = props;

        return (
            <div className="recharts-default-legend">
                {payload?.map((entry, index) => (
                    <div
                        key={`item-${index}`}
                        className="recharts-legend-item"
                        style={{ display: "flex", alignItems: "center" }}
                    >
                        <div
                            style={{
                                width: 10,
                                height: 10,
                                backgroundColor: entry.color,
                                marginRight: 5,
                                borderRadius: "50%",
                            }}
                        ></div>
                        <span>{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    };

    // Aggregate data based on the toggle
    const aggregatedData = transactions.reduce<{ [key: string]: { pos: number; neg: number } }>((acc, tx) => {
        const key = showByCategory ? tx.category : tx.account;

        if (!key) return acc;

        if (!acc[key]) {
            acc[key] = { pos: 0, neg: 0 };
        }

        if (tx.amount > 0) {
            acc[key].pos += tx.amount; // Revenue
        } else {
            acc[key].neg -= tx.amount; // Spendings (convert to positive)
        }

        return acc;
    }, {});

    const pieData = Object.entries(aggregatedData).map(([key, value]) => ({
        name: key,
        pos: parseFloat(value.pos.toFixed(2)),
        neg: parseFloat(value.neg.toFixed(2))
    }));

    return (
        <div className="analytics-container">
            <Toggle className="analytics-toggle" label="siendo agrupadas" onToggle={(status: boolean) => setShowByCategory(status)}
            textOff="Cuentas" textOn="Categorías" />
            <div className="pie-charts">
                <div className="chart">
                    <h3>Ingresos</h3>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={pieData.filter((d) => d.pos > 0).map((d) => {
                                return { name: d.name, value: d.pos };
                            })}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            fill="#8884d8"
                            label={renderCustomizedLabel}
                            labelLine={false}
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getColorForTransaction(entry.name, true, colors, setColors)} />
                            ))}
                        </Pie>
                        <Legend content={renderCustomLegend} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "white",
                                borderColor: "#ccc",
                                borderRadius: "5px",
                                color: "black",
                            }}
                            itemStyle={{ color: "black" }}
                            formatter={(value) => `${value}€`}
                        />
                    </PieChart>
                </div>
                <div className="chart">
                    <h3>Gastos</h3>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={pieData.filter((d) => d.neg > 0).map((d) => {
                                return { name: d.name, value: d.neg };
                            })}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            fill="#82ca9d"
                            label={renderCustomizedLabel}
                            labelLine={false}
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getColorForTransaction(entry.name, false, colors, setColors)} />
                            ))}
                        </Pie>
                        <Legend content={renderCustomLegend} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "white",
                                borderColor: "#ccc",
                                borderRadius: "5px",
                                color: "black",
                            }}
                            itemStyle={{ color: "black" }}
                            formatter={(value) => `${value}€`}
                        />
                    </PieChart>
                </div>
            </div>
        </div>
    );
};

export default PieChartCategoryAccount;
