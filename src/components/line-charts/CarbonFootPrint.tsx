import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import './transaction-chart.css'
import { Transaction } from "../../models/transaction";
import { categories, Category } from "../../models/categories";

interface Props {
    transactions: Transaction[];
}

interface Data { month: string; carbon: number; }

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

    const emissionsBySubcategories = (category: Category, ammount: number) => { 
        if (category.subcategories) {
            return category.subcategories.reduce((totalEmission, sub) => {
                const subProportion = sub.proportion || 0; // Default to 0 if no proportion is specified
                if (sub.emissionFactor) {
                    const subEmissionFactor = sub.emissionFactor || 0; // Default to 0 if no emission factor
                    return totalEmission + ammount * subProportion * subEmissionFactor;
                } else {
                    return totalEmission + ammount * subProportion * emissionsBySubcategories(sub, ammount);
                }
            }, 0);
        }
    }

    const emissionCategory = (category: Category, ammount: number): number => {
        if (category.emissionFactor){
            return category.emissionFactor * ammount;
        } else {
            return emissionsBySubcategories(category, ammount);
        }
    }

    const findCategoryByName = (categoryName: string, categories: Category[]): Category | null => {
        for (const category of categories) {
          if (category.name === categoryName) {
            return category;
          }
      
          if (category.subcategories) {
            const foundCategory = findCategoryByName(categoryName, category.subcategories);
            if (foundCategory) {
              return foundCategory;
            }
          }
        }
        return null; // Not found
      };

    const emission = (tx: Transaction): number => {
        let cat = findCategoryByName(tx.category, categories);
        if (cat === null) {
            cat = findCategoryByName("Others", findCategoryByName("Miscellaneous", categories).subcategories);
        }
        return emissionCategory(cat, -tx.amount);
    }

    const monthlyData: { [key: string]: Data } = transactions.reduce<Record<string, Data>>(
        (acc: { [key: string]: Data }, tx: Transaction) => {
            const date = new Date(tx.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`; // e.g., "2023-12"
            const monthLabel = date.toLocaleString("default", { month: "short", year: "numeric" }); // e.g., "Dec 2023"

            if (!acc[monthKey]) {
                acc[monthKey] = { month: monthLabel, carbon: 0, };
            }

            if (tx.amount < 0) {
                acc[monthKey].carbon += emission(tx);
            }

            return acc;
        },
        {}
    );

    const chartData: { month: string, carbon: number }[] = Object.values(monthlyData)
        .map((data: Data) => ({
            month: data.month,
            carbon: parseFloat(data.carbon.toFixed(2)),
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
            <ResponsiveContainer>
                <LineChart data={chartData}>
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value: number) => `${value.toFixed(2)}kg CO2`} width={100} />
                    <Tooltip formatter={(value: number) => `${value.toFixed(2)}kg CO2`} />
                    <Line dataKey="carbon" type="monotone" fill="#000000" name="Carbon" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TransactionChart;
