import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    age: number;
    setAge: (v: number) => void;
    projectionYears: number;
    setProjectionYears: (v: number) => void;
    percentile: number;
    setPercentile: (v: number) => void;
    investment: number;
    expectedReturn: number;
    volatility: number;
    lumpSumInvestment: number;
    setLumpSumInvestment: (v: number) => void;
}

// --- REUSABLE PARAMETER COMPONENT --- //

const Parameter: React.FC<ParameterProps> = ({ label, value, setValue, min, max, step }) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor={label}>{label}</Label>
        <Input
            id={label}
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
        />
    </div>
);

// --- REUSABLE METRIC DISPLAY COMPONENT --- //

const MetricDisplay: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label>{label}</Label>
        <div className="text-md font-semibold p-1 border-b">{value}</div>
    </div>
);

// --- MAIN PANEL COMPONENT --- //

const ParametersPanel: React.FC<ParametersPanelProps> = (props) => {
    const currencyFormatter = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(value);
    const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

    return (
        <Card className="lg:col-span-1 card-compact">
            <CardHeader>
                <CardTitle>Scenario Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="text-md font-semibold mb-2">Portfolio Metrics</h3>
                    <div className="space-y-2">    
                        <MetricDisplay label="Total Annual Investment" value={currencyFormatter(props.investment)} />
                        <MetricDisplay label="Weighted Expected Return" value={formatPercent(props.expectedReturn)} />
                        <MetricDisplay label="Portfolio Volatility" value={formatPercent(props.volatility)} />
                    </div>
                </div>
                <div>
                    <h3 className="text-md font-semibold mb-2">Projection Settings</h3>
                     <div className="space-y-2">
                        <Parameter label="Lump sum Investment" value={props.lumpSumInvestment} setValue={props.setLumpSumInvestment} min={0} max={10000000} step={100000} />    
                        <Parameter label="Current Age" value={props.age} setValue={props.setAge} min={18} max={70} step={1} />
                        <Parameter label="Projection Years" value={props.projectionYears} setValue={props.setProjectionYears} min={5} max={50} step={1} />
                        <Parameter label="Best/Worst Case Percentile (%)" value={props.percentile} setValue={props.setPercentile} min={1} max={25} step={1} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ParametersPanel;
