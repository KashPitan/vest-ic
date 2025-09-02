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
  } = getAllChartData(workbook);

  return (
    <div className="grid grid-cols-2 gap-6">
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
