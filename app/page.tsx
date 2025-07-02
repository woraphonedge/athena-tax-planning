"use client";

import InvestmentCalculator from '../components/Chart';

export default function Page() {
  return (
      <main className="bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
              <InvestmentCalculator />
          </div>
      </main>
  );
}
