import TwoColumnTable from "./TwoColumnTable";
import * as XLSX from "xlsx";
import { getAllChartData } from "@/app/(admin)/admin/excel/utils";
import HorizontalTable from "./HorizontalTable";
import { InceptionPerformanceChart } from "./InceptionPerformanceChart";
import { getDateFromFileName } from "@/lib/utils";
import Page from "./pdf/Page";
import FundCommentary from "./pdf/FundCommentary";

export default function PDF({
  workbook,
  fileName,
}: {
  workbook: XLSX.WorkBook;
  fileName: string;
}) {
  const {
    topThreeContributors,
    bottomThreeContributors,
    cumulativePerformance,
    twelveMonthCumulativePerformance,
    cumulativeStrategyPerformance,
  } = getAllChartData(workbook);

  const headerDate = getDateFromFileName(fileName, "MMMM YYY");
  const footerDate = getDateFromFileName(fileName, "dd/MM/YYY");

  if (!headerDate) return <div>error: could not get header date</div>;
  if (!footerDate) return <div>error: could not get footer date</div>;

  return (
    <>
      {/* page 1? */}
      <Page headerDate={headerDate} footerDate={footerDate}>
        <FundCommentary />
        <hr className="my-2 mx-4" />

        <div className="p-4 w-full">
          <HorizontalTable data={cumulativePerformance} textSize="xs" />
          <InceptionPerformanceChart
            data={cumulativeStrategyPerformance}
            height={250}
          />
          <HorizontalTable
            data={twelveMonthCumulativePerformance}
            textSize="xs"
          />
        </div>
      </Page>

      <Page headerDate={headerDate} footerDate={footerDate}>
        <div className="grid grid-cols-2 gap-6 p-4">
          <div className="col-span-1">
            <TwoColumnTable data={topThreeContributors} textSize="xs" />
          </div>
          <div className="col-span-1">
            <TwoColumnTable data={bottomThreeContributors} textSize="xs" />
          </div>
        </div>
      </Page>
    </>
  );
}
