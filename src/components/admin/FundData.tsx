import React from "react";
import * as XLSX from "xlsx";
import TwoColumnTable from "@/components/admin/TwoColumnTable";
import { getAllChartData } from "@/app/(admin)/admin/excel/utils";
import HorizontalTable from "./HorizontalTable";
import { InceptionPerformanceChart } from "./InceptionPerformanceChart";
import TopHoldingsChart from "./TopHoldingsChart";

interface PortfolioComponentsPreview {
  workbook: XLSX.WorkBook;
}

const FundData = ({ workbook }: PortfolioComponentsPreview) => {
  const {
    topTenSplit,
    topThreeContributors,
    bottomThreeContributors,
    cumulativePerformance,
    twelveMonthCumulativePerformance,
    cumulativeStrategyPerformance,
  } = getAllChartData(workbook);
  return (
    <div>
      {topTenSplit?.length ? <TopHoldingsChart holdings={topTenSplit} /> : null}
      <div className="mt-4">
        {topThreeContributors && <TwoColumnTable data={topThreeContributors} />}
      </div>
      <div className="mt-4">
        {bottomThreeContributors && (
          <TwoColumnTable data={bottomThreeContributors} />
        )}
      </div>
      <div className="mt-4">
        {cumulativePerformance && (
          <HorizontalTable data={cumulativePerformance} />
        )}
      </div>
      <div className="mt-4">
        {twelveMonthCumulativePerformance && (
          <HorizontalTable data={twelveMonthCumulativePerformance} />
        )}
      </div>
      <div className="mt-4">
        <InceptionPerformanceChart data={cumulativeStrategyPerformance} />
      </div>
    </div>
  );
};

export default FundData;
