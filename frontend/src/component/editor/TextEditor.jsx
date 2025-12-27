import { EditorContent } from "@tiptap/react";
import { card, btn, form, text } from "../../asset/style/uiClasses";
import { useTextEditor } from "../../hooks/useTextEditor";

function Toolbar({ editor }) {
  if (!editor) return null;

  const baseBtn = `${btn.outlineBase} ${btn.outlineGray}`;
  const activeBtn = `${btn.outlineBase} ${btn.outlineBlue}`;

  const setFontSize = (px) => {
    editor.chain().focus().setMark("textStyle", { fontSize: px }).run();
  };

  return (
    <div className={`${card.base} ${card.bordered} p-2 flex flex-wrap gap-2 items-center`}>
      <button
        type="button"
        className={editor.isActive("bold") ? activeBtn : baseBtn}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        Bold
      </button>

      <button
        type="button"
        className={editor.isActive("italic") ? activeBtn : baseBtn}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        Italic
      </button>

      <button
        type="button"
        className={editor.isActive("underline") ? activeBtn : baseBtn}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        Underline
      </button>

      <button
        type="button"
        className={editor.isActive("highlight") ? activeBtn : baseBtn}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      >
        Highlight
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <label className={text.mutedXs}>색</label>
      <input
        type="color"
        className="w-8 h-8 p-0 border rounded"
        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        aria-label="text color"
      />

      <label className={`${text.mutedXs} ml-2`}>크기</label>
      <select
        className="border rounded-md px-2 py-1 text-sm"
        defaultValue=""
        onChange={(e) => {
          if (!e.target.value) return;
          setFontSize(e.target.value);
        }}
      >
        <option value="" disabled>
          선택
        </option>
        <option value="12px">12</option>
        <option value="14px">14</option>
        <option value="16px">16</option>
        <option value="18px">18</option>
        <option value="24px">24</option>
        <option value="32px">32</option>
      </select>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <button
        type="button"
        className={baseBtn}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        Left
      </button>
      <button
        type="button"
        className={baseBtn}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        Center
      </button>
      <button
        type="button"
        className={baseBtn}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        Right
      </button>

      <div className="flex-1" />

      <button
        type="button"
        className={`${btn.outlineBase} ${btn.outlineRed}`}
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
      >
        Reset
      </button>
    </div>
  );
}

export default function TextEditor({
  value,
  onChange, 
  placeholder = "노트 내용을 적어주세요.",
  minHeight = 260,
}) {
  const { editor } = useTextEditor({
    value,
    onChange,
    placeholder,
    minHeight,
    className: `${form.textarea} h-auto`,
  });

  return (
    <div className="space-y-2">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
