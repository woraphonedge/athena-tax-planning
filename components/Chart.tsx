'use client';
import React, { useState, useMemo } from 'react';
import ParametersPanel from './ParametersPanel';
import ProjectionChart from './ProjectionChart';
import ProjectionTable from './ProjectionTable';
import jStat from 'jstat';

// --- TYPE DEFINITIONS --- //

/**
 * Input parameters for the investment projection calculation.
 */
interface ProjectionInput {
    investment: number;       // Annual mutual fund investment amount in THB
    age: number;              // Current age of the user
    projectionYears: number;  // Number of years to project into the future
    expectedReturn: number;   // Annual expected return (e.g., 0.06 for 6%)
    volatility: number;       // Annual volatility (e.g., 0.10 for 10%)
    percentile: number;       // Percentile for best/worst case (e.g., 10 for 10th/90th)
}

/**
 * The calculated data structure for a single year of the projection.
 */
interface YearlyData {
    year: number;
    age: number;
    investment: number;         // Investment for this specific year
    totalInvestment: number;    // Accumulated investment up to this year
    projection: number;         // The median projected portfolio value
    worstCase: number;          // The worst case projection for this year
    bestCase: number;           // The best case projection for this year
    investmentReturn: number;   // Total return, including capital gains
}

/**
 * Summary statistics for the entire projection period.
 */
interface ProjectionSummary {
    committedAnnualInvestment: number;
    baseCAGR: number;
    lastYearInvestmentValue: number;
}

/**
 * The combined output of the calculation, including yearly data and summary metrics.
 */
interface ProjectionOutput {
    yearlyData: YearlyData[];
    summary: ProjectionSummary;
}


// --- CORE CALCULATION LOGIC --- //

/**
 * Calculates investment projections based on user inputs.
 * This function is pure and has no side effects.
 *
 * @param {ProjectionInput} params - The input parameters for the calculation.
 * @returns {ProjectionOutput} An object containing both the detailed yearly data and summary metrics.
 */
const calculateInvestmentProjection = (params: ProjectionInput): ProjectionOutput => {
    const {
        investment,
        age,
        projectionYears,
        expectedReturn,
        volatility,
        percentile,
    } = params;

    const results: YearlyData[] = [];
    let cumulativeInvestment = 0;

    // This helper function implements the closed-form lognormal approximation.
    const getLognormalDistributionParams = (C: number, N: number, mu: number, sigma: number) => {
        if (N === 0 || C === 0) return { E: C, mu_w: Math.log(C || 1), sigma_w: 0 };

        const m = 1 + mu;
        const A = m ** 2 + sigma ** 2;

        // Mean of W (Future Value of an Ordinary Annuity)
        const E = mu === 0 ? C * N : C * (Math.pow(m, N) - 1) / mu;

        // Second moment of W
        const S = (Math.pow(A, N) - 1) / (A - 1);
        let T = 0;
        for (let p = 1; p < N; p++) {
            T += Math.pow(m, p) * ((Math.pow(A, N - p) - 1) / (A - 1));
        }
        const second_moment = C ** 2 * (S + 2 * T);

        // Variance of W
        let V = second_moment - E ** 2;
        if (V < 0) V = 0; // Clamp due to potential floating point inaccuracies

        // Lognormal approximation parameters
        const sigma_w2 = Math.log(1 + V / E ** 2);
        const logSigma = Math.sqrt(sigma_w2);
        const logMu = Math.log(E) - 0.5 * sigma_w2;

        return { logMu, logSigma };
    };

    for (let year = 1; year <= projectionYears; year++) {
        let projectionValue, worstValue, topValue, totalReturn;

        if (year === 1) {
            // Year 1: Initial investment, no returns yet
            projectionValue = investment;
            worstValue = investment;
            topValue = investment;
            totalReturn = 0;
        } else {
            // Subsequent years: Apply returns to previous year's projection
            const prevYearProjection = results[year - 2].projection;
            projectionValue = prevYearProjection * (1 + expectedReturn) + investment;
        }
        
        cumulativeInvestment += investment;

        const { logMu, logSigma } = getLognormalDistributionParams(investment, year, expectedReturn, volatility);
        const topZ = jStat.normal.inv((100 - percentile) / 100, 0, 1)
        const worstZ = jStat.normal.inv(percentile / 100, 0, 1)
        topValue = Math.exp(logMu + topZ * logSigma);
        worstValue = Math.exp(logMu + worstZ * logSigma);
        totalReturn = projectionValue - cumulativeInvestment;

        results.push({
            year: year,
            age: age + year,
            investment: investment,
            totalInvestment: cumulativeInvestment,
            projection: projectionValue,
            worstCase: worstValue < 0 ? 0 : worstValue,
            bestCase: topValue,
            investmentReturn: totalReturn
        });
    }

    // --- SUMMARY CALCULATION --- //
    if (results.length === 0) {
        const emptySummary: ProjectionSummary = {
            committedAnnualInvestment: params.investment,
            baseCAGR: 0,
            lastYearInvestmentValue: 0,
        };
        return { yearlyData: [], summary: emptySummary };
    }

    const lastYear = results[results.length - 1];

    const summary: ProjectionSummary = {
        committedAnnualInvestment: params.investment,
        baseCAGR: params.expectedReturn,
        lastYearInvestmentValue: lastYear.projection,
    };

    return { yearlyData: results, summary };
};

// --- SUMMARY COMPONENT --- //
const SummaryMetrics: React.FC<{ summary: ProjectionSummary; currencyFormatter: (v: number) => string }> = ({ summary, currencyFormatter }) => {
    const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

    const metrics = [
        { label: "Annual Investment", value: currencyFormatter(summary.committedAnnualInvestment) },
        { label: "Median CAGR", value: formatPercent(summary.baseCAGR) },
        { label: "Final Value (Median)", value: currencyFormatter(summary.lastYearInvestmentValue) },
    ];

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Projection Summary</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {metrics.map(({ label, value }) => (
                    <div key={label} className="bg-slate-50 p-4 rounded-lg text-center shadow-sm">
                        <p className="text-sm text-slate-500 font-medium truncate">{label}</p>
                        <p className="text-xl font-semibold text-slate-900 mt-1">{value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- REACT COMPONENT --- //

const App: React.FC = () => {
    // --- STATE MANAGEMENT --- //
    const [investment, setInvestment] = useState(300000);
    const [age, setAge] = useState(35);
    const [projectionYears, setProjectionYears] = useState(25);
    const [expectedReturn, setExpectedReturn] = useState(6); // in percent
    const [volatility, setVolatility] = useState(10); // in percent
    const [percentile, setPercentile] = useState(10); // e.g., 10 for 10th/90th percentile

    // --- MEMOIZED CALCULATION --- //
    // useMemo ensures the heavy calculation only runs when inputs change.
    const { yearlyData, summary } = useMemo(() => {
        return calculateInvestmentProjection({
            investment,
            age,
            projectionYears,
            expectedReturn: expectedReturn / 100,
            volatility: volatility / 100,
            percentile: percentile,
        });
    }, [investment, age, projectionYears, expectedReturn, volatility, percentile]);

    // --- UI RENDERING --- //
    const currencyFormatter = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(value);
    const compactNumberFormatter = (value: number) => {
        if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
        if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`;
        return value.toString();
    };


    return (
        <div className="max-w-7xl mx-auto">

                {/* Header */}
                <header className="pb-8 mb-8 border-b border-gray-200">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Investment Projection Calculator</h1>
                    <p className="mt-4 text-xl text-gray-500">Visualize your mutual fund growth and returns over time.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <ParametersPanel
                        investment={investment}
                        setInvestment={setInvestment}
                        age={age}
                        setAge={setAge}
                        projectionYears={projectionYears}
                        setProjectionYears={setProjectionYears}
                        expectedReturn={expectedReturn}
                        setExpectedReturn={setExpectedReturn}
                        volatility={volatility}
                        setVolatility={setVolatility}
                        percentile={percentile}
                        setPercentile={setPercentile}
                    />
                    <div className="lg:col-span-2 space-y-8">
                        <SummaryMetrics summary={summary} currencyFormatter={currencyFormatter} />
                        <ProjectionChart
                            projectionData={yearlyData}
                            currencyFormatter={currencyFormatter}
                            compactNumberFormatter={compactNumberFormatter}
                        />
                        <ProjectionTable
                            projectionData={yearlyData}
                            currencyFormatter={currencyFormatter}
                        />
                    </div>
                </div>
            </div>
    );
};

export default App;
