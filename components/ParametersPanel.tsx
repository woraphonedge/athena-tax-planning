import React from 'react';

// --- PROPS INTERFACES --- //

interface ParameterProps {
    label: string;
    value: number;
    setValue: (v: number) => void;
    min: number;
    max: number;
    step: number;
}

interface ParametersPanelProps {
    investment: number;
    setInvestment: (v: number) => void;
    age: number;
    setAge: (v: number) => void;
    projectionYears: number;
    setProjectionYears: (v: number) => void;
    expectedReturn: number;
    setExpectedReturn: (v: number) => void;
    volatility: number;
    setVolatility: (v: number) => void;
    taxBracket: number;
    setTaxBracket: (v: number) => void;
    percentile: number;
    setPercentile: (v: number) => void;
}

// --- REUSABLE PARAMETER COMPONENT --- //

const Parameter: React.FC<ParameterProps> = ({ label, value, setValue, min, max, step }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
        />
    </div>
);

// --- MAIN PANEL COMPONENT --- //

const ParametersPanel: React.FC<ParametersPanelProps> = (props) => {
    return (
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-6 border-b border-gray-200 pb-4 text-gray-800">Parameters</h2>
            <div className="space-y-4">
                <Parameter label="Annual Investment (THB)" value={props.investment} setValue={props.setInvestment} min={10000} max={1000000} step={10000} />
                <Parameter label="Current Age" value={props.age} setValue={props.setAge} min={18} max={70} step={1} />
                <Parameter label="Projection Years" value={props.projectionYears} setValue={props.setProjectionYears} min={5} max={50} step={1} />
                <Parameter label="Expected Annual Return (%)" value={props.expectedReturn} setValue={props.setExpectedReturn} min={1} max={20} step={0.5} />
                <Parameter label="Annual Volatility (%)" value={props.volatility} setValue={props.setVolatility} min={1} max={30} step={0.5} />
                <Parameter label="Average Tax Bracket (%)" value={props.taxBracket} setValue={props.setTaxBracket} min={0} max={35} step={1} />
                <Parameter label="Best/Worst Case Percentile (%)" value={props.percentile} setValue={props.setPercentile} min={1} max={25} step={1} />
            </div>
        </div>
    );
};

export default ParametersPanel;
