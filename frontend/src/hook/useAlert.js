import { useCallback, useMemo, useState } from "react";
import AlertModal from "../component/modal/AlertModal";

export function useAlert() {
  const [state, setState] = useState({
    open: false,
    title: "알림",
    message: "",
  });

  const alert = useCallback((message, options = {}) => {
    const { title = "알림" } = options;
    setState({
      open: true,
      title,
      message: message ?? "",
    });
  }, []);

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const AlertRenderer = useMemo(() => {
    function Renderer() {
      return (
        <AlertModal
          open={state.open}
          title={state.title}
          message={state.message}
          onClose={close}
        />
      );
    }
    return Renderer;
  }, [state.open, state.title, state.message, close]);

  return { alert, AlertRenderer };
}
