// Layout.tsx
import { Outlet } from "react-router-dom";
import Menu from "./components/Menu/Menu";
import "./App.css";

const Layout = () => {
  return (
    <div className="layout">
      <Menu />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
