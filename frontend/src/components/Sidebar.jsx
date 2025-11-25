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

      <div className="mt-6">
        <h2 className="text-xs font-semibold text-gray-500 mb-2">프로젝트</h2>
        <p className="text-xs text-gray-400">
          FastAPI + AI 챗봇 연동은 나중에 이 레이아웃 안에서 붙일 예정입니다.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
