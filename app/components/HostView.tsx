"use client";

import {useState, useEffect, useRef} from "react";
import QRious from "qrious";
import {Icon} from "@iconify/react";
import "../styles/animations.css";

export default function HostView() {
  const [availableNumbers, setAvailableNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize 1-100
  useEffect(() => {
    resetGame();
  }, []);

  // Generate QR Code with URL
  useEffect(() => {
    if (currentNumber !== null && qrCanvasRef.current) {
      const baseUrl = window.location.href.split("?")[0];
      const targetUrl = `${baseUrl}?n=${currentNumber}`;

      new QRious({
        element: qrCanvasRef.current,
        value: targetUrl,
        size: 250,
        level: "M",
        foreground: "#000000",
        background: "#ffffff",
      });
    }
  }, [currentNumber]);

  const resetGame = () => {
    const nums = Array.from({length: 100}, (_, i) => i + 1);
    setAvailableNumbers(nums);
    setCurrentNumber(null);
    setIsFinished(false);
  };

  const handleNext = () => {
    if (availableNumbers.length === 0) {
      setIsFinished(true);
      return;
    }
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const pickedNumber = availableNumbers[randomIndex];

    setCurrentNumber(pickedNumber);

    const newAvailable = availableNumbers.filter((n) => n !== pickedNumber);
    setAvailableNumbers(newAvailable);
  };

  const progress = ((100 - availableNumbers.length) / 100) * 100;

  return (
    <div className="flex flex-col items-center justify-center p-4 text-black">
      <div className="bg-white p-6 w-full max-w-md flex flex-col items-center space-y-6 relative overflow-hidden">
        {/* Status Bar */}
        <div className="w-full space-y-1">
          <div className="flex justify-between text-xs font-medium text-black">
            <span>使用済み: {100 - availableNumbers.length}</span>
            <span>残り: {availableNumbers.length}</span>
          </div>
          <div className="w-full bg-gray-200 h-3">
            <div
              className="bg-black h-full transition-all duration-500 ease-out"
              style={{width: `${progress}%`}}
            ></div>
          </div>
        </div>

        {/* QR Display */}
        <div className="flex flex-col items-center justify-center min-h-[280px] w-full bg-white relative">
          {isFinished ? (
            <div className="text-center p-4">
              <h2 className="text-3xl font-bold text-accent-red mb-2">
                🎉 終了!
              </h2>
              <p className="text-black">全ての番号が出ました</p>
            </div>
          ) : currentNumber ? (
            <div className="flex flex-col items-center animate-fade-in">
              <div className="bg-white p-2">
                <canvas ref={qrCanvasRef}></canvas>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 text-black/70">
              <Icon
                icon="mdi:qrcode"
                className="w-16 h-16 mx-auto mb-2 opacity-50"
              />
              <p>
                「次へ」を押して
                <br />
                QRコードを生成
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="w-full space-y-3 pt-2">
          <button
            onClick={handleNext}
            disabled={isFinished}
            className={`w-full py-4 text-white font-bold text-lg transform transition-all btn-press flex items-center justify-center gap-2
                    ${
                      isFinished
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black hover:bg-gray-800"
                    }`}
          >
            {availableNumbers.length === 100
              ? "🎄 スタート"
              : "🎁 次へ (新しい番号)"}
            <Icon icon="mdi:arrow-right" className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              if (confirm("リセットしますか?")) resetGame();
            }}
            className="w-full py-3 text-black bg-white hover:bg-gray-100 font-semibold text-sm transition-colors btn-press flex items-center justify-center gap-2"
          >
            <Icon icon="mdi:refresh" className="w-4 h-4" />
            リセット
          </button>
        </div>
      </div>
    </div>
  );
}
