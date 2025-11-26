import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    //헤더 Tailwind클래스 - <가로100%  높이56px  배경흰색  그림자  요소가로나열  세로가운데아이템정렬  좌우패딩24px>
    <header className="w-full h-14 bg-white shadow flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <span className="font-bold text-xl text-blue-600">StudyNote</span>
        <span className="text-sm text-gray-500">/ SideProject</span>
      </div>
      <nav className="flex items-center gap-4 text-sm">
        <Link to="/notes" className="text-gray-700 hover:text-blue-600">
          노트
        </Link>
        <Link to="/flashcards" className="text-gray-700 hover:text-blue-600">
          플래시카드
        </Link>
      </nav>
    </header>
  );
}

export default NavBar;

