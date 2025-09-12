interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionTitle({
  children,
  className = "",
}: SectionTitleProps) {
  return (
    <>
      <h3 className={`mt-2 ${className}`}>{children}</h3>
      <hr className="border-[1.2px] border-black my-2" />
    </>
  );
}
