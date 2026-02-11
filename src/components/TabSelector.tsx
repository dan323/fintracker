import React from 'react';
import "./tabs.css"
import { useTranslation } from '../i18n';

interface TabSelectorProp {
    activeTab: string,
    setActiveTab: (tabName: string) => void;
}

const TabSelector: React.FC<TabSelectorProp> = ({ activeTab, setActiveTab }: TabSelectorProp) => {
    const { t } = useTranslation();
    return (
        <div className="tabs">
            <button
                className={`tab-button ${activeTab === "table" ? "active" : ""}`}
                onClick={() => setActiveTab("table")}
            >
                {t('tab.movements')}
            </button>
            <button
                className={`tab-button ${activeTab === "chart" ? "active" : ""}`}
                onClick={() => setActiveTab("chart")}
            >
                {t('tab.chart')}
            </button>
            <button
                className={`tab-button ${activeTab === "pie" ? "active" : ""}`}
                onClick={() => setActiveTab("pie")}
            >
                {t('tab.pie')}
            </button>
            <button
                className={`tab-button ${activeTab === "carbon" ? "active" : ""}`}
                onClick={() => setActiveTab("carbon")}
            >
                {t('tab.carbon')}
            </button>
        </div>
    );
}

export default TabSelector;