import React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white p-4 rounded-lg z-10 w-[90%] max-w-md">
        <button
          className="absolute top-2 right-2 text-black font-semibold hover:text-text-secondary focus:outline-none"
          onClick={onClose}
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;
