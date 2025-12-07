import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">404</h1>
      <p className="text-sm text-gray-600 mb-4">
        해당 페이지를 찾을 수 없습니다.
      </p>
      <Link
        to="/notes"
        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
      >
        노트 목록으로 돌아가기
      </Link>
    </div>
  );
}

export default NotFoundPage;
