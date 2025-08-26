import TwoColumnTable from "./TwoColumnTable";
import * as XLSX from "xlsx";
import { getAllChartData } from "@/app/(admin)/admin/excel/utils";
import HorizontalTable from "./HorizontalTable";
import { InceptionPerformanceChart } from "./InceptionPerformanceChart";

export default function PDF({ workbook }: { workbook: XLSX.WorkBook }) {
  const {
    topThreeContributors,
    bottomThreeContributors,
    cumulativePerformance,
    twelveMonthCumulativePerformance,
    cumulativeStrategyPerformance,
  } = getAllChartData(workbook, { inceptionPerformance: { series2Col: "K" } });

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="col-span-1">
        <TwoColumnTable data={topThreeContributors} />
      </div>
      <div className="col-span-1">
        <TwoColumnTable data={bottomThreeContributors} />
      </div>
      <div className="col-span-2">
        <HorizontalTable data={cumulativePerformance} />
      </div>
      <div className="col-span-2">
        <HorizontalTable data={twelveMonthCumulativePerformance} />
      </div>
      <div className="col-span-2 max-w-full max-h-full w-full h-full">
        <InceptionPerformanceChart data={cumulativeStrategyPerformance} />
      </div>
    </div>
  );
}
