import { NavigationBar } from "@/components/public/NavigationBar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NavigationBar />
      {children}
    </>
  );
};

export default Layout;
