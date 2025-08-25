import React from "react";
import * as XLSX from "xlsx";
import TwoColumnTable from "@/components/admin/TwoColumnTable";
import { getAllChartData } from "@/app/(admin)/admin/excel/utils";
import HorizontalTable from "./HorizontalTable";

interface PortfolioComponentsPreview {
  workbook: XLSX.WorkBook;
}

const FundData = ({ workbook }: PortfolioComponentsPreview) => {
  const {
    topThreeContributors,
    bottomThreeContributors,
    cumulativePerformance,
    twelveMonthCumulativePerformance,
  } = getAllChartData(workbook);
  return (
    <div>
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
    </div>
  );
};

export default FundData;
