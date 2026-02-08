import React, { useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Transaction } from "models/transaction";
import Toggle from "../toggle-switch/Toggle";
import "./pie-charts.css";
import { getColorForTransaction } from "../../utils/color";
import { Props } from "recharts/types/component/DefaultLegendContent";
import { findCategoryByName, isUnderCategory, parentCategory, subCategories } from "../../utils/categories";
import { useTranslation } from '../../i18n';

interface AnalyticsProps {
    transactions: Transaction[];
}

const PieChartCategoryAccount: React.FC<AnalyticsProps> = ({ transactions }: AnalyticsProps) => {
    const { t } = useTranslation();
    const [showByCategory, setShowByCategory] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

    // Filter transactions based on the selected category
    const filteredTransactions = useMemo(() => {
        if (!selectedCategory) {
            return transactions;
        }
        return transactions.filter((tx) => isUnderCategory(findCategoryByName(tx.category), findCategoryByName(selectedCategory)));
    }, [transactions, selectedCategory]);

    // Aggregate data (separately for income and expenses)
    const aggregatedData = useMemo(() => {
        return filteredTransactions.reduce<{ [key: string]: { pos: number; neg: number } }>((acc, tx) => {
            const key = showByCategory
                ? selectedCategory
                    ? tx.category // Show subcategories if a category is selected
                    : parentCategory(findCategoryByName(tx.category)).name // Show main categories otherwise
                : tx.account;

            if (!key) return acc;

            if (!acc[key]) {
                acc[key] = { pos: 0, neg: 0 };
            }

            if (tx.category !== "Internal") {
                if (tx.amount > 0) {
                    acc[key].pos += tx.amount; // Income
                } else {
                    acc[key].neg -= tx.amount; // Expenses (convert to positive)
                }
            }

            return acc;
        }, {});
    }, [filteredTransactions, selectedCategory, showByCategory]);

    const pieData = useMemo(() => {
        return Object.entries(aggregatedData).map(([key, value]) => ({
            name: key,
            pos: parseFloat(value.pos.toFixed(2)),
            neg: parseFloat(value.neg.toFixed(2)),
        }));
    }, [aggregatedData]);

    const total = useMemo(() => {
        return pieData.reduce(
            (acc, data) => {
                acc.pos += data.pos;
                acc.neg += data.neg;
                return acc;
            },
            { pos: 0, neg: 0 }
        );
    }, [pieData]);

    // Handle slice click to drill down into subcategories
    const handleSliceClick = (data: any) => {
        if (selectedCategory) return; // Prevent further drill-down on subcategories
        const clickedCategory = findCategoryByName(data.name);
        if (clickedCategory && subCategories(clickedCategory).length > 0) {
            setSelectedCategory(data.name); // Drill down into the clicked category
        }
    };

    return (
        <div className="analytics-container">
            {/* Back button to reset drill-down */}
            {selectedCategory && (
                <button className="back-to-categories-btn" onClick={() => setSelectedCategory(null)}>{t('table.actions') === 'Actions' ? 'Back to All Categories' : 'Back to All Categories'}</button>
            )}

            {/* Toggle for category/account grouping */}
            <Toggle
                className="analytics-toggle"
                label="siendo agrupadas"
                onToggle={(status: boolean) => setShowByCategory(status)}
                textOff={t('chart.toggle.account')}
                textOn={t('chart.toggle.categories')}
            />

            <div className="pie-charts">
                {/* Income Chart */}
                <div className="chart">
                    <h3>{selectedCategory ? `${selectedCategory} (${t('chart.toggle.positive')})` : `${t('chart.toggle.positive')} (Main Categories)`}</h3>
                    <PieChart width={400} height={700}>
                        <Pie
                            data={pieData.filter((d) => d.pos > 0).map((d) => ({ name: d.name, value: d.pos }))}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            fill="#8884d8"
                            onClick={(data: { name: string }) => handleSliceClick(data)}
                            labelLine={false}
                        >
                            {pieData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={getColorForTransaction(entry.name)}
                                />
                            ))}
                        </Pie>
                        <Legend content={(props: Props) => renderCustomLegend(props)} />
                        <Tooltip formatter={(value) => `${value}€: ${((value as number) * 100 / total.pos).toFixed(2)}%`} />
                    </PieChart>
                </div>

                {/* Expense Chart */}
                <div className="chart">
                    <h3>{selectedCategory ? `${selectedCategory} (${t('chart.toggle.negative')})` : `${t('chart.toggle.negative')} (Main Categories)`}</h3>
                    <PieChart width={400} height={700}>
                        <Pie
                            data={pieData.filter((d) => d.neg > 0).map((d) => ({ name: d.name, value: d.neg }))}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            fill="#82ca9d"
                            onClick={(data: { name: string }) => handleSliceClick(data)}
                            labelLine={false}
                        >
                            {pieData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={getColorForTransaction(entry.name)}
                                />
                            ))}
                        </Pie>
                        <Legend content={(props: Props) => renderCustomLegend(props)} />
                        <Tooltip formatter={(value) => `${value}€: ${((value as number) * 100 / total.neg).toFixed(2)}%`} />
                    </PieChart>
                </div>
            </div>
        </div>
    );
};

export default PieChartCategoryAccount;
