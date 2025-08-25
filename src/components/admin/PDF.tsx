import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import * as XLSX from "xlsx";
import { getAllChartData } from "@/app/(admin)/admin/excel/utils";
import TwoColumnTable from "./TwoColumnTable";

interface PDFProps {
  workbook: XLSX.WorkBook;
}

const styles = StyleSheet.create({
  page: { padding: 24 },
  title: { fontSize: 18, marginBottom: 12 },
  list: { marginTop: 8 },
  item: { fontSize: 12, marginBottom: 4 },
});

export default function PDF({ workbook }: PDFProps) {
  const { topThreeContributors } = getAllChartData(workbook);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* <Text style={styles.title}>Sheet Names</Text>
        <View style={styles.list}>
          {workbook.SheetNames.map((name) => (
            <Text key={name} style={styles.item}>
              {name}
            </Text>
          ))}
        </View> */}
        <View style={{ marginTop: 16 }}>
          {topThreeContributors && (
            <TwoColumnTable data={topThreeContributors} />
          )}
        </View>
      </Page>
    </Document>
  );
}
