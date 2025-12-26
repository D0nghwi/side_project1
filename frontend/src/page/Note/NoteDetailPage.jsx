import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { layout, card, text, btn, pill, pages } from "../../asset/style/uiClasses";
import apiClient from "../../lib/apiClient";

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

        const { data } = await apiClient.get(`/notes/${id}`);
        setNote(data);
      } catch (err) {
        const msg =
          err?.response?.status === 404
            ? "해당 노트를 찾을 수 없습니다."
            : err?.response?.data?.detail || "서버 요청 실패";
        setError(msg);
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
      await apiClient.delete(`/notes/${id}`);
      navigate("/notes");
    } catch (err) {
      const msg =
        err?.response?.data?.detail || "삭제 중 오류가 발생했습니다.";
      alert(msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={layout.row}>
      {/* 노트 내용 */}
      <section className={`${card.base} flex-1`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className={text.titleLg}>
              {note ? note.title : `노트 #${id} 상세`}
            </h1>
          </div>

          <div className={pages.flash.rowGap2}>
            <Link to="/notes" className={btn.linkGray}>
              ← 목록
            </Link>

            <button
              onClick={() => navigate(`/notes/${id}/edit`)}
              className={`${btn.outlineBase} ${btn.outlineBlue}`}
            >
              수정
            </button>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className={`${btn.outlineBase} ${btn.outlineRed}`}
            >
              {deleting ? "삭제 중..." : "삭제"}
            </button>
          </div>
        </div>

        <div className={card.dashed}>
          {loading && <span className={text.mutedXs}>노트 불러오는 중...</span>}

          {error && <span className={text.error}>에러 발생: {error}</span>}

          {!loading && !error && note && (
            <>
              <div className="mb-3">
                {note.content ? (
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: note.content }}
                  />
                ) : (
                  <span className={text.mutedXs}>아직 내용이 비어 있습니다.</span>
                )}
              </div>

              {note.tags && note.tags.length > 0 && (
                <div className={pages.notesList.tag}>
                  {note.tags.map((tag, idx) => (
                    <span key={idx} className={pill.tag}>
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
      <aside className={layout.asideW80}>
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