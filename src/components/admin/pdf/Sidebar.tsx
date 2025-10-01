import TwoColumnTable from "../TwoColumnTable";
import SectionTitle from "./SectionTitle";

export default function SidePanel() {
  return (
    <div className="col-span-2 h-full p-4">
      <SectionTitle>Investment Objective</SectionTitle>
      <p className="text-xs mt-2">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod,
        urna eu tincidunt consectetur, nisi nisl aliquam enim, nec facilisis
        massa mauris ac dolor. Pellentesque habitant morbi tristique senectus et
        netus et malesuada fames ac turpis egestas.
      </p>

      <SectionTitle>Key Facts</SectionTitle>

      {/* TODO: replace hardcoded data */}
      <TwoColumnTable
        data={[
          ["Launch Date", "20 Jul 2020"],
          ["Base Curr.", "GBP"],
          ["Initial Charge", "0.00%"],
          ["AMC", "0.20%"],
          ["Minimum Inv.", "£25,000"],
        ]}
        textSize="xs"
      />

      <SectionTitle>Administration / Dealing</SectionTitle>
      <p className="text-xs pt-2">
        Dealing via platform, on an &quot;agent-asclient&quot; basis.
      </p>
    </div>
  );
}
