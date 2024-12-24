import React from 'react';

interface TabSelectorProp {
    activeTab: string,
    setActiveTab: (tabName: string) => void;
}

const TabSelector: React.FC<TabSelectorProp> = ({ activeTab, setActiveTab }: TabSelectorProp) => {
    return (
        <div className="tabs">
            <button
                className={`tab-button ${activeTab === "table" ? "active" : ""}`}
                onClick={() => setActiveTab("table")}
            >
                Movimientos
            </button>
            <button
                className={`tab-button ${activeTab === "chart" ? "active" : ""}`}
                onClick={() => setActiveTab("chart")}
            >
                Ingresos y Gastos en el tiempo
            </button>
            <button
                className={`tab-button ${activeTab === "pie" ? "active" : ""}`}
                onClick={() => setActiveTab("pie")}
            >
                Ingresos y Gastos por categor&iacute;as
            </button>
        </div>
    );
}

export default TabSelector;