import ModalBase from "./ModalBase";
import { card, text, btn } from "../../asset/style/uiClasses";

function AlertModal({ open, title = "알림", message, onClose }) {
  return (
    <ModalBase open={open} onClose={onClose}>
      <div className={card.base}>
        <h2 className={text.sectionTitle}>{title}</h2>
        <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">{message}</p>

        <div className="mt-5 flex justify-end">
          <button type="button" onClick={onClose} className={btn.submit}>
            확인
          </button>
        </div>
      </div>
    </ModalBase>
  );
}

export default AlertModal;
