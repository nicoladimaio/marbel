import React from "react";
import {
  FaTags,
  FaBriefcase,
  FaLock,
  FaClipboardList,
  FaImage,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";

type AdminMenuProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

export default function AdminMenu({
  activeTab,
  setActiveTab,
  onLogout,
  collapsed = false,
  onToggleCollapse,
}: AdminMenuProps) {
  const portfolioClusterTabs = ["portfolio", "categorie", "luoghi"];
  const menu = [
    { key: "offerte", label: "Offerte", icon: FaTags },
    { key: "portfolio", label: "Portfolio lavori", icon: FaBriefcase },
    { key: "cambia-password", label: "Cambia Password", icon: FaLock },
    { key: "preventivo", label: "Preventivo", icon: FaClipboardList },
    { key: "homepage", label: "Homepage", icon: FaImage },
  ];

  return (
    <aside
      className={`w-full ${collapsed ? "sm:w-20" : "sm:w-64"} bg-[#1E2A22] text-white min-h-screen p-4 ${collapsed ? "sm:p-3" : "sm:p-6"} flex flex-col gap-5 border-r border-white/10 transition-all duration-200`}
    >
      <div className={`mb-2 ${collapsed ? "sm:mb-2" : "sm:mb-4"}`}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-xs font-bold uppercase tracking-[0.2em] text-white/80">
              M
            </div>
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label="Espandi menu"
                title="Espandi menu"
                className="hidden sm:flex items-center justify-center h-9 w-9 rounded-lg border border-white/20 bg-white/5 text-white/85 hover:bg-white/15 transition-colors"
              >
                <FaBars className="text-sm" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div className="overflow-hidden">
              <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                Marbel
              </div>
              <div className="text-xl sm:text-2xl font-bold">Area Admin</div>
            </div>
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label="Comprimi menu"
                title="Comprimi menu"
                className="hidden sm:flex items-center justify-center h-9 w-9 rounded-lg border border-white/20 bg-white/5 text-white/85 hover:bg-white/15 transition-colors"
              >
                <FaBars className="text-sm" />
              </button>
            )}
          </div>
        )}
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {menu.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            title={collapsed ? item.label : undefined}
            className={`group flex items-center ${collapsed ? "justify-center" : "gap-3 text-left"} px-3 py-2.5 ${collapsed ? "sm:px-2" : "sm:px-4"} sm:py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/40 ${
              (item.key === "portfolio" &&
                portfolioClusterTabs.includes(activeTab)) ||
              activeTab === item.key
                ? "bg-white text-[#1E2A22] shadow-lg"
                : "hover:bg-white/10 text-white/85"
            }`}
          >
            <item.icon
              className={`text-sm transition-all duration-200 ${
                (item.key === "portfolio" &&
                  portfolioClusterTabs.includes(activeTab)) ||
                activeTab === item.key
                  ? "text-[#1E2A22]"
                  : "text-white/70 group-hover:text-white"
              }`}
            />
            <span
              className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${
                collapsed
                  ? "max-w-0 opacity-0 -translate-x-2"
                  : "max-w-[180px] opacity-100 translate-x-0"
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      <button
        onClick={onLogout}
        title={collapsed ? "Log out" : undefined}
        className={`mt-auto mb-4 sm:mb-0 px-3 py-2.5 ${collapsed ? "sm:px-2" : "sm:px-4"} sm:py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors duration-200 flex items-center justify-center ${collapsed ? "" : "gap-2"}`}
      >
        <FaSignOutAlt className="text-sm" />
        <span
          className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${
            collapsed
              ? "max-w-0 opacity-0 -translate-x-2"
              : "max-w-[120px] opacity-100 translate-x-0"
          }`}
        >
          Log out
        </span>
      </button>
    </aside>
  );
}
