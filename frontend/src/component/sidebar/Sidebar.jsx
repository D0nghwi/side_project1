import React from "react";
import { NavLink } from "react-router-dom";
import { sidebar } from "../../asset/style/uiClasses";

function Sidebar() {
  return (
    <aside className={sidebar.aside}>
      <h2 className={sidebar.title}>메뉴</h2>

      <nav className={sidebar.nav}>
        <NavLink
          to="/notes"
          className={({ isActive }) =>
            `${sidebar.linkBase} ${isActive ? sidebar.linkActive : sidebar.linkInactive}`
          }
        >
          노트 목록
        </NavLink>

        <NavLink
          to="/flashcards"
          className={({ isActive }) =>
            `${sidebar.linkBase} ${isActive ? sidebar.linkActive : sidebar.linkInactive}`
          }
        >
          플래시카드
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
