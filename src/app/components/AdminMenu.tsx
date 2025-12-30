import React from "react";

type AdminMenuProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
};

export default function AdminMenu({
  activeTab,
  setActiveTab,
  onLogout,
}: AdminMenuProps) {
  const menu = [
    { key: "offerte", label: "Offerte" },
    { key: "portfolio", label: "Portfolio lavori" },
    { key: "cambia-password", label: "Cambia Password" },
  ];
  return (
    <aside className="w-full sm:w-64 bg-[#1a2a4e] text-white min-h-screen p-3 sm:p-6 flex flex-col gap-4 sm:gap-6">
      <div className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8">
        Area Admin
      </div>
      <nav className="flex flex-col gap-2 sm:gap-4 flex-1">
        {menu.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`text-left px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-white/40 ${
              activeTab === item.key
                ? "bg-white/10 text-white shadow"
                : "hover:bg-white/5 text-white/80"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
      {/* Log out in fondo, sempre visibile */}
      <button
        onClick={onLogout}
        className="mt-auto mb-8 px-3 py-2 sm:px-4 sm:py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
      >
        Log out
      </button>
    </aside>
  );
}
