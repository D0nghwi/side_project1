import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import ChatPanel from "../../component/panel/ChatPanel";

function NoteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  // 상태 변수들 - 실시간 변경 감지
  const [note, setNote] = useState(null);    // 노트 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null);  // 에러 상태
  const [deleting, setDeleting] = useState(false); // 삭제 로딩 상태

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
          throw new Error("서버 요청 실패");
        }

        const data = await response.json();
        setNote(data);
      } catch (err) {
        setError(err.message || "알 수 없는 오류");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("정말 이 노트를 삭제할까요?")) return;

    try {
      setDeleting(true);
      const response = await fetch(`http://localhost:8000/notes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok && response.status !== 204) {
        throw new Error("삭제에 실패했습니다.");
      }
      // 삭제 후 목록으로 이동
      navigate("/notes");
    } catch (err) {
      alert(err.message || "삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex gap-4 h-full">
      {/* 노트 내용 */}
      <section className="flex-1 bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {note ? note.title : `노트 #${id} 상세`}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              나중에 여기 editor / viewer가 들어올 예정
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:underline"
            >
              ← 목록
            </Link>
            <button
              onClick={() => navigate(`/notes/${id}/edit`)}
              className="px-3 py-1 text-sm rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-3 py-1 text-sm rounded-md border border-red-600 text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              {deleting ? "삭제 중..." : "삭제"}
            </button>
          </div>
        </div>

        <div className="border border-dashed border-gray-300 rounded-md p-4 text-sm text-gray-700 whitespace-pre-wrap">
          {loading && <span className="text-gray-400">노트 불러오는 중...</span>}

          {error && (
            <span className="text-red-500">
              에러 발생: {error}
            </span>
          )}

          {!loading && !error && note && (
            <>
              <div className="mb-3">
                {note.content || (
                  <span className="text-gray-400">
                    아직 내용이 비어 있습니다.
                  </span>
                )}
              </div>

              {note.tags && note.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {note.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* 사이드 챗 패널 */}
       <aside className="w-80">
        <ChatPanel
          noteId={note?.id || id}
          noteTitle={note?.title}
          noteContent={note?.content}
        />
      </aside>
    </div>
  );
}

export default NoteDetailPage;
