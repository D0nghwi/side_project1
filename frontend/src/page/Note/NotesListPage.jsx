import { useEffect, useState, useMemo} from "react";
import { Link } from "react-router-dom";
import { pages, btn, pill, text } from "../../asset/style/uiClasses";

const htmlToText = (html) => {
  if (!html) return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || "").replace(/\s+/g, " ").trim();
};


function NotesListPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:8000/notes");
        if (!response.ok) {
          throw new Error("서버 요청 실패");
        }

        const data = await response.json();
        setNotes(data);
      } catch (err) {
        setError(err.message || "알 수 없는 오류");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const notesWithPreview = useMemo(() => {
    return notes.map((n) => ({
      ...n,
      preview: htmlToText(n.content),
    }));
  }, [notes]);

  if (loading) {
    return <div className="p-4">노트 목록 불러오는 중...</div>;
  }

  if (error) {
    return <div className={text.error}>에러 발생: {error}</div>;
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