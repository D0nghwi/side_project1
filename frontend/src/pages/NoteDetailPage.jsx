import React from "react";
import { useParams } from "react-router-dom";

// 이후  noteId로 실제 노트 데이터 fetch
function NoteDetailPage() {
  const { id } = useParams();

  return (
    <div className="flex gap-4 h-full">
      {/* 노트 내용 */}
      <section className="flex-1 bg-white rounded-lg shadow p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          노트 #{id} 상세
        </h1>
        <p className="text-sm text-gray-500 mb-4">
          나중에 여기에 markdown editor / viewer 내용 편집/조회 컴포넌트 추가.
        </p>

        <div className="border border-dashed border-gray-300 rounded-md p-4 text-sm text-gray-500">
          여기에 노트 내용을 렌더링
        </div>
      </section>

      {/* AI 챗봇 */}
      <aside className="w-80 bg-white rounded-lg shadow p-4 flex flex-col">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">
          AI 챗봇 (준비중)
        </h2>
        <p className="text-xs text-gray-500 mb-3">
          FastAPI + AI API 연결한 챗봇 UI가 여기에 들어올 예정
        </p>
        <div className="flex-1 border border-dashed border-gray-300 rounded-md p-3 text-xs text-gray-400">
          메시지 리스트 및 입력창 컴포넌트 자리
        </div>
      </aside>
    </div>
  );
}

export default NoteDetailPage;
