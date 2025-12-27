import { useEffect, useState, useMemo} from "react";
import { Link } from "react-router-dom";
import { pages, btn, pill, text } from "../../asset/style/uiClasses";
import { notesApi } from "../../api/notesApi";
import { useAsync } from "../../hooks/useAsync";
import { useApiError } from "../../hooks/useApiError";

const htmlToText = (html) => {
  if (!html) return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || "").replace(/\s+/g, " ").trim();
};


function NotesListPage() {
  const notesReq = useAsync([]);
  const { getErrorMessage } = useApiError();

  useEffect(() => {
    notesReq.run(async () => {
      const res = await notesApi.list();
      return res.data;
    });
  }, []);

  const notesWithPreview = useMemo(() => {
    return (notesReq.value || []).map((n) => ({
      ...n,
      preview: htmlToText(n.content),
    }));
  }, [notesReq.value]);

  if (notesReq.loading) {
    return <div className="p-4">노트 목록 불러오는 중...</div>;
  }

  if (notesReq.error) {
    const msg = getErrorMessage(notesReq.error, "서버 요청 실패");
    return <div className={text.error}>에러 발생: {msg}</div>;
  }

  return (
    <div className={pages.notesList.page}>
      <div className={pages.notesList.header}>
        <h1 className={text.titleLg}>노트 목록</h1>

        <Link to="/notes/new" className={btn.primaryInline}>
          + 새 노트
        </Link>
      </div>

      {notesWithPreview.length === 0 ? (
        <p className={text.descXs}>아직 노트가 없습니다.</p>
      ) : (
        <ul className={pages.notesList.list}>
          {notesWithPreview.map((note) => (
            <li key={note.id}>
              <Link to={`/notes/${note.id}`} className={pages.notesList.itemLink}>
                <h2 className={pages.notesList.itemTitle}>{note.title}</h2>

                <p className={pages.notesList.itemContent}>
                  {note.preview || "아직 내용이 비어 있습니다."}
                </p>

                {note.tags && note.tags.length > 0 && (
                  <div className={pages.notesList.tag}>
                    {note.tags.map((tag, idx) => (
                      <span key={idx} className={pill.tag}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotesListPage;