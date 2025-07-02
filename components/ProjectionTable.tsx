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
        <CardHeader>
            <CardTitle>Projection Details</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Year</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Total Investment</TableHead>
                        <TableHead>Worst 10%</TableHead>
                        <TableHead>Projection</TableHead>
                        <TableHead>Top 10%</TableHead>
                        <TableHead>Total Return</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projectionData.map((d: any) => (
                        <TableRow key={d.year + '-' + d.age}>
                            <TableCell className="font-medium">{d.year}</TableCell>
                            <TableCell>{d.age}</TableCell>
                            <TableCell>{currencyFormatter(d.totalInvestment)}</TableCell>
                            <TableCell className="text-red-600">{currencyFormatter(d.worstCase)}</TableCell>
                            <TableCell className="font-bold">{currencyFormatter(d.projection)}</TableCell>
                            <TableCell className="text-green-600">{currencyFormatter(d.bestCase)}</TableCell>
                            <TableCell>{currencyFormatter(d.investmentReturn)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);

export default ProjectionTable;
