import React from "react";

function FlashcardsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        플래시카드 학습
      </h1>
      <p className="text-sm text-gray-500 mb-4">
        노트에서 생성한 문제 및 답을 카드 형식으로 학습할 화면
      </p>

      <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center h-64 text-gray-400 text-sm border border-dashed border-gray-300">
        나중에 카드 넘기기 UI를 여기에 구현 예정
      </div>
    </div>
  );
}

export default FlashcardsPage;
