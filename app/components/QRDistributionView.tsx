"use client";

import {useState, useEffect} from "react";
import QRious from "qrious";
import {Icon} from "@iconify/react";
import "../styles/animations.css";

interface UserAssignment {
  name: string;
  number: number;
}

interface QRDistributionViewProps {
  userNames: string[];
  onAssignmentsChange?: (assignments: UserAssignment[]) => void;
  onUserAdd: (userName: string) => void;
}

export default function QRDistributionView({
  userNames,
  onAssignmentsChange,
  onUserAdd,
}: QRDistributionViewProps) {
  const [assignments, setAssignments] = useState<UserAssignment[]>([]);
  const [availableNumbers, setAvailableNumbers] = useState<number[]>([]);
  const [currentName, setCurrentName] = useState("");

  // Initialize available numbers only once
  useEffect(() => {
    const nums = Array.from({length: 100}, (_, i) => i + 1);
    setAvailableNumbers(nums);
  }, []);

  // Auto-assign numbers to new users only
  useEffect(() => {
    if (userNames.length === 0) return;
    if (availableNumbers.length === 0) return;

    // Check if there are new users that need assignments
    const needsAssignment = userNames.length > assignments.length;
    if (!needsAssignment) return;

    const newAssignments = [...assignments];
    const newAvailableNumbers = [...availableNumbers];

    // Only assign numbers to new users (from assignments.length onwards)
    for (let index = assignments.length; index < userNames.length; index++) {
      if (newAvailableNumbers.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * newAvailableNumbers.length
        );
        const pickedNumber = newAvailableNumbers[randomIndex];

        newAssignments[index] = {
          name: userNames[index],
          number: pickedNumber,
        };

        newAvailableNumbers.splice(randomIndex, 1);
      }
    }

    setAssignments(newAssignments);
    setAvailableNumbers(newAvailableNumbers);
  }, [userNames.length, availableNumbers.length]);

  // Generate QR codes for all users
  useEffect(() => {
    assignments.forEach((assignment, index) => {
      const canvas = document.getElementById(
        `qr-canvas-${index}`
      ) as HTMLCanvasElement;
      if (canvas && assignment) {
        const baseUrl = window.location.href.split("?")[0];
        const targetUrl = `${baseUrl}?n=${assignment.number}`;

        new QRious({
          element: canvas,
          value: targetUrl,
          size: 200,
          level: "M",
          foreground: "#000000",
          background: "#ffffff",
        });
      }
    });

    // Notify parent of assignments change
    if (onAssignmentsChange && assignments.length > 0) {
      onAssignmentsChange(assignments);
    }
  }, [assignments, onAssignmentsChange]);

  const handleAddUser = () => {
    if (currentName.trim() !== "") {
      onUserAdd(currentName.trim());
      setCurrentName("");
    }
  };

  return (
    <div className="h-full flex flex-col p-8">
      {/* QR Code Grid - 3 Column Layout with Input Card */}
      <div className="grid grid-cols-3 gap-4 overflow-y-auto">
        {/* Input Card - First position */}
        <div className="flex flex-col items-center justify-center border-2 border-black p-4 bg-white aspect-square">
          <div className="w-full flex flex-col gap-3">
            <input
              type="text"
              value={currentName}
              onChange={(e) => setCurrentName(e.target.value)}
              placeholder="名前を入力"
              className="w-full px-3 py-2 border-2 border-black/20 focus:border-black outline-none text-black text-sm transition-colors"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddUser();
                }
              }}
            />
            <button
              onClick={handleAddUser}
              className="w-full py-2 bg-black text-white hover:bg-gray-800 font-medium transition-all flex items-center justify-center gap-2"
            >
              <Icon icon="mdi:plus" className="w-4 h-4" />
              追加
            </button>
          </div>
        </div>

        {/* QR Code Cards */}
        {userNames.map((name, index) => {
          const assignment = assignments[index];
          return (
            <div
              key={index}
              className="relative flex flex-col items-center border-2 border-black bg-white aspect-square overflow-hidden group"
            >
              {/* Name Badge */}
              <div className="absolute top-0 left-0 right-0 bg-black text-white px-3 py-2 text-center">
                <div className="text-s font-bold uppercase tracking-wider">
                  {name}
                </div>
              </div>

              {/* QR Code Area */}
              {assignment ? (
                <div className="flex-1 flex flex-col items-center justify-center pt-10 pb-4 px-4">
                  <div className="bg-white p-2 border border-black/10">
                    <canvas id={`qr-canvas-${index}`}></canvas>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center pt-10">
                  <div className="flex flex-col items-center gap-2">
                    <Icon
                      icon="mdi:loading"
                      className="w-8 h-8 animate-spin text-black/30"
                    />
                    <div className="text-xs text-black/30">生成中</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
