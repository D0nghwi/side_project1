import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { pages, card, text, btn, form, alertBox } from "../../asset/style/uiClasses";
import TextEditor from "../../component/editor/TextEditor";
import { notesApi } from "../../api/notesApi";
import { useAsync } from "../../hooks/useAsync";
import { useApiError } from "../../hooks/useApiError";

function NoteEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const { getErrorMessage, isNotFound } = useApiError();

  const loadReq = useAsync(); // 초기 로딩
  const saveReq = useAsync(); // 저장

  // 기존 노트 데이터 불러오기
 useEffect(() => {
    loadReq.run(
      async () => {
        const res = await notesApi.get(id);
        return res.data;
      },
      {
        onSuccess: (data) => {
          setTitle(data.title || "");
          setContent(data.content || "");
          setTagsInput(data.tags ? data.tags.join(", ") : "");
        },
      }
    );
  }, [id]);

  const loadErrorText = useMemo(() => {
    if (!loadReq.error) return null;
    if (isNotFound(loadReq.error)) return "해당 노트를 찾을 수 없습니다.";
    return getErrorMessage(loadReq.error, "노트 불러오기에 실패했습니다.");
  }, [loadReq.error, isNotFound, getErrorMessage]);

  const saveErrorText = useMemo(() => {
    if (!saveReq.error) return null;
    return getErrorMessage(saveReq.error, "노트 수정에 실패했습니다.");
  }, [saveReq.error, getErrorMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      saveReq.setError(new Error("제목은 필수입니다."));
      return;
    }

    const tags =
      tagsInput.trim().length > 0
        ? tagsInput
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : null;

    await saveReq.run(
      async () => {
        const res = await notesApi.update(id, {
          title,
          content,
          tags,
        });
        return res.data;
      },
      {
        onSuccess: (updated) => {
          navigate(`/notes/${updated.id}`);
        },
      }
    );
  };

  if (loadReq.loading) {
    return <div className="p-4">노트 불러오는 중...</div>;
  }

  if (loadErrorText && !saveReq.loading) {
    return (
      <div className="p-4 text-red-500">
        에러: {loadErrorText}
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

      {saveErrorText && <div className={alertBox.error}>{saveErrorText}</div>}

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
          <button type="button" onClick={() => navigate(-1)} className={btn.cancel}>
            취소
          </button>

          <button type="submit" disabled={saveReq.loading} className={btn.submit}>
            {saveReq.loading ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NoteEditPage;