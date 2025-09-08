import React from "react";
import * as XLSX from "xlsx";
import TwoColumnTable from "@/components/admin/TwoColumnTable";
import { getAllChartData } from "@/app/(admin)/admin/excel/utils";
import HorizontalTable from "./HorizontalTable";
import { InceptionPerformanceChart } from "./InceptionPerformanceChart";
import TopHoldingsChart from "./TopHoldingsChart";
import AssetAllocationDonut from "./AssetAllocationDonut";
import EquitiesBreakdownDonut from "./EquitiesBreakdownDonut";
import FixedIncomeBreakdownDonut from "./FixedIncomeBreakdownDonut";

interface PortfolioComponentsPreview {
  workbook: XLSX.WorkBook;
}

const FundData = ({ workbook }: PortfolioComponentsPreview) => {
  const {
    topTenSplit,
    assetAllocation,
    equitiesBreakdown,
    topThreeContributors,
    fixedIncomeBreakdown,
    bottomThreeContributors,
    cumulativePerformance,
    twelveMonthCumulativePerformance,
    cumulativeStrategyPerformance,
  } = getAllChartData(workbook);
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topTenSplit && (
          <div className={"bg-neutral-100 rounded-xl p-4 md:p-6"}>
            <TopHoldingsChart holdings={topTenSplit} />
          </div>
        )}

        {assetAllocation && (
          <div className={"bg-neutral-100 rounded-xl p-4 md:p-6"}>
            <AssetAllocationDonut allocation={assetAllocation} />
          </div>
        )}

        {equitiesBreakdown && (
          <div className={"bg-neutral-100 rounded-xl p-4 md:p-6"}>
            <EquitiesBreakdownDonut
              equitiesBreakdown={equitiesBreakdown}
              assetAllocation={assetAllocation}
            />
          </div>
        )}

        {fixedIncomeBreakdown && (
          <div className={"bg-neutral-100 rounded-xl p-4 md:p-6"}>
            <FixedIncomeBreakdownDonut
              fixedIncomeBreakdown={fixedIncomeBreakdown}
            />
          </div>
        )}
      </div>

      <div className="mt-4">
        {topThreeContributors && <TwoColumnTable data={topThreeContributors} />}
      </div>
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
