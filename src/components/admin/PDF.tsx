import TwoColumnTable from "./TwoColumnTable";
import * as XLSX from "xlsx";
import { getAllChartData } from "@/app/(admin)/admin/excel/utils";
import HorizontalTable from "./HorizontalTable";

export default function PDF({ workbook }: { workbook: XLSX.WorkBook }) {
  const {
    topThreeContributors,
    bottomThreeContributors,
    cumulativePerformance,
  } = getAllChartData(workbook);

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
    </div>
  );
}
