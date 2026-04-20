import { Icon } from "@iconify/react/dist/iconify.js";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { MdOutlineLogout } from "react-icons/md";
import { getUserSidebarItems } from "../constants/sidebarTabs.constant";
import assets from "../constants/assets.constant";
import QuickActions from "../components/QuickActions";
import LogoutModal from "../components/LogoutModal";

export default function MobileSidebar({ isOpen, onClose }) {
    const { pathname } = useLocation();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const { userProfile } = useAuth();



    const updatedSidebarItems = getUserSidebarItems(userProfile);

    const handleLogout = () => {
        setIsLogoutModalOpen(true);
    };

    return (
        <>
            {/* Wrapper */}
            <div
                className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${isOpen ? "visible" : "invisible pointer-events-none"}`}
            >
                {/* Overlay */}
                <div
                    onClick={onClose}
                    className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
                />

                {/* Sidebar */}
                <div
                    className={`relative h-full w-75 max-w-[85%] bg-white shadow-xl overflow-y-auto transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <button onClick={onClose} className="absolute right-3 top-3">
                        <Icon
                            icon="maki:cross"
                            className="text-2xl"
                        />
                    </button>

                    <div className="flex items-center justify-center pt-8 mb-6">
                        <img src={assets.picLogo} alt="logo" className="h-12" />
                    </div>


                    <div className="px-4 max-sm:px-2 mb-4">
                        <QuickActions />
                    </div>

                    <nav className="flex flex-col justify-between min-h-[calc(100vh-120px)] px-2">
                        <div className="flex flex-col gap-3 text-sm">
                            {updatedSidebarItems?.map((detail) => (
                                <NavLink
                                    key={detail.name}
                                    to={detail.to}
                                    onClick={onClose}
                                    className={({ isActive }) => {
                                        const isDashboardActive =
                                            detail.to === "/" &&
                                            (pathname === "/" || pathname.startsWith("/dashboard/view/"));

                                        const activeState = isActive || isDashboardActive;

                                        return `flex items-center gap-2 px-4 h-11 rounded-md transition-colors duration-150 whitespace-nowrap
                                                ${activeState
                                                ? "bg-(--primary) text-white font-semibold"
                                                : "font-medium text-[#64646E] hover:bg-gray-100"
                                            }`;
                                    }}
                                >
                                    <span className="min-w-8 flex justify-center">
                                        <Icon icon={detail.icon} className={detail.iconClass} />
                                    </span>
                                    <span>{detail.name}</span>
                                </NavLink>
                            ))}
                        </div>

                        <div
                            className="flex items-center gap-2 text-[#64646E] px-4 py-6 cursor-pointer"
                            onClick={handleLogout}
                        >
                            <MdOutlineLogout className="text-[1.4rem] min-w-8" />
                            <span className="text-base">Logout</span>
                        </div>
                    </nav>
                </div>
            </div>

            {isLogoutModalOpen && (
                <LogoutModal setIsLogoutModalOpen={setIsLogoutModalOpen} />
            )}
        </>
    );
}