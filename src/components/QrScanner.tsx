"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface QrScannerProps {
  onResult: (result: string) => void;
  onClose: () => void;
}

export default function QrScanner({ onResult, onClose }: QrScannerProps) {
  const scannerRef = useRef<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const elementId = "qr-reader-container";

    const start = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");

        // Limpa o contêiner no DOM caso haja elementos de instâncias anteriores
        const container = document.getElementById(elementId);
        if (container) {
          container.innerHTML = "";
        }

        const scanner = new Html5Qrcode(elementId);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          async (decodedText: string) => {
            if (scannerRef.current) {
              try {
                if (scannerRef.current.isScanning) {
                  await scannerRef.current.stop();
                }
              } catch (e) {
                console.warn("Erro ao parar scanner:", e);
              }
            }
            try {
              const url = new URL(decodedText);
              const id = url.searchParams.get("id") || decodedText;
              onResult(id);
            } catch {
              onResult(decodedText);
            }
          },
          () => {}
        );

        if (!isMounted) {
          try {
            if (scanner.isScanning) {
              await scanner.stop();
            }
          } catch (e) {}
          try { scanner.clear(); } catch (e) {}
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Erro no scanner:", err);
          setError("Não foi possível acessar a câmera. Verifique as permissões.");
        }
      }
    };

    start();

    return () => {
      isMounted = false;
      if (scannerRef.current) {
        try {
          if (scannerRef.current.isScanning) {
            scannerRef.current.stop().then(() => {
              try { scannerRef.current?.clear(); } catch (e) {}
            }).catch(() => {});
          } else {
            try { scannerRef.current.clear(); } catch (e) {}
          }
        } catch (e) {}
      }
    };
  }, [onResult]);

  const handleClose = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
      } catch (e) {
        console.warn("Erro ao fechar scanner:", e);
      }
      try { scannerRef.current.clear(); } catch (e) {}
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-sm">
        <button
          onClick={handleClose}
          className="absolute -top-12 right-0 text-white/70 hover:text-white flex items-center gap-2 text-sm font-[family-name:var(--font-space)]"
        >
          <X size={20} /> Cancelar
        </button>

        <div className="bg-[#0b1525] rounded-2xl overflow-hidden border-2 border-[var(--lj-verde-neon)] p-4">
          <p className="text-center text-[var(--lj-verde-neon)] font-bold text-sm mb-4 font-[family-name:var(--font-space)] tracking-widest uppercase">
            Aponte para o QR Code do ingresso
          </p>

          {error ? (
            <div className="p-6 text-center text-red-400 text-sm font-[family-name:var(--font-space)]">{error}</div>
          ) : (
            <div className="relative rounded-xl overflow-hidden bg-black" style={{ minHeight: 280 }}>
              <style>{`
                #qr-reader-container {
                  width: 100% !important;
                  border: none !important;
                }
                #qr-reader-container video {
                  width: 100% !important;
                  max-height: 320px !important;
                  object-fit: cover !important;
                  border-radius: 12px !important;
                  display: block !important;
                }
                #qr-reader-container canvas {
                  display: none !important;
                }
                #qr-reader-container__scan_region {
                  background: transparent !important;
                }
                #qr-reader-container__dashboard {
                  display: none !important;
                }
              `}</style>
              <div id="qr-reader-container" />
            </div>
          )}

          <p className="text-center text-gray-500 text-xs mt-4 font-[family-name:var(--font-space)]">
            O scanner fecha automaticamente ao detectar o ingresso
          </p>
        </div>
      </div>
    </div>
  );
}
