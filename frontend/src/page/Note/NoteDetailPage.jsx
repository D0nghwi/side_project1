import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { layout, card, text, btn, pill, pages } from "../../asset/style/uiClasses";
import { notesApi } from "../../api/notesApi";
import { useConfirm } from "../../hook/useConfirm";
import { useAlert } from "../../hook/useAlert";
import { useAsync } from "../../hook/useAsync";
import { useApiError } from "../../hook/useApiError";

import ChatPanel from "../../component/panel/ChatPanel";

function NoteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  // 상태 변수들 - 실시간 변경 감지
  const [note, setNote] = useState(null);

  const { confirm, ConfirmRenderer } = useConfirm();
  const { alert, AlertRenderer } = useAlert();
  const { getErrorMessage, isNotFound } = useApiError();

  const noteReq = useAsync();    // 노트 조회용
  const deleteReq = useAsync();  // 삭제용

  useEffect(() => {
    noteReq.run(
      async () => {
        const res = await notesApi.get(id);
        return res.data;
      },
      {
        onSuccess: (data) => setNote(data),
      }
    );
  }, [id]);

  const handleDelete = async () => {
    if (deleteReq.loading) return;

    const ok = await confirm("정말 이 노트를 삭제할까요?", {
      title: "노트 삭제",
      confirmText: "삭제",
      cancelText: "취소",
    });
    if (!ok) return;

    await deleteReq.run(
      async () => {
        await notesApi.remove(id);
        return true;
      },
      {
        onSuccess: () => navigate("/notes"),
        onError: (err) => {
          const msg = getErrorMessage(err, "삭제 중 오류가 발생했습니다.");
          alert(msg, { title: "삭제 실패" });
        },
      }
    );
  };

  const loading = noteReq.loading;
  const errorText = noteReq.error
    ? isNotFound(noteReq.error)
      ? "해당 노트를 찾을 수 없습니다."
      : getErrorMessage(noteReq.error, "서버 요청 실패")
    : null;

  return (
    <>
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
                type="button"
                onClick={() => navigate(`/notes/${id}/edit`)}
                className={`${btn.outlineBase} ${btn.outlineBlue}`}
              >
                수정
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteReq.loading}
                className={`${btn.outlineBase} ${btn.outlineRed}`}
              >
                {deleteReq.loading ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>

          <div className={card.dashed}>
            {loading && <span className={text.mutedXs}>노트 불러오는 중...</span>}
            {errorText && <span className={text.error}>에러 발생: {errorText}</span>}

            {!loading && !errorText && note && (
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
          <ChatPanel noteId={note?.id || id} noteTitle={note?.title} noteContent={note?.content} />
        </aside>
      </div>
      
      {/*modal 렌더러 */}
      <ConfirmRenderer />
      <AlertRenderer />
    </>
  );
}

export default NoteDetailPage;