import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pages, btn, pill, text } from "../../asset/style/uiClasses";

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

      {notes.length === 0 ? (
        <p className="text-gray-500">아직 노트가 없습니다.</p>
      ) : (
        <ul className={pages.notesList.list}>
          {notes.map((note) => (
            <li key={note.id}>
              <Link
                to={`/notes/${note.id}`}
                className={pages.notesList.itemLink}
              >
                <h2 className={pages.notesList.itemTitle}>{note.title}</h2>

                <p className={pages.notesList.itemContent}>
                  {note.content}
                </p>

                {note.tags && note.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
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
