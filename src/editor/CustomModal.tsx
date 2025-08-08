import React from "react";

interface CustomModalProps {
  open: boolean;
  title: React.ReactNode;
  children: React.ReactNode;
  close: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  title,
  children,
  close,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={close}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
        <div className="p-4 overflow-auto flex-grow">{children}</div>
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={close}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;