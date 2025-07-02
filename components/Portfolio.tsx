import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface Position {
    symbol: string;
    expectedReturn: number; // as a percentage, e.g., 8 for 8%
    assetClass: string;
    investmentAmount: number;
}

interface PortfolioProps {
    positions: Position[];
    setPositions: (positions: Position[]) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ positions, setPositions }) => {
    const [newPosition, setNewPosition] = useState<Omit<Position, 'id'>>({
        symbol: '',
        expectedReturn: 8,
        assetClass: 'Global Equity',
        investmentAmount: 100000,
    });

    const handleAddPosition = () => {
        if (newPosition.symbol && newPosition.investmentAmount > 0) {
            setPositions([...positions, newPosition]);
            // Reset form
            setNewPosition({
                symbol: '',
                expectedReturn: 8,
                assetClass: 'Global Equity',
                investmentAmount: 100000,
            });
        }
    };

    const handleRemovePosition = (index: number) => {
        const updatedPositions = positions.filter((_, i) => i !== index);
        setPositions(updatedPositions);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewPosition(prev => ({ ...prev, [name]: name === 'symbol' ? value : Number(value) }));
    };

    const handleSelectChange = (value: string) => {
        setNewPosition(prev => ({ ...prev, assetClass: value }));
    };

    const currencyFormatter = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(value);

    return (
        <Card className="card-compact">
            <CardHeader>
                <CardTitle>Portfolio Positions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4 rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-medium p-2">Symbol</TableHead>
                                <TableHead className="p-2">Asset Class</TableHead>
                                <TableHead className="text-right p-2">Amount</TableHead>
                                <TableHead className="text-right p-2">Exp. Return</TableHead>
                                <TableHead className="text-right p-2">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {positions.length > 0 ? (
                                positions.map((pos, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium p-2">{pos.symbol || '-'}</TableCell>
                                        <TableCell className="p-2">{pos.assetClass}</TableCell>
                                        <TableCell className="text-right p-2">{currencyFormatter(pos.investmentAmount)}</TableCell>
                                        <TableCell className="text-right p-2">{pos.expectedReturn}%</TableCell>
                                        <TableCell className="text-right p-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleRemovePosition(index)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No positions added yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="border-t pt-4">
                    <h3 className="text-md font-semibold mb-2">Add New Position</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="space-y-2">
                            <Label htmlFor="symbol">Symbol</Label>
                            <Input id="symbol" name="symbol" value={newPosition.symbol} onChange={handleInputChange} placeholder="e.g., VOO" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="assetClass">Asset Class</Label>
                            <Select onValueChange={handleSelectChange} value={newPosition.assetClass}>
                                <SelectTrigger id="assetClass">
                                    <SelectValue placeholder="Select asset class" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Cash">Cash</SelectItem>
                                    <SelectItem value="Fixed Income">Fixed Income</SelectItem>
                                    <SelectItem value="Local Equity">Local Equity</SelectItem>
                                    <SelectItem value="Global Equity">Global Equity</SelectItem>
                                    <SelectItem value="Alternative">Alternative</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="investmentAmount">Investment Amount</Label>
                            <Input id="investmentAmount" name="investmentAmount" type="number" value={newPosition.investmentAmount} onChange={handleInputChange} placeholder="e.g., 100000" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="expectedReturn">Expected Return (%)</Label>
                            <Input id="expectedReturn" name="expectedReturn" type="number" value={newPosition.expectedReturn} onChange={handleInputChange} placeholder="e.g., 8" />
                        </div>
                    </div>
                    <Button onClick={handleAddPosition} className="w-full mt-4">Add Position</Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default Portfolio;
