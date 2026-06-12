function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  confirming = false,
  danger = false
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="confirm-modal__backdrop" role="presentation" onClick={confirming ? undefined : onCancel}>
      <section
        className="confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="confirm-modal__title" id="confirm-modal-title">
          {title}
        </h3>
        {message ? <p className="confirm-modal__message">{message}</p> : null}

        <div className="confirm-modal__actions">
          <button
            type="button"
            className="confirm-modal__btn confirm-modal__btn--secondary"
            onClick={onCancel}
            disabled={confirming}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`confirm-modal__btn${danger ? ' confirm-modal__btn--danger' : ''}`}
            onClick={onConfirm}
            disabled={confirming}
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}

export default ConfirmModal;