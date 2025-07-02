import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
        assetClass: 'Equity',
        investmentAmount: 100000,
    });

    const handleAddPosition = () => {
        if (newPosition.symbol && newPosition.investmentAmount > 0) {
            setPositions([...positions, newPosition]);
            // Reset form
            setNewPosition({
                symbol: '',
                expectedReturn: 8,
                assetClass: 'Equity',
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
        <Card>
            <CardHeader>
                <CardTitle>Portfolio Positions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 mb-6">
                    {positions.map((pos, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-muted rounded-lg">
                            <div>
                                <p className="font-bold">{pos.symbol}</p>
                                <p className="text-sm text-muted-foreground">{currencyFormatter(pos.investmentAmount)} @ {pos.expectedReturn}%</p>
                            </div>
                            <Button variant="destructive" size="sm" onClick={() => handleRemovePosition(index)}>Remove</Button>
                        </div>
                    ))}
                    {positions.length === 0 && (
                        <p className="text-muted-foreground text-center py-4">No positions added yet.</p>
                    )}
                </div>

                <div className="space-y-4 border-t pt-4">
                    <h3 className="text-lg font-semibold">Add New Position</h3>
                    <Input name="symbol" value={newPosition.symbol} onChange={handleInputChange} placeholder="Symbol (e.g., VOO)" />
                    <Input name="investmentAmount" type="number" value={newPosition.investmentAmount} onChange={handleInputChange} placeholder="Investment Amount" />
                    <Input name="expectedReturn" type="number" value={newPosition.expectedReturn} onChange={handleInputChange} placeholder="Expected Return (%)" />
                    <Select onValueChange={handleSelectChange} value={newPosition.assetClass}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select asset class" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Equity">Equity</SelectItem>
                            <SelectItem value="Fixed Income">Fixed Income</SelectItem>
                            <SelectItem value="Real Estate">Real Estate</SelectItem>
                            <SelectItem value="Commodities">Commodities</SelectItem>
                            <SelectItem value="Alternatives">Alternatives</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleAddPosition} className="w-full">Add Position</Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default Portfolio;
