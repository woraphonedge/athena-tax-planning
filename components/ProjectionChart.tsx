import React from 'react';
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, Bar, Area } from 'recharts';

interface ProjectionChartProps {
    projectionData: any[];
    currencyFormatter: (value: number) => string;
    compactNumberFormatter: (value: number) => string;
}

const ProjectionChart: React.FC<ProjectionChartProps> = ({ projectionData, currencyFormatter, compactNumberFormatter }) => (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-200 h-[500px]" style={{ minWidth: 600 }}>
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Portfolio Projection</h3>
        <ComposedChart
            width={600}
            height={450}
            data={projectionData}
            margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
        >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
            <YAxis tickFormatter={compactNumberFormatter} label={{ value: 'THB', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value: number) => currencyFormatter(value)} labelFormatter={(label) => `Year: ${label}`} />
            <Legend />
            <Area type="monotone" dataKey="projection" fill="#db2777" stroke="#db2777" name="Projected Value" fillOpacity={0.8} />
            <Area type="monotone" dataKey="totalInvestment" fill="#6366f1" stroke="#6366f1" name="Total Investment" fillOpacity={0.8} />
            <Line type="monotone" dataKey="bestCase" stroke="#34d399" strokeWidth={2} dot={false} strokeDasharray="4 4" name="Best Case" />
            <Line type="monotone" dataKey="worstCase" stroke="#f87171" strokeWidth={2} dot={false} strokeDasharray="4 4" name="Worst Case" />
            <Bar dataKey="investment" barSize={20} fill="#34d399" name="Investment" />
            <Line type="monotone" dataKey="cumulativeTaxSaved" stroke="#fbbf24" strokeWidth={2} dot={false} name="Cumulative Tax Saved" />
        </ComposedChart>
    </div>
);

export default ProjectionChart;
