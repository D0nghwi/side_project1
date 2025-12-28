import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { pages, card, text, btn, form, alertBox } from "../../asset/style/uiClasses"; 
import TextEditor from "../../component/editor/TextEditor";
import { notesApi } from "../../api/notesApi";
import { useAsync } from "../../hook/useAsync";
import { useApiError } from "../../hook/useApiError";
import { useAlert } from "../../hook/useAlert"

function NoteCreatePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState(""); // 노트 제목
  const [content, setContent] = useState(""); // 노트 본문
  const [tagsInput, setTagsInput] = useState(""); // 콤마 구분 태그 입력
  
  const createReq = useAsync();
  const { getErrorMessage } = useApiError();
  
  const { alert, AlertRenderer } = useAlert();
  
  const errorText = useMemo(() => {
    if (!createReq.error) return null;
    return getErrorMessage(createReq.error, "노트 생성에 실패했습니다.");
  }, [createReq.error, getErrorMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 submit 시 페이지 새로고침 방지

    if (!title.trim()) {
      createReq.setError(new Error("제목은 필수입니다."));

      alert("제목은 필수입니다.", { title: "입력 오류" });
      return;
    }

    const trimmed = tagsInput.trim();
    const tags =
      trimmed !== ""
        ? trimmed
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
        : null;

    const payload = {
      title,
      content,
      tags,
    };

    await createReq.run(
      async () => {
        const res = await notesApi.create(payload);
        return res.data;
      },
      {
        onSuccess: (data) => {
          navigate(`/notes/${data.id}`);
        },
        onError: (err) => {
          const msg = getErrorMessage(err, "노트 생성에 실패했습니다.");
          alert(msg, { title: "생성 실패" });
        },
      }
    );
  };

  return (
    <>
      <div className={pages.noteForm.page}>
        <div className={pages.noteForm.header}>
          <h1 className={text.titleLg}>새 노트 작성</h1>
          <Link to="/" className={btn.linkBlue}>
            ← 노트 목록으로
          </Link>
        </div>

        {errorText && <div className={alertBox.error}>{errorText}</div>}

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
              placeholder="예: 리액트 공부 노트"
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
            
            <button type="submit" disabled={createReq.loading} className={btn.submit}>
              {createReq.loading ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
      <AlertRenderer />
    </>
  );
}

export default NoteCreatePage;