import React from "react";
import { Link } from "react-router-dom";
import { nav } from "../../asset/style/uiClasses";

function NavBar() {
   return (
    <header className={nav.header}>
      <div className={nav.brandWrap}>
        <span className={nav.brandTitle}>StudyNote</span>
        <span className={nav.brandSub}>/ SideProject</span>
      </div>

      <nav className={nav.navWrap}>
        <Link to="/notes" className={nav.navLink}>
          노트
        </Link>
        <Link to="/flashcards" className={nav.navLink}>
          플래시카드
        </Link>
      </nav>
    </header>
  );
}

export default NavBar;

