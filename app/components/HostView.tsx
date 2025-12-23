"use client";

import {useState, useEffect, useRef} from "react";
import QRious from "qrious";
import {IconQrCode, IconArrowRight, IconRotateCcw} from "./Icons";
import {useSocket} from "../hooks/useSocket";
import "../styles/animations.css";

export default function HostView() {
  const [availableNumbers, setAvailableNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  const {isConnected, participants, resetGame: socketResetGame, onQRScannedNotification} = useSocket();

  // Initialize 1-100
  useEffect(() => {
    resetGame();
  }, []);

  // Listen for QR scanned notifications
  useEffect(() => {
    const cleanup = onQRScannedNotification?.((data) => {
      console.log('QR scanned notification received:', data);
      // Automatically generate next QR code
      handleNext();
    });

    return cleanup;
  }, [availableNumbers]);

  // Generate QR Code with URL
  useEffect(() => {
    if (currentNumber !== null && qrCanvasRef.current) {
      // Build the URL for the current page + query parameter
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
    socketResetGame?.();
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gradient-bg text-gray-800">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md card-shadow flex flex-col items-center space-y-6 relative overflow-hidden">
        <header className="w-full text-center border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-700 tracking-wider">
            Party Lottery
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            QRコードを読み取ると番号ページが開きます
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-xs text-gray-500">
              {isConnected ? 'リアルタイム接続中' : '接続待機中...'}
            </span>
          </div>
        </header>

        {/* Status Bar */}
        <div className="w-full space-y-1">
          <div className="flex justify-between text-xs font-medium text-gray-500">
            <span>使用済み: {100 - availableNumbers.length}</span>
            <span>残り: {availableNumbers.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-purple-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{width: `${progress}%`}}
            ></div>
          </div>
        </div>

        {/* QR Display */}
        <div className="flex flex-col items-center justify-center min-h-[280px] w-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 relative">
          {isFinished ? (
            <div className="text-center p-4">
              <h2 className="text-3xl font-bold text-purple-600 mb-2">終了!</h2>
              <p className="text-gray-500">全ての番号が出ました</p>
            </div>
          ) : currentNumber ? (
            <div className="flex flex-col items-center animate-fade-in">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <canvas ref={qrCanvasRef} className="rounded"></canvas>
              </div>
              <p className="mt-4 text-sm font-semibold text-gray-400">
                スキャンすると自動で次へ
              </p>
              <details className="mt-2 text-xs text-gray-400 cursor-pointer">
                <summary className="list-none text-center hover:text-purple-600 transition-colors">
                  (ホスト用確認: {currentNumber})
                </summary>
              </details>
            </div>
          ) : (
            <div className="text-center p-8 text-gray-400">
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
                        : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-200"
                    }`}
          >
            {availableNumbers.length === 100 ? "スタート" : "次へ (新しい番号)"}
            <IconArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              if (confirm("リセットしますか?")) resetGame();
            }}
            className="w-full py-3 rounded-xl text-gray-500 bg-gray-100 hover:bg-gray-200 font-semibold text-sm transition-colors btn-press flex items-center justify-center gap-2"
          >
            <IconRotateCcw className="w-4 h-4" />
            リセット
          </button>
        </div>
      </div>

      {/* Participants List */}
      <div className="mt-6 w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 card-shadow">
          <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center justify-between">
            <span>参加者一覧</span>
            <span className="text-sm font-normal text-gray-500">
              {participants.length}人
            </span>
          </h3>

          {participants.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">
              まだ参加者がいません
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
              {participants
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((participant) => (
                  <div
                    key={participant.number}
                    className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3 animate-fade-in"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
                        {participant.number}
                      </div>
                      <span className="font-medium text-gray-800">
                        {participant.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(participant.timestamp).toLocaleTimeString('ja-JP', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
