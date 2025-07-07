import React from "react";
import * as XLSX from "xlsx";
import SheetNames from "./SheetNames";

interface PortfolioComponentsPreview {
  workbook: XLSX.WorkBook;
}

const PortfolioComponentsPreview = ({
  workbook,
}: PortfolioComponentsPreview) => {
  return (
    <div>
      <SheetNames workbook={workbook} />
    </div>
  );
};

export default PortfolioComponentsPreview;
