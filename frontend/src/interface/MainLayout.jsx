import React from "react";
import NavBar from "../component/header/NavBar";
import Sidebar from "../component/sidebar/Sidebar";

// 메인 레이아웃 
// 모든 페이지에서 공통으로 사용 - 네비게이션 및 사이드바
function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* 네비게이션 바 */}
      <NavBar />

      <div className="flex flex-1">
        {/* 왼쪽 사이드바 */}
        <Sidebar />

        {/* 메인 컨텐츠 영역 */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default MainLayout;
