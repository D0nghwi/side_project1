import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

function NoteEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState(""); // "react, fastapi"
  const [loading, setLoading] = useState(true);   // 초기 데이터 로딩
  const [saving, setSaving] = useState(false);    // 수정 저장 중
  const [error, setError] = useState(null);

  // 기존 노트 데이터 불러오기
  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:8000/notes/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("해당 노트를 찾을 수 없습니다.");
          }
          throw new Error("노트 불러오기에 실패했습니다.");
        }

        const data = await response.json();
        setTitle(data.title || "");
        setContent(data.content || "");
        setTagsInput(data.tags ? data.tags.join(", ") : "");
      } catch (err) {
        setError(err.message || "알 수 없는 오류");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  // 수정 내용 저장
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("제목은 필수입니다.");
      return;
    }

    try {
      setSaving(true);

      const tags =
        tagsInput.trim().length > 0
          ? tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
          : null;

      const response = await fetch(`http://localhost:8000/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          tags,
        }),
      });

      if (!response.ok) {
        throw new Error("노트 수정에 실패했습니다.");
      }

      const updated = await response.json();

      // 수정 완료 후 해당 노트 상세 페이지로 이동
      navigate(`/notes/${updated.id}`);
    } catch (err) {
      setError(err.message || "알 수 없는 오류");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-4">노트 불러오는 중...</div>;
  }

  if (error && !saving) {
    return (
      <div className="p-4 text-red-500">
        에러: {error}
        <div className="mt-4">
          <Link to="/" className="text-sm text-blue-600 underline">
            ← 노트 목록으로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">노트 수정</h1>
        <Link to={`/notes/${id}`} className="text-sm text-blue-600 hover:underline">
          ← 상세 페이지로
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
            placeholder="제목을 입력하세요"
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
            placeholder="노트 내용을 입력하세요"
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
            disabled={saving}
            className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NoteEditPage;
