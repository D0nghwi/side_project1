import React from "react";
import { NavLink } from "react-router-dom";

const linkBase =
  "block px-4 py-2 rounded-md text-sm font-medium mb-1 transition-colors";
const linkActive = "bg-blue-100 text-blue-700";
const linkInactive = "text-gray-700 hover:bg-gray-100";

function Sidebar() {
  return (
    <aside className="w-56 bg-white border-r border-gray-200 p-4">
      <h2 className="text-xs font-semibold text-gray-500 mb-2">메뉴</h2>
      <nav className="flex flex-col">
        <NavLink
          to="/notes"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          노트 목록
        </NavLink>
        <NavLink
          to="/flashcards"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          플래시카드
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
