import TwoColumnTable from "./TwoColumnTable";
import * as XLSX from "xlsx";
import { getAllChartData } from "@/app/(admin)/admin/excel/utils";

export default function PDF({ workbook }: { workbook: XLSX.WorkBook }) {
  const { topThreeContributors } = getAllChartData(workbook);

  return (
    <div>
      <TwoColumnTable data={topThreeContributors} />
    </div>
  );
}
