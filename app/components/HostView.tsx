"use client";

import {useState, useEffect, useRef} from "react";
import QRious from "qrious";
import {IconQrCode, IconArrowRight, IconRotateCcw} from "./Icons";
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 christmas-bg text-gray-800">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md card-shadow flex flex-col items-center space-y-6 relative overflow-hidden">
        <header className="w-full text-center border-b border-red-100 pb-4">
          <h1 className="text-2xl font-bold text-red-600 tracking-wider">
            🎄 Christmas Lottery 🎅
          </h1>
          <p className="text-xs text-green-600 mt-1">
            {typeof window !== "undefined" &&
            window.location.protocol === "file:"
              ? "⚠️ ローカルファイルです。スマホで読み取るにはWebサーバーにアップしてください"
              : "QRコードを読み取ると番号ページが開きます"}
          </p>
        </header>

        {/* Status Bar */}
        <div className="w-full space-y-1">
          <div className="flex justify-between text-xs font-medium text-gray-600">
            <span>使用済み: {100 - availableNumbers.length}</span>
            <span>残り: {availableNumbers.length}</span>
          </div>
          <div className="w-full bg-green-100 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-red-500 to-green-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{width: `${progress}%`}}
            ></div>
          </div>
        </div>

        {/* QR Display */}
        <div className="flex flex-col items-center justify-center min-h-[280px] w-full bg-red-50 rounded-xl border-2 border-dashed border-red-200 relative">
          {isFinished ? (
            <div className="text-center p-4">
              <h2 className="text-3xl font-bold text-red-600 mb-2">🎉 終了!</h2>
              <p className="text-green-600">全ての番号が出ました</p>
            </div>
          ) : currentNumber ? (
            <div className="flex flex-col items-center animate-fade-in">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <canvas ref={qrCanvasRef} className="rounded"></canvas>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 text-red-400">
              <IconQrCode className="w-16 h-16 mx-auto mb-2 opacity-50" />
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
            className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all btn-press flex items-center justify-center gap-2
                    ${
                      isFinished
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 shadow-red-200"
                    }`}
          >
            {availableNumbers.length === 100 ? "🎄 スタート" : "🎁 次へ (新しい番号)"}
            <IconArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              if (confirm("リセットしますか?")) resetGame();
            }}
            className="w-full py-3 rounded-xl text-green-700 bg-green-50 hover:bg-green-100 font-semibold text-sm transition-colors btn-press flex items-center justify-center gap-2 border border-green-200"
          >
            <IconRotateCcw className="w-4 h-4" />
            リセット
          </button>
        </div>
      </div>
    </div>
  );
}
