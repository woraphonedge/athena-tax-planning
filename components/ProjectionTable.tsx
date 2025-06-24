import React from 'react';

interface ProjectionTableProps {
    projectionData: any[];
    currencyFormatter: (value: number) => string;
}

const ProjectionTable: React.FC<ProjectionTableProps> = ({ projectionData, currencyFormatter }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <h3 className="text-xl font-semibold text-slate-900 p-6">Projection Details</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                    <tr>
                        <th scope="col" className="px-6 py-3">Year</th>
                        <th scope="col" className="px-6 py-3">Age</th>
                        <th scope="col" className="px-6 py-3">Total Investment</th>
                        <th scope="col" className="px-6 py-3">Worst 10%</th>
                        <th scope="col" className="px-6 py-3">Projection with Tax Saved</th>
                        <th scope="col" className="px-6 py-3">Top 10%</th>
                        <th scope="col" className="px-6 py-3">Tax Saved</th>
                        <th scope="col" className="px-6 py-3">Cumulative Tax Saved</th>
                        <th scope="col" className="px-6 py-3">Total Return</th>
                    </tr>
                </thead>
                <tbody>
                    {projectionData.map((d: any) => (
                        <tr key={d.year + '-' + d.age} className="bg-white border-b hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-900">{d.year}</td>
                            <td className="px-6 py-4">{d.age}</td>
                            <td className="px-6 py-4">{currencyFormatter(d.totalInvestment)}</td>
                            <td className="px-6 py-4 text-red-600">{currencyFormatter(d.worstCase)}</td>
                            <td className="px-6 py-4 font-bold text-slate-800">{currencyFormatter(d.projection)}</td>
                            <td className="px-6 py-4 text-green-600">{currencyFormatter(d.bestCase)}</td>
                            <td className="px-6 py-4">{currencyFormatter(d.taxSaved)}</td>
                            <td className="px-6 py-4">{currencyFormatter(d.cumulativeTaxSaved)}</td>
                            <td className="px-6 py-4">{currencyFormatter(d.investmentReturn)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default ProjectionTable;
