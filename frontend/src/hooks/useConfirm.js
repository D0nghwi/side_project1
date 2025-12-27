import { useCallback, useMemo, useState } from "react";
import ConfirmModal from "../component/modal/ConfirmModal";

export function useConfirm() {
  const [state, setState] = useState({
    open: false,
    title: "확인",
    message: "",
    confirmText: "확인",
    cancelText: "취소",
    disabled: false,
  });

  const [resolver, setResolver] = useState(null);

  const confirm = useCallback((message, options = {}) => {
    const {
      title = "확인",
      confirmText = "확인",
      cancelText = "취소",
    } = options;

    setState({
      open: true,
      title,
      message: message ?? "",
      confirmText,
      cancelText,
      disabled: false,
    });

    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, open: false, disabled: false }));
  }, []);

  const onCancel = useCallback(() => {
    if (resolver) resolver(false);
    setResolver(null);
    close();
  }, [resolver, close]);

  const onConfirm = useCallback(() => {
    if (resolver) resolver(true);
    setResolver(null);
    close();
  }, [resolver, close]);


  const setConfirmDisabled = useCallback((disabled) => {
    setState((prev) => ({ ...prev, disabled: !!disabled }));
  }, []);

  const ConfirmRenderer = useMemo(() => {
    function Renderer() {
      return (
        <ConfirmModal
          open={state.open}
          title={state.title}
          message={state.message}
          confirmText={state.confirmText}
          cancelText={state.cancelText}
          disabled={state.disabled}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      );
    }
    return Renderer;
  }, [
    state.open,
    state.title,
    state.message,
    state.confirmText,
    state.cancelText,
    state.disabled,
    onCancel,
    onConfirm,
  ]);

  return { confirm, setConfirmDisabled, ConfirmRenderer };
}
