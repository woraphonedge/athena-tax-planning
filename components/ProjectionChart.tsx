import React, { useState } from 'react';
import { ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, Bar, Area } from 'recharts';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ProjectionChartProps {
    projectionData: any[];
    currencyFormatter: (value: number) => string;
    compactNumberFormatter: (value: number) => string;
}

const ProjectionChart: React.FC<ProjectionChartProps> = ({ projectionData, currencyFormatter, compactNumberFormatter }) => {
    const [isAge, setIsAge] = useState(false);
    const xAxisKey = isAge ? 'age' : 'year';

    return (
        <div>
            <div className="flex justify-end items-center space-x-2 mb-4">
                <Label htmlFor="axis-switch" className={!isAge ? 'font-semibold' : 'text-muted-foreground'}>Year</Label>
                <Switch
                    id="axis-switch"
                    checked={isAge}
                    onCheckedChange={setIsAge}
                />
                <Label htmlFor="axis-switch" className={isAge ? 'font-semibold' : 'text-muted-foreground'}>Age</Label>
            </div>
            <ComposedChart
                width={600}
                height={450}
                data={projectionData}
                margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey={xAxisKey} label={{ value: xAxisKey === 'year' ? 'Year' : 'Age', position: 'insideBottom', offset: -5 }} />
                <YAxis tickFormatter={compactNumberFormatter} label={{ value: 'THB', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value: number) => currencyFormatter(value)} labelFormatter={(label) => `${xAxisKey === 'year' ? 'Year' : 'Age'}: ${label}`} />
                <Legend />
                <Area type="monotone" dataKey="projection" fill="#db2777" stroke="#db2777" name="Projected Value" fillOpacity={0.8} />
                <Area type="monotone" dataKey="totalInvestment" fill="#6366f1" stroke="#6366f1" name="Total Investment" fillOpacity={0.8} />
                <Line type="monotone" dataKey="bestCase" stroke="#34d399" strokeWidth={2} dot={false} strokeDasharray="4 4" name="Best Case" />
                <Line type="monotone" dataKey="worstCase" stroke="#f87171" strokeWidth={2} dot={false} strokeDasharray="4 4" name="Worst Case" />
                <Bar dataKey="investment" barSize={20} fill="#34d399" name="Investment" />
            </ComposedChart>
        </div>
    );
};

export default ProjectionChart;
