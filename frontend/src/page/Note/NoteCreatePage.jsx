import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { pages, card, text, btn, form, alertBox } from "../../asset/style/uiClasses"; 
import TextEditor from "../../component/editor/TextEditor";

function NoteCreatePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState(""); // 노트 제목
  const [content, setContent] = useState(""); // 노트 본문
  const [tagsInput, setTagsInput] = useState(""); // 콤마 구분 태그 입력
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); 

  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 submit 시 페이지 새로고침 방지
    setError(null);

    if (!title.trim()) {
      setError("제목은 필수입니다.");
      return;
    }

    try {
      setLoading(true);

      const trimmed = tagsInput.trim();
      
      const tags =
        trimmed !== ""
          ? trimmed
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag.length > 0)
          : null; // 빈 문자열인 경우 null로 설정
      
      const payload = {
        title,
        content,
        tags, // null 또는 string
      };

      //디버깅용 JSON 출력 : console.log("POST /notes payload:", payload);
      const response = await fetch("http://localhost:8000/notes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("노트 생성에 실패했습니다.");
      }

      const createdNote = await response.json();

      // 생성 후 해당 노트 상세 페이지로 이동
      navigate(`/notes/${createdNote.id}`);
    } catch (err) {
      setError(err.message || "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={pages.noteForm.page}>
      <div className={pages.noteForm.header}>
        <h1 className={text.titleLg}>새 노트 작성</h1>
        <Link to="/" className={btn.linkBlue}>
          ← 노트 목록으로
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
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={btn.cancel}
          >
            취소
          </button>
          
          <button type="submit" disabled={loading} className={btn.submit}>
            {loading ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NoteCreatePage;
