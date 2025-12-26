"use client";

import {useState, useEffect, useRef} from "react";
import QRious from "qrious";
import {Icon} from "@iconify/react";
import "../styles/animations.css";

interface UserAssignment {
  name: string;
  number: number;
}

interface QRDistributionViewProps {
  userNames: string[];
  onComplete: (assignments: UserAssignment[]) => void;
}

export default function QRDistributionView({
  userNames,
  onComplete,
}: QRDistributionViewProps) {
  const [assignments, setAssignments] = useState<UserAssignment[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [availableNumbers, setAvailableNumbers] = useState<number[]>([]);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize available numbers
  useEffect(() => {
    const nums = Array.from({length: 100}, (_, i) => i + 1);
    setAvailableNumbers(nums);
  }, []);

  // Generate QR Code
  useEffect(() => {
    if (assignments[currentIndex] && qrCanvasRef.current) {
      const baseUrl = window.location.href.split("?")[0];
      const targetUrl = `${baseUrl}?n=${assignments[currentIndex].number}`;

      new QRious({
        element: qrCanvasRef.current,
        value: targetUrl,
        size: 250,
        level: "M",
        foreground: "#000000",
        background: "#ffffff",
      });
    }
  }, [currentIndex, assignments]);

  // Auto-assign numbers when component mounts or when moving to a new user
  useEffect(() => {
    // If current user doesn't have an assignment yet, assign one
    if (!assignments[currentIndex] && availableNumbers.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const pickedNumber = availableNumbers[randomIndex];

      const newAssignment: UserAssignment = {
        name: userNames[currentIndex],
        number: pickedNumber,
      };

      setAssignments((prev) => {
        const updated = [...prev];
        updated[currentIndex] = newAssignment;
        return updated;
      });
      setAvailableNumbers((prev) => prev.filter((n) => n !== pickedNumber));
    }
  }, [currentIndex, assignments, availableNumbers, userNames]);

  const handleNext = () => {
    if (currentIndex < userNames.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFinish = () => {
    onComplete(assignments.filter((a) => a !== undefined));
  };

  const currentUser = userNames[currentIndex];
  const currentAssignment = assignments[currentIndex];
  const isAssigned = currentAssignment !== undefined;
  const isLastUser = currentIndex === userNames.length - 1;
  const allAssigned = assignments.filter((a) => a !== undefined).length === userNames.length;

  return (
    <div className="flex flex-col items-center justify-center p-4 text-black">
      <div className="bg-white p-6 w-full max-w-md flex flex-col items-center space-y-6">
        {/* Progress Bar */}
        <div className="w-full space-y-1">
          <div className="flex justify-between text-xs font-medium text-black">
            <span>
              進行: {currentIndex + 1} / {userNames.length}
            </span>
            <span>配布済み: {assignments.length}</span>
          </div>
          <div className="w-full bg-gray-200 h-3">
            <div
              className="bg-black h-full transition-all duration-500 ease-out"
              style={{
                width: `${(assignments.length / userNames.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* User Name Display */}
        <div className="w-full text-center py-4 bg-black text-white">
          <div className="text-sm font-medium mb-1">参加者</div>
          <div className="text-2xl font-bold">{currentUser}さん</div>
        </div>

        {/* QR Display */}
        <div className="flex flex-col items-center justify-center min-h-[280px] w-full bg-white relative">
          {isAssigned ? (
            <div className="flex flex-col items-center animate-fade-in">
              <div className="bg-white p-2">
                <canvas ref={qrCanvasRef}></canvas>
              </div>
              <div className="mt-4 text-sm text-black/70">
                QRコードをスキャンしてください
              </div>
            </div>
          ) : (
            <div className="text-center p-8 text-black/70">
              <Icon
                icon="mdi:qrcode"
                className="w-16 h-16 mx-auto mb-2 opacity-50 animate-pulse"
              />
              <p>QRコードを生成中...</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="w-full space-y-3 pt-2">
          <div className="flex gap-3">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`flex-1 py-4 font-bold text-lg transform transition-all btn-press flex items-center justify-center gap-2
                ${
                  currentIndex === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-white text-black border-2 border-black hover:bg-gray-100"
                }`}
            >
              <Icon icon="mdi:arrow-left" className="w-5 h-5" />
              前へ
            </button>

            {!isLastUser ? (
              <button
                onClick={handleNext}
                disabled={!isAssigned}
                className={`flex-1 py-4 font-bold text-lg transform transition-all btn-press flex items-center justify-center gap-2
                  ${
                    !isAssigned
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "text-white bg-black hover:bg-gray-800"
                  }`}
              >
                次へ
                <Icon icon="mdi:arrow-right" className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!allAssigned}
                className={`flex-1 py-4 font-bold text-lg transform transition-all btn-press flex items-center justify-center gap-2
                  ${
                    !allAssigned
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "text-white bg-black hover:bg-gray-800"
                  }`}
              >
                🎉 完了
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
