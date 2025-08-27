import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectionTableProps {
    projectionData: any[];
    currencyFormatter: (value: number) => string;
}

const ProjectionTable: React.FC<ProjectionTableProps> = ({ projectionData, currencyFormatter }) => (
    <Card>
        <CardHeader className="py-2">
            <CardTitle className="text-sm">Projection Details</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
            <Table className="text-xs">
                <TableHeader>
                    <TableRow className="h-5">
                        <TableHead className="px-2 py-1 text-right">Year</TableHead>
                        <TableHead className="px-2 py-1 text-right">Age</TableHead>
                        <TableHead className="px-2 py-1 text-right">Total Investment</TableHead>
                        <TableHead className="px-2 py-1 text-right">Worst 10%</TableHead>
                        <TableHead className="px-2 py-1 text-right">Projection</TableHead>
                        <TableHead className="px-2 py-1 text-right">Top 10%</TableHead>
                        <TableHead className="px-2 py-1 text-right">Total Return</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projectionData.map((d: any) => (
                        <TableRow key={d.year + '-' + d.age} className="h-5 even:bg-gray-200 dark:even:bg-gray-800/30">
                            <TableCell className="font-medium px-2 py-1 text-right">{d.year}</TableCell>
                            <TableCell className="px-2 py-1 text-right">{d.age}</TableCell>
                            <TableCell className="px-2 py-1 font-mono tabular-nums text-right">{currencyFormatter(d.totalInvestment)}</TableCell>
                            <TableCell className="text-red-600 px-2 py-1 font-mono tabular-nums text-right">{currencyFormatter(d.worstCase)}</TableCell>
                            <TableCell className="font-bold px-2 py-1 font-mono tabular-nums text-right">{currencyFormatter(d.projection)}</TableCell>
                            <TableCell className="text-green-600 px-2 py-1 font-mono tabular-nums text-right">{currencyFormatter(d.bestCase)}</TableCell>
                            <TableCell className="px-2 py-1 font-mono tabular-nums text-right">{currencyFormatter(d.investmentReturn)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);

export default ProjectionTable;
