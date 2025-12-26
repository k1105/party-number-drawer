"use client";

import React, {useState} from "react";
import {Icon} from "@iconify/react";
import "../styles/animations.css";

interface UserAssignment {
  name: string;
  number: number;
}

interface ResultsRevealViewProps {
  assignments: UserAssignment[];
  onReset: () => void;
  userNames: string[];
}

interface Topic {
  id: number;
  theme: string;
}

export default function ResultsRevealView({
  assignments,
  onReset,
}: ResultsRevealViewProps) {
  const [revealedCount, setRevealedCount] = useState(-1);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [userOrder, setUserOrder] = useState("特になし");
  const [isGenerating, setIsGenerating] = useState(false);

  // Sort assignments by number in ascending order (smallest on the left, largest on the right)
  const sortedAssignments = [...assignments].sort(
    (a, b) => a.number - b.number
  );

  // Generate topics on component mount
  React.useEffect(() => {
    generateTopics();
  }, []);

  const generateTopics = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-topics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({userInput: userOrder}),
      });

      if (!response.ok) {
        throw new Error("Failed to generate topics");
      }

      const data = await response.json();
      setTopics(data.topics);
      setCurrentTopicIndex(0);
    } catch (error) {
      console.error("Error generating topics:", error);
      // Fallback to default topics
      setTopics([
        {id: 1, theme: "海外旅行にいくなら？"},
        {id: 2, theme: "無人島に持っていくなら？"},
        {id: 3, theme: "好きな都道府県は？"},
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStart = () => {
    setRevealedCount(0);
  };

  const revealNext = () => {
    if (revealedCount < sortedAssignments.length) {
      setRevealedCount((prev) => prev + 1);
    }
  };

  const handlePreviousTopic = () => {
    setCurrentTopicIndex((prev) => (prev - 1 + topics.length) % topics.length);
  };

  const handleNextTopic = () => {
    setCurrentTopicIndex((prev) => (prev + 1) % topics.length);
  };

  const handleRegenerate = () => {
    generateTopics();
  };

  const currentTopic = topics[currentTopicIndex]?.theme || "読み込み中...";
  const allRevealed = revealedCount === sortedAssignments.length;

  // Not started yet - initial screen
  if (revealedCount === -1) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-black w-full">
        <div className="bg-white p-8 w-full max-w-2xl text-center space-y-6">
          {/* Topic Display with Navigation */}
          <div className="border-4 border-black p-6 bg-white">
            <div className="text-xs font-bold text-black/50 mb-2">お題</div>
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handlePreviousTopic}
                disabled={isGenerating || topics.length === 0}
                className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="前のお題"
              >
                <Icon icon="mdi:chevron-left" className="w-6 h-6" />
              </button>
              <div className="flex-1 text-center">
                <div className="text-2xl font-bold text-black min-h-[2em] flex items-center justify-center">
                  {isGenerating ? (
                    <span className="text-base text-black/50">生成中...</span>
                  ) : (
                    currentTopic
                  )}
                </div>
                {topics.length > 0 && (
                  <div className="text-xs text-black/40 mt-2">
                    {currentTopicIndex + 1} / {topics.length}
                  </div>
                )}
              </div>
              <button
                onClick={handleNextTopic}
                disabled={isGenerating || topics.length === 0}
                className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="次のお題"
              >
                <Icon icon="mdi:chevron-right" className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* User Order Input */}
          <div className="w-full">
            <label className="block text-xs font-bold text-black/70 mb-2">
              追加オーダー（任意）
            </label>
            <input
              type="text"
              value={userOrder}
              onChange={(e) => setUserOrder(e.target.value)}
              placeholder="例：食べ物に関するお題がいい"
              className="w-full px-4 py-3 border-2 border-black/20 focus:border-black outline-none text-black"
              disabled={isGenerating}
            />
          </div>

          {/* Regenerate Button */}
          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="w-full py-3 text-black bg-white hover:bg-gray-100 font-semibold border-2 border-black transition-colors btn-press flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon icon="mdi:refresh" className="w-4 h-4" />
            {isGenerating ? "生成中..." : "再生成"}
          </button>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleStart}
              className="w-full py-4 text-white bg-black hover:bg-gray-800 font-bold text-lg transform transition-all btn-press flex items-center justify-center gap-2"
            >
              🎁 結果を見る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 text-black w-full min-h-screen">
      <div className="bg-white p-8 w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">🎉 結果発表</h1>
          <div className="text-sm text-black/60">
            {revealedCount} / {sortedAssignments.length} 人開示済み
          </div>
        </div>

        {/* Grid Layout - Centered */}
        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-fit">
            {sortedAssignments.map((assignment, index) => {
              // Reveal from right to left (largest numbers first)
              const revealIndex = sortedAssignments.length - 1 - index;
              const isRevealed = revealIndex < revealedCount;
              return (
                <div
                  key={index}
                  className={`relative aspect-square w-32 md:w-36 lg:w-40 border-4 border-black flex flex-col items-center justify-center transition-all duration-500 ${
                    isRevealed ? "bg-white" : "bg-black/5"
                  }`}
                >
                  {/* User Name - Hidden until revealed */}
                  <div className="text-sm md:text-base font-bold text-black mb-2">
                    {isRevealed ? `${assignment.name}さん` : "???"}
                  </div>

                  {/* Number or Hidden */}
                  {isRevealed ? (
                    <div className="text-4xl md:text-5xl font-black text-accent-red animate-pop-in">
                      {assignment.number}
                    </div>
                  ) : (
                    <div className="text-4xl md:text-5xl">?</div>
                  )}

                  {/* Position indicator (順位) */}
                  <div className="absolute top-1 left-1 text-xs font-bold text-black/30">
                    {index + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-4">
          {!allRevealed ? (
            <button
              onClick={revealNext}
              className="w-full max-w-md py-4 text-white bg-black hover:bg-gray-800 font-bold text-lg transform transition-all btn-press"
            >
              🎁 次を開く ({revealedCount + 1}人目)
            </button>
          ) : (
            <div className="w-full max-w-md space-y-4">
              <button
                onClick={() => {
                  if (confirm("同じメンバーでもう一度やり直しますか？"))
                    onReset();
                }}
                className="w-full py-3 text-black bg-white hover:bg-gray-100 font-semibold border-2 border-black transition-colors btn-press flex items-center justify-center gap-2"
              >
                <Icon icon="mdi:refresh" className="w-4 h-4" />
                もう一度
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
