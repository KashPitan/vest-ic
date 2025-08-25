import React from "react";
import * as XLSX from "xlsx";
import TwoColumnTable from "@/components/admin/TwoColumnTable";
import { getAllChartData } from "@/app/(admin)/admin/excel/utils";

interface PortfolioComponentsPreview {
  workbook: XLSX.WorkBook;
}

const FundData = ({ workbook }: PortfolioComponentsPreview) => {
  const { topThreeContributors, bottomThreeContributors } =
    getAllChartData(workbook);
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
    </div>
  );
};

export default FundData;
