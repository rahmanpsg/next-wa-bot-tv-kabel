import Header from "./Header";
import Footer from "./Footer";
import Drawer from "./Drawer";

const Layout = ({ children }: any) => {
  return (
    <div className="drawer drawer-mobile h-screen w-full">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <Header />
        <div className="mb-auto">
          <div className="p-4">{children}</div>
        </div>
        <Footer />
      </div>
      <Drawer />
    </div>
  );
};

export default Layout;
