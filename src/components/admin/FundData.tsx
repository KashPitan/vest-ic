import React from "react";
import * as XLSX from "xlsx";
import TwoColumnTable from "@/components/admin/TwoColumnTable";
import { getAllChartData } from "@/app/(admin)/admin/excel/utils";
import HorizontalTable, { HorizontalTableRows } from "./HorizontalTable";
import { InceptionPerformanceChart } from "./InceptionPerformanceChart";
import { FundCommentaryText } from "./pdf/FundCommentary";
import { elza, articulat } from "@/fonts";

interface PortfolioComponentsPreview {
  workbook: XLSX.WorkBook;
  white?: boolean;
}

const FundData = ({ workbook, white }: PortfolioComponentsPreview) => {
  const {
    topThreeContributors,
    bottomThreeContributors,
    cumulativePerformance,
    twelveMonthCumulativePerformance,
    cumulativeStrategyPerformance,
    monthlyPerformance,
  } = getAllChartData(workbook);
  return (
    <div>
      <section id="summary">
        <h2
          className={`text-2xl ${white ? "text-pure-white" : "text-black"} font-bold mb-4 ${elza.className}`}
        >
          Summary
        </h2>
        <h3
          className={`text-lg ${white ? "text-pure-white" : "text-black"} font-bold mb-4 ${elza.className}`}
        >
          Investment Objectives
        </h3>

        <p
          className={`${white ? "text-pure-white" : "text-black"} mb-4 ${articulat.className}`}
        >
          The investment objective of the portfolio is to achieve long-term
          capital growth by investing across a global portfolio of assets. The
          Fund invests in a diversified global multi asset portfolio and seeks
          to achieve above-average returns for a commensurate level of risk for
          the respective risk profile.
        </p>

        <h3
          className={`text-lg ${white ? "text-pure-white" : "text-black"} font-bold mb-4 ${elza.className}`}
        >
          Investment Team
        </h3>
        <h4
          className={`text-md ${white ? "text-pure-white" : "text-black"} font-bold mb-4 ${elza.className}`}
        >
          Pushpanshu Prakash - Fund Manager
        </h4>
        <p
          className={`${white ? "text-pure-white" : "text-black"} mb-4 ${articulat.className}`}
        >
          Pushpanshu is the Fund Manager of EPIC&apos;s UK domiciled range of
          multi asset funds, the EPIC Wealth Fund as well as EPIC&apos;s range
          of model portfolio solutions. Pushpanshu joined EPIC in March 2019
          from City Financial where he was a fund analyst for the Multi Asset
          team responsible for fund specific research and quantitative
          modelling. He joined City Financial in 2017 after graduating from
          University College London (UCL) with an MSci in Mathematics, where he
          completed his thesis in fluid dynamics with a focus on situational
          modelling and financial mathematics.
        </p>
      </section>

      <section id="portfolio" className="mt-8">
        <h2
          className={`text-2xl ${white ? "text-pure-white" : "text-black"} font-bold mb-4 ${elza.className}`}
        >
          Portfolio (TBA)
        </h2>
      </section>

      <section id="performance">
        <h2
          className={`text-2xl ${white ? "text-pure-white" : "text-black"} font-bold ${elza.className}`}
        >
          Performance
        </h2>
        <div className="mt-4">
          <h3
            className={`text-xl ${white ? "text-pure-white" : "text-black"} font-bold ${elza.className}`}
          >
            Cumulative Strategy Performance
          </h3>

          <InceptionPerformanceChart
            data={cumulativeStrategyPerformance}
            white={white}
          />
        </div>
        <div className="mt-4">
          {topThreeContributors && (
            <TwoColumnTable data={topThreeContributors} white={white} />
          )}
        </div>
        <div className="mt-4">
          {bottomThreeContributors && (
            <TwoColumnTable data={bottomThreeContributors} white={white} />
          )}
        </div>
        <div className="mt-4">
          {cumulativePerformance && (
            <HorizontalTable data={cumulativePerformance} white={white} />
          )}
        </div>
        <div className="mt-4">
          {twelveMonthCumulativePerformance && (
            <HorizontalTable
              data={twelveMonthCumulativePerformance}
              white={white}
            />
          )}
        </div>
        <div className="mt-4">
          <HorizontalTableRows
            data={monthlyPerformance.data}
            headerText={monthlyPerformance.headerCellValue}
            white={white}
          />
        </div>
      </section>

      <section id="commentary" className="mt-8">
        <h2
          className={`text-2xl ${white ? "text-pure-white" : "text-black"} font-bold mb-4 ${elza.className}`}
        >
          Commentary
        </h2>

        <FundCommentaryText white={white} />
      </section>

      <section id="commentary" className="mt-8">
        <h2
          className={`text-2xl ${white ? "text-pure-white" : "text-black"} font-bold mb-4 ${elza.className}`}
        >
          Portfolio Information
        </h2>
        <div className="max-w-fit">
          {/* update this to pull dynamically from somewhere */}
          <TwoColumnTable
            data={[
              ["Portfolio Launch Date", "20 July 2020"],
              ["Base Currency", "GBP"],
              ["Initial Charge", "0.00%"],
              ["Annual Management Charge", "0.20%"],
              [
                "Portfolio Availability",
                "Abrdn, Aviva, Fidelity, Fundment, Nucleus, Quilter, Transact, Wealthtime.",
              ],
              ["Minimum Recommended Investment", "£25,000"],
            ]}
            textSize="xs"
            white={white}
          />
        </div>
      </section>
    </div>
  );
};

export default FundData;
