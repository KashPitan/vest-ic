import SectionTitle from "./SectionTitle";

const FundCommentaryText = () => (
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna
    eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa erat at
    dui. Pellentesque habitant morbi tristique senectus et netus et malesuada
    fames ac turpis egestas. Suspendisse potenti. Etiam euismod, urna eu
    tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa erat at
    dui.
    <br />
    <br />
    Mauris non tempor quam, et lacinia sapien. Mauris accumsan eros eget libero
    posuere vulputate. Etiam elit elit, elementum sed varius at, adipiscing
    vitae est. Sed nec felis pellentesque, lacinia dui sed, ultricies sapien.
    Pellentesque orci lectus, consectetur vel posuere posuere, rutrum eu ipsum.
    <br />
    <br />
    Proin dictum, augue in dictum cursus, urna erat dictum urna, nec dictum urna
    erat dictum urna. Etiam euismod, urna eu tincidunt consectetur, nisi nisl
    aliquam nunc, eget aliquam massa erat at dui. Pellentesque habitant morbi
    tristique senectus et netus et malesuada fames ac turpis egestas.
    <br />
    <br />
    Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere
    cubilia curae; Pellentesque suscipit, sem sit amet dictum dictum, sapien sem
    dictum sem, eu dictum sem sem eu sem. Etiam euismod, urna eu tincidunt
    consectetur, nisi nisl aliquam nunc, eget aliquam massa erat at dui.
    <br />
    <br />
    Nullam ac urna eu felis dapibus condimentum sit amet a augue. Sed non neque
    elit. Sed ut imperdiet nisi. Proin condimentum fermentum nunc. Etiam
    pharetra, erat sed fermentum feugiat, velit mauris egestas quam, ut aliquam
    massa nisl quis neque.
    <br />
    <br />
    Suspendisse in orci enim. Pellentesque habitant morbi tristique senectus et
    netus et malesuada fames ac turpis egestas. Mauris accumsan eros eget libero
    posuere vulputate. Etiam elit elit, elementum sed varius at, adipiscing
    vitae est. Sed nec felis pellentesque, lacinia dui sed, ultricies sapien.
  </p>
);

export default function FundCommentary() {
  return (
    <>
      <SectionTitle>Fund Commentary</SectionTitle>
      <div className="mt-1 text-xs h-full columns-2 gap-1 leading-1">
        <FundCommentaryText />
      </div>
      <hr className="border-[1.2px] border-black" />
    </>
  );
}
