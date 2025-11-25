// src/pages/NotesListPage.jsx
import { useEffect, useState } from "react";

function NotesListPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        setError(null);

        // 백엔드 API 엔드포인트
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
    return <div className="p-4 text-red-500">에러 발생: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">노트 목록</h1>

      {notes.length === 0 ? (
        <p className="text-gray-500">아직 노트가 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li
              key={note.id}
              className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
            >
              <h2 className="font-semibold">{note.title}</h2>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{note.content}</p>

              {note.tags && note.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {note.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotesListPage;
