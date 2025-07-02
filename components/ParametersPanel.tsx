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

// --- MAIN PANEL COMPONENT --- //

const ParametersPanel: React.FC<ParametersPanelProps> = (props) => {
    return (
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle>Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Parameter label="Current Age" value={props.age} setValue={props.setAge} min={18} max={70} step={1} />
                <Parameter label="Projection Years" value={props.projectionYears} setValue={props.setProjectionYears} min={5} max={50} step={1} />
                <Parameter label="Best/Worst Case Percentile (%)" value={props.percentile} setValue={props.setPercentile} min={1} max={25} step={1} />
            </CardContent>
        </Card>
    );
};

export default ParametersPanel;
