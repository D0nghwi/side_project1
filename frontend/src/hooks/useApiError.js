export function useApiError() {
  const getStatus = (err) => err?.response?.status;

  const getErrorMessage = (err, fallback = "요청 처리 중 오류가 발생했습니다.") => {
    // {"detail": "..."}
    const detail = err?.response?.data?.detail;
    if (typeof detail === "string" && detail.trim()) return detail;

    // {"message": "..."} 형태
    const message = err?.response?.data?.message;
    if (typeof message === "string" && message.trim()) return message;

    // axios 자체 메시지
    if (typeof err?.message === "string" && err.message.trim()) return err.message;

    return fallback;
  };

  const isNotFound = (err) => getStatus(err) === 404;

  return { getStatus, getErrorMessage, isNotFound };
}
