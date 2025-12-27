import ModalBase from "./ModalBase";
import { card, text, btn } from "../../asset/style/uiClasses";

function ConfirmModal({
  open,
  title = "확인",
  message,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
  disabled = false,
}) {
  return (
    <ModalBase open={open} onClose={disabled ? () => {} : onCancel}>
      <div className={card.base}>
        <h2 className={text.sectionTitle}>{title}</h2>
        <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">{message}</p>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className={btn.cancel}
            disabled={disabled}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={btn.submit}
            disabled={disabled}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </ModalBase>
  );
}

export default ConfirmModal;
