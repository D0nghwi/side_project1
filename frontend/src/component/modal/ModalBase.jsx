function ModalBase({ open, onClose, children }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative w-full max-w-md">
                {children}
            </div>
        </div>
    );
}

export default ModalBase;
