import TwoColumnTable from "./TwoColumnTable";
import * as XLSX from "xlsx";
import { getAllChartData } from "@/app/(admin)/admin/excel/utils";

export default function PDF({ workbook }: { workbook: XLSX.WorkBook }) {
  const { topThreeContributors, bottomThreeContributors } =
    getAllChartData(workbook);

  return (
    <div className="grid grid-cols-2 gap-6">
      <TwoColumnTable data={topThreeContributors} />
      <TwoColumnTable data={bottomThreeContributors} />
    </div>
  );
}
