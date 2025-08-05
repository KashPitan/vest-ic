import * as XLSX from "xlsx";

interface SheetNamesProps {
  workbook: XLSX.WorkBook;
}

// This is a placeholder component
export default function SheetNames({ workbook }: SheetNamesProps) {
  return (
    <ul className="list-disc pl-5 text-pure-white">
      {workbook.SheetNames.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
}
