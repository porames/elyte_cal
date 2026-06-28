import { ReactNode } from "react";

interface PopupProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

export default function Popup({ open, onClose, title, children }: PopupProps) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg p-4 max-w-sm shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                {title && <p className="font-bold mb-2">{title}</p>}
                <div className="text-sm">{children}</div>
                <button
                    className="mt-3 px-3 py-1 bg-blue-600 text-white rounded"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}