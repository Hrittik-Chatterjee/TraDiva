"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface ModalOptions {
  title: string;
  message: string;
  type?: "confirm" | "notice" | "alert";
  confirmText?: string;
  cancelText?: string;
  actionText?: string;
  confirmVariant?: "danger" | "primary" | "warning";
  onConfirm?: () => Promise<void> | void;
  onAction?: () => Promise<void> | void;
  onCancel?: () => void;
}

interface ModalContextType {
  showModal: (options: ModalOptions) => void;
  confirm: (options: Omit<ModalOptions, "type">) => void;
  notice: (options: Omit<ModalOptions, "type">) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalOptions, setModalOptions] = useState<ModalOptions | null>(null);
  const [loading, setLoading] = useState(false);

  function showModal(options: ModalOptions) {
    setModalOptions(options);
  }

  function confirm(options: Omit<ModalOptions, "type">) {
    setModalOptions({ ...options, type: "confirm" });
  }

  function notice(options: Omit<ModalOptions, "type">) {
    setModalOptions({ ...options, type: "notice" });
  }

  function hideModal() {
    if (loading) return;
    setModalOptions(null);
  }

  async function handleConfirm() {
    if (!modalOptions?.onConfirm) return;
    const currentOnConfirm = modalOptions.onConfirm;
    setLoading(true);
    try {
      await currentOnConfirm();
    } finally {
      setLoading(false);
    }
  }

  async function handleAction() {
    if (!modalOptions?.onAction) return;
    setLoading(true);
    try {
      await modalOptions.onAction();
    } finally {
      setLoading(false);
      setModalOptions(null);
    }
  }

  return (
    <ModalContext.Provider value={{ showModal, confirm, notice, hideModal }}>
      {children}

      {/* Global Brand Modal Backdrop & Container */}
      {modalOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in select-none">
          <div className="relative w-full max-w-md bg-canvas border border-light-pink rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 transform transition-all scale-100 animate-scale-up">
            
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-dark-pink bg-lightest-pink px-3 py-1 rounded-full border border-light-pink">
                  {modalOptions.type === "confirm" ? "Confirmation" : modalOptions.type === "notice" ? "Notice" : "Alert"}
                </span>
                <button
                  type="button"
                  onClick={hideModal}
                  disabled={loading}
                  className="w-8 h-8 rounded-full bg-lightest-pink/30 hover:bg-lightest-pink text-ink flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <h3 className="text-xl font-bold tracking-tight text-ink">
                {modalOptions.title}
              </h3>
            </div>

            {/* Content Message */}
            <p className="text-xs md:text-sm text-steel leading-relaxed">
              {modalOptions.message}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-lightest-pink">
              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => {
                  if (modalOptions.onCancel) modalOptions.onCancel();
                  hideModal();
                }}
                disabled={loading}
                className="h-10 px-6 rounded-full border border-light-pink text-xs font-semibold text-ink bg-white hover:bg-lightest-pink/60 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {modalOptions.cancelText || (modalOptions.type === "notice" ? "Close" : "Cancel")}
              </button>

              {/* Confirm / Delete Button */}
              {modalOptions.type === "confirm" && modalOptions.onConfirm && (
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={loading}
                  className={`h-10 px-6 rounded-full text-xs font-bold text-white shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer ${
                    modalOptions.confirmVariant === "danger"
                      ? "bg-[#c93838] hover:bg-[#a82a2a]"
                      : "bg-[#7a1c4b] hover:bg-[#5e1438]"
                  }`}
                >
                  {loading ? "Processing..." : modalOptions.confirmText || "Confirm"}
                </button>
              )}

              {/* Notice Action Button (e.g. Quick Hide) */}
              {modalOptions.type === "notice" && modalOptions.onAction && (
                <button
                  type="button"
                  onClick={handleAction}
                  disabled={loading}
                  className="h-10 px-6 rounded-full text-xs font-bold text-[#4a122c] bg-[#ffea79] hover:bg-[#ffe066] shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Updating..." : modalOptions.actionText || "Action"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
