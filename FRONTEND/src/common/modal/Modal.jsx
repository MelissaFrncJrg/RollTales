import React from "react";
import "./modal.css";

const Modal = ({
  title,
  content,
  children,
  onConfirm,
  onCancel,
  confirmText = "Confirmer",
  cancelText = "Annuler",
}) => {
  return (
    <div className="modal-form container">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
          <div className="underline"></div>
        </div>
        <div className="modal-text">{content || children}</div>
        <div className="modal-choices">
          <button className="submit btn" onClick={onConfirm}>
            {confirmText}
          </button>
          <button className=" cancel btn" onClick={onCancel}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
