import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function NoteCreatePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState(""); // 노트 제목
  const [content, setContent] = useState(""); // 노트 본문
  const [tagsInput, setTagsInput] = useState(""); // 콤마 구분 태그 입력
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); 

  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 submit 시 페이지 새로고침 방지
    setError(null);

    if (!title.trim()) {
      setError("제목은 필수입니다.");
      return;
    }

    try {
      setLoading(true);

      const trimmed = tagsInput.trim();
      
      const tags =
        trimmed !== ""
          ? trimmed
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag.length > 0)
          : null; // 빈 문자열인 경우 null로 설정
      
      const payload = {
        title,
        content,
        tags, // null 또는 string[]
      };
      //디버깅용 JSON 출력
      //console.log("POST /notes payload:", payload);
      const response = await fetch("http://localhost:8000/notes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("노트 생성에 실패했습니다.");
      }

      const createdNote = await response.json();

      // 생성 후 해당 노트 상세 페이지로 이동
      navigate(`/notes/${createdNote.id}`);
    } catch (err) {
      setError(err.message || "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">새 노트 작성</h1>
        <Link to="/" className="text-sm text-blue-600 hover:underline">
          ← 노트 목록으로
        </Link>
      </div>

      {error && (
        <div className="text-sm text-red-500 border border-red-200 bg-red-50 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-lg shadow p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            제목
          </label>
          <input
            type="text"
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 리액트 공부 노트"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            내용
          </label>
          <textarea
            className="w-full border rounded-md px-3 py-2 text-sm h-40 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="노트 내용을 적어주세요."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            태그 (쉼표로 구분)
          </label>
          <input
            type="text"
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="예: react, fastapi, memo"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm border rounded-md text-gray-600 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NoteCreatePage;
