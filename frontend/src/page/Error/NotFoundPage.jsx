import { Link } from "react-router-dom";
import { empty, text, btn } from "../../asset/style/uiClasses"; 

function NotFoundPage() {
  return (
    <div className={empty.centerWrap}>
      <h1 className={`${text.titleXl} mb-2`}>404</h1>

      <p className={`${text.bodySm} mb-4`}>
        해당 페이지를 찾을 수 없습니다.
      </p>

      <Link to="/notes" className={btn.primarySm}>
        노트 목록으로 돌아가기
      </Link>
    </div>
  );
}
export default NotFoundPage;