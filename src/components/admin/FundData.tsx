import React from "react";
import * as XLSX from "xlsx";
import TwoColumnTable from "@/components/admin/TwoColumnTable";
import { getAllChartData } from "@/app/(admin)/admin/excel/utils";
import HorizontalTable, { HorizontalTableRows } from "./HorizontalTable";
import { InceptionPerformanceChart } from "./InceptionPerformanceChart";

interface PortfolioComponentsPreview {
  workbook: XLSX.WorkBook;
}

const FundData = ({ workbook }: PortfolioComponentsPreview) => {
  const {
    topThreeContributors,
    bottomThreeContributors,
    cumulativePerformance,
    twelveMonthCumulativePerformance,
    cumulativeStrategyPerformance,
    monthlyPerformance,
  } = getAllChartData(workbook);
  return (
    <div>
      <section>
        <div className="mt-4">
          {topThreeContributors && (
            <TwoColumnTable data={topThreeContributors} />
          )}
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
        <div className="mt-4">
          <HorizontalTableRows
            data={monthlyPerformance.data}
            headerText={monthlyPerformance.headerCellValue}
          />
        </div>
      </section>
    </div>
  );
};

export default FundData;
