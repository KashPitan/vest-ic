import TwoColumnTable from "./TwoColumnTable";
import TopHoldingsChart from "./TopHoldingsChart";
import AssetAllocationChart from "./AssetAllocationChart";
import EquitiesBreakdownChart from "./EquitiesBreakdownChart";
import FixedIncomeBreakdownChart from "./FixedIncomeBreakdownChart";
import * as XLSX from "xlsx";
import { getAllChartData } from "@/app/(admin)/admin/excel/utils";
import HorizontalTable from "./HorizontalTable";
import { InceptionPerformanceChart } from "./InceptionPerformanceChart";
import { getDateFromFileName } from "@/lib/utils";
import Page from "./pdf/Page";
import FundCommentary from "./pdf/FundCommentary";
import SidePanel from "./pdf/Sidebar";
import ImportantInformation from "./pdf/ImportantInformation";
import SectionTitle from "./pdf/SectionTitle";

export default function PDF({
  workbook,
  fileName,
}: {
  workbook: XLSX.WorkBook;
  fileName: string;
}) {
  const {
    topTenSplit,
    assetAllocation,
    equitiesBreakdown,
    fixedIncomeBreakdown,
    topThreeContributors,
    bottomThreeContributors,
    cumulativePerformance,
    twelveMonthCumulativePerformance,
    cumulativeStrategyPerformance,
    fundInfo,
    keyBuys,
    keySells,
  } = getAllChartData(workbook);

  const headerDate = getDateFromFileName(fileName, "MMMM yyy");
  const footerDate = getDateFromFileName(fileName, "dd/MM/yyy");

  if (!headerDate) return <div>error: could not get header date</div>;
  if (!footerDate) return <div>error: could not get footer date</div>;

  return (
    <>
      {/* Charts page */}
      <Page headerDate={headerDate} footerDate={footerDate}>
        <div className="grid grid-cols-2 gap-6 p-4">
          {topTenSplit?.length ? (
            <TopHoldingsChart holdings={topTenSplit} />
          ) : null}
          {assetAllocation?.length ? (
            <AssetAllocationChart allocation={assetAllocation} />
          ) : null}
          {equitiesBreakdown?.length ? (
            <EquitiesBreakdownChart
              equitiesBreakdown={equitiesBreakdown}
              assetAllocation={assetAllocation}
            />
          ) : null}
          {fixedIncomeBreakdown?.length ? (
            <FixedIncomeBreakdownChart
              fixedIncomeBreakdown={fixedIncomeBreakdown}
            />
          ) : null}
        </div>
      </Page>

      {/* Fund commentary and performance page */}
      <Page headerDate={headerDate} footerDate={footerDate}>
        <div className="grid grid-cols-7">
          <SidePanel />

          <div className="col-span-5">
            <div className="p-4 pb-0 h-3/5 min-h-3/5 max-h-3/5 flex flex-col">
              <FundCommentary />
            </div>

            <div className="p-4 w-full space-y-4">
              <HorizontalTable data={cumulativePerformance} textSize="xs" />
              <InceptionPerformanceChart
                data={cumulativeStrategyPerformance}
                height={180}
              />
              <HorizontalTable
                data={twelveMonthCumulativePerformance}
                textSize="xs"
              />
            </div>
          </div>
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

      <Page headerDate={headerDate} footerDate={footerDate}>
        <div className="p-4">
          <HorizontalTable data={fundInfo} textSize="xs" />

          <SectionTitle>Portfolio Highlights</SectionTitle>

          <HorizontalTable
            data={keyBuys}
            textSize="xs"
            secondHeaderText="Key Buys"
            emptyStateText="There were no key buys this month"
          />

          <HorizontalTable
            classNames="mt-4"
            data={keySells}
            textSize="xs"
            secondHeaderText="Key Sells"
            emptyStateText="There were no key sells this month"
          />
        </div>
      </Page>

      <Page headerDate={headerDate} footerDate={footerDate}>
        <ImportantInformation />
      </Page>
    </>
  );
}
