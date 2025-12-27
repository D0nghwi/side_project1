import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { pages, card, text, btn, form, alertBox } from "../../asset/style/uiClasses";
import TextEditor from "../../component/editor/TextEditor";
import { notesApi } from "../../api/notesApi";

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

        const res = await notesApi.get(id);
        const data = res.data;

        setTitle(data.title || "");
        setContent(data.content || "");
        setTagsInput(data.tags ? data.tags.join(", ") : "");
      } catch (err) {
        const msg =
          err?.response?.status === 404
            ? "해당 노트를 찾을 수 없습니다."
            : err?.response?.data?.detail || "노트 불러오기에 실패했습니다.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);
  
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
          ? tagsInput
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : null;
      
      const res = await notesApi.update(id, {
        title,
        content,
        tags,
      });
      
      const updated = res.data;

      navigate(`/notes/${updated.id}`);
    } catch (err) {
      const msg = err?.response?.data?.detail || "노트 수정에 실패했습니다.";
      setError(msg);
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
          <Link to="/notes" className={btn.linkBlue}>
            ← 노트 목록으로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={pages.noteForm.page}>
      <div className={pages.noteForm.header}>
        <h1 className={text.titleLg}>노트 수정</h1>
        <Link to={`/notes/${id}`} className={btn.linkBlue}>
          ← 상세 페이지로
        </Link>
      </div>

      {error && <div className={alertBox.error}>{error}</div>}

      <form
        onSubmit={handleSubmit}
        className={`${pages.noteForm.formCard} ${card.base}`}
      >
        <div>
          <label className={form.label}>제목</label>
          <input
            type="text"
            className={form.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
        </div>

        <div>
          <label className={form.label}>내용</label>
          <TextEditor value={content} onChange={setContent} />
        </div>

        <div>
          <label className={form.label}>태그 (쉼표로 구분)</label>
          <input
            type="text"
            className={form.input}
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="예: react, fastapi, memo"
          />
        </div>

        <div className={pages.noteForm.actions}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={btn.cancel}
          >
            취소
          </button>

          <button
            type="submit"
            disabled={saving}
            className={btn.submit}
          >
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NoteEditPage;