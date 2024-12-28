import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Transaction } from "../../models/transaction";
import Toggle from "../toggle-switch/Toggle";
import "./pie-charts.css";
import { getColorForTransaction } from "../../utils/color";
import { Props } from "recharts/types/component/DefaultLegendContent";
import { Categories, categories, Category } from "../../models/categories";

interface AnalyticsProps {
    transactions: Transaction[];
}

const PieChartCategoryAccount: React.FC<AnalyticsProps> = ({ transactions }: AnalyticsProps) => {
    const [showByCategory, setShowByCategory] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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

    const parentCategory = (cat: string, cats: Categories, parent: string | null): string | null => {
        for (const category of Object.keys(cats)) {
            if (category === cat) {
                return parent ? parent : cat;
            } else if (cats[category].subcategories) {
                const found = parentCategory(cat, cats[category].subcategories, parent ? parent : category);
                if (found) {
                    return found;
                }
            }
        }
        return null;
    };

    const isUnderCategory = (cat: string, selected: string): boolean => {
        if (cat === selected) {
            return true;
        } else {
            const parent = parentCategory(selected, categories, null);
            let parentCat: Category = categories[parent];
            while (parentCat.name !== selected && parentCat.subcategories) {
                const subCats = parentCat.subcategories;
                parentCat = subCats[parentCategory(selected, subCats, null)];
            }
            return parentCategory(cat, parentCat.subcategories, null) !== null
        }
    }

    // Filter transactions based on the selected category
    const filteredTransactions = selectedCategory
        ? transactions.filter((tx) => isUnderCategory(tx.category, selectedCategory))
        : transactions;

    // Aggregate data (separately for income and expenses)
    const aggregatedData = filteredTransactions.reduce<{ [key: string]: { pos: number; neg: number } }>((acc, tx) => {
        const key = showByCategory ? (selectedCategory
            ? tx.category // Show subcategories if a category is selected
            : parentCategory(tx.category, categories, null)) // Show main categories otherwise
            : tx.account;

        if (!key) return acc;

        if (!acc[key]) {
            acc[key] = { pos: 0, neg: 0 };
        }

        if (tx.category !== 'Internal') {
            if (tx.amount > 0) {
                acc[key].pos += tx.amount; // Income
            } else {
                acc[key].neg -= tx.amount; // Expenses (convert to positive)
            }
        }

        return acc;
    }, {});

    const pieData = Object.entries(aggregatedData).map(([key, value]) => ({
        name: key,
        pos: parseFloat(value.pos.toFixed(2)),
        neg: parseFloat(value.neg.toFixed(2)),
    }));

    // Handle slice clicks for drill-down
    const handleSliceClick = (data: { name: string }) => {
        const isParentCategory = Object.keys(categories).some((cat) => cat === data.name);
        if (isParentCategory) {
            setSelectedCategory(data.name);
        }
    };

    return (
        <div className="analytics-container">
            {/* Back button to reset drill-down */}
            {selectedCategory && (
                <button onClick={() => setSelectedCategory(null)}>Back to All Categories</button>
            )}

            {/* Toggle for category/account grouping */}
            <Toggle
                className="analytics-toggle"
                label="siendo agrupadas"
                onToggle={(status: boolean) => setShowByCategory(status)}
                textOff="Cuentas"
                textOn="Categorías"
            />

            <div className="pie-charts">
                {/* Income Chart */}
                <div className="chart">
                    <h3>{selectedCategory ? `${selectedCategory} (Ingresos)` : "Ingresos (Main Categories)"}</h3>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={pieData.filter((d) => d.pos > 0).map((d) => ({ name: d.name, value: d.pos }))}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            fill="#8884d8"
                            onClick={(data) => handleSliceClick(data)}
                            labelLine={false}
                            label={renderCustomizedLabel}
                        >
                            {pieData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={getColorForTransaction(entry.name, true, colors, setColors)}
                                />
                            ))}
                        </Pie>
                        <Legend content={(props: Props) => renderCustomLegend(props)} />
                        <Tooltip formatter={(value) => `${value}€`} />
                    </PieChart>
                </div>

                {/* Expense Chart */}
                <div className="chart">
                    <h3>{selectedCategory ? `${selectedCategory} (Gastos)` : "Gastos (Main Categories)"}</h3>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={pieData.filter((d) => d.neg > 0).map((d) => ({ name: d.name, value: d.neg }))}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            fill="#82ca9d"
                            onClick={(data) => handleSliceClick(data)}
                            labelLine={false}
                            label={renderCustomizedLabel}
                        >
                            {pieData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={getColorForTransaction(entry.name, false, colors, setColors)}
                                />
                            ))}
                        </Pie>
                        <Legend content={(props: Props) => renderCustomLegend(props)} />
                        <Tooltip formatter={(value) => `${value}€`} />
                    </PieChart>
                </div>
            </div>
        </div>
    );
};

export default PieChartCategoryAccount;
