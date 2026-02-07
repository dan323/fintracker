import React, { useMemo, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
    PieChart,
    Pie,
    Cell
} from "recharts";
import './carbon-footprint.css'
import { Transaction } from "../../models/transaction";
import { CarbonCalculator } from "../../utils/carbon-calculator";
import { useTranslation } from '../../i18n';

interface Props {
    transactions: Transaction[];
}

const CarbonFootPrint: React.FC<Props> = ({ transactions }) => {
    const { t } = useTranslation();
    const [view, setView] = useState<'timeline' | 'breakdown'>('timeline');
    
    const analysis = useMemo(() => {
        return CarbonCalculator.analyzeFootprint(transactions);
    }, [transactions]);

    const monthlyData = useMemo(() => {
        const monthlyEmissions: Record<string, { month: string; carbon: number; monthKey: string }> = {};
        
        transactions.forEach(tx => {
            if (!tx.date || !(tx.date instanceof Date) || tx.amount >= 0) return;
            
            const date = new Date(tx.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthLabel = date.toLocaleDateString('es-ES', { 
                month: 'short', 
                year: 'numeric' 
            }).replace('.', '');

            if (!monthlyEmissions[monthKey]) {
                monthlyEmissions[monthKey] = { month: monthLabel, carbon: 0, monthKey };
            }

            monthlyEmissions[monthKey].carbon += CarbonCalculator.calculateTransactionEmission(tx);
        });

        return Object.values(monthlyEmissions)
            .map(data => ({
                ...data,
                carbon: Number(data.carbon.toFixed(2))
            }))
            .sort((a, b) => a.monthKey.localeCompare(b.monthKey));
    }, [transactions]);

    const pieColors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e'];

    return (
        <div className="carbon-footprint-container">
            {/* Stats Cards */}
            <div className="carbon-stats">
                <div className="stat-card">
                    <h3>{t('carbon.total')}</h3>
                    <p>{analysis.totalEmissions.toFixed(2)} kg</p>
                </div>
                <div className="stat-card">
                    <h3>{t('carbon.monthly')}</h3>
                    <p>{analysis.monthlyAverage.toFixed(2)} kg</p>
                </div>
                <div className="stat-card">
                    <h3>{t('carbon.topCategory')}</h3>
                    <p>{analysis.breakdown[0]?.category || 'N/A'}</p>
                </div>
            </div>

            {/* View Toggle */}
            <div className="view-toggle">
                <button 
                    className={view === 'timeline' ? 'active' : ''} 
                    onClick={() => setView('timeline')}
                >
                    {t('carbon.timeline')}
                </button>
                <button 
                    className={view === 'breakdown' ? 'active' : ''} 
                    onClick={() => setView('breakdown')}
                >
                    {t('carbon.byCategory')}
                </button>
            </div>

            {/* Charts */}
            {view === 'timeline' ? (
                <div className="chart-container">
                    <h2>{t('carbon.monthlyEmissions')}</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tickFormatter={(value: number) => `${value} kg`} width={80} />
                            <Tooltip 
                                formatter={(value: number) => [`${value.toFixed(2)} kg CO₂e`, t('carbon.total')]}
                                labelFormatter={(label) => `${t('filter.start')} ${label}`}
                            />
                            <Legend />
                            <Line 
                                dataKey="carbon" 
                                type="monotone" 
                                stroke="#e74c3c" 
                                strokeWidth={3}
                                name={t('carbon.total')}
                                dot={{ fill: '#e74c3c', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="chart-container">
                    <h2>{t('carbon.byCategoryTitle')}</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={analysis.breakdown.slice(0, 7)} // Top 7 categories
                                dataKey="emissions"
                                nameKey="category"
                                cx="50%"
                                cy="50%"
                                outerRadius={150}
                                fill="#8884d8"
                                label={({ category, percentage }) => `${category}: ${percentage.toFixed(1)}%`}
                            >
                                {analysis.breakdown.slice(0, 7).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => `${value.toFixed(2)} kg CO₂e`} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Recommendations */}
            <div className="recommendations">
                <h3>{t('carbon.recommendations')}</h3>
                <ul>
                    {analysis.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CarbonFootPrint;

