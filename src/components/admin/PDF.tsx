import TwoColumnTable from "./TwoColumnTable";
import TopHoldingsChart from "./TopHoldingsChart";
import * as XLSX from "xlsx";
import { getAllChartData } from "@/app/(admin)/admin/excel/utils";
import HorizontalTable from "./HorizontalTable";
import { InceptionPerformanceChart } from "./InceptionPerformanceChart";

export default function PDF({ workbook }: { workbook: XLSX.WorkBook }) {
  const {
    topTenSplit,
    topThreeContributors,
    bottomThreeContributors,
    cumulativePerformance,
    twelveMonthCumulativePerformance,
    cumulativeStrategyPerformance,
  } = getAllChartData(workbook);

  return (
    <div className="grid grid-cols-2 gap-6">
      {topTenSplit?.length ? <TopHoldingsChart holdings={topTenSplit} /> : null}
      <div className="col-span-1">
        <TwoColumnTable data={topThreeContributors} textSize="xs" />
      </div>
      <div className="col-span-1">
        <TwoColumnTable data={bottomThreeContributors} textSize="xs" />
      </div>
      <div className="col-span-2">
        <HorizontalTable data={cumulativePerformance} textSize="xs" />
      </div>
      <div className="col-span-2">
        <HorizontalTable
          data={twelveMonthCumulativePerformance}
          textSize="xs"
        />
      </div>
      <div className="col-span-2">
        <InceptionPerformanceChart data={cumulativeStrategyPerformance} />
      </div>
    </div>
  );
}
