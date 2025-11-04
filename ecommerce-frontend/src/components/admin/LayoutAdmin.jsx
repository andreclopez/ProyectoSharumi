import SidebarAdmin from "./SidebarAdmin";
import { Outlet } from "react-router-dom";

const LayoutAdmin = () => {
  return (
    <div className="flex h-screen">
      <SidebarAdmin />
      <main className="flex-1 bg-[#fdf6f0] p-4 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutAdmin;
