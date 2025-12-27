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
  onRevealStart?: () => void;
  onRevealNext?: () => void;
  revealedCountExternal?: number;
}

interface Topic {
  id: number;
  theme: string;
}

export default function ResultsRevealView({
  assignments,
  revealedCountExternal = -1,
}: ResultsRevealViewProps) {
  const revealedCount = revealedCountExternal;
  const [topics, setTopics] = useState<Topic[]>([]);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [userOrder, setUserOrder] = useState("特になし");
  const [isGenerating, setIsGenerating] = useState(false);

  // Keep assignments in registration order (no sorting by number)
  // We'll reveal in reverse order (largest numbers first) but display in registration order
  const sortedAssignments = assignments;

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

  // Create a reveal order array: indices sorted by number (largest to smallest)
  const revealOrder = React.useMemo(() => {
    return sortedAssignments
      .map((assignment, index) => ({index, number: assignment.number}))
      .sort((a, b) => b.number - a.number)
      .map((item) => item.index);
  }, [sortedAssignments]);

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

  // Not started yet - initial screen (Topic selection)
  if (revealedCount === -1) {
    return (
      <div className="flex items-center justify-center p-8 w-full h-full">
        <div className="bg-white border-2 border-black p-12 w-full max-w-3xl">
          {/* Topic Display with Navigation */}
          <div className="mb-8">
            <div className="text-xs font-bold text-black/50 uppercase tracking-wider mb-4">
              お題
            </div>
            <div className="border-4 border-black p-8 bg-white min-h-[120px] flex items-center">
              <button
                onClick={handlePreviousTopic}
                disabled={isGenerating || topics.length === 0}
                className="p-3 hover:bg-black/5 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                aria-label="前のお題"
              >
                <Icon icon="mdi:chevron-left" className="w-8 h-8" />
              </button>
              <div className="flex-1 text-center px-4">
                <div className="text-3xl font-bold text-black min-h-[1.5em] flex items-center justify-center">
                  {isGenerating ? (
                    <span className="text-lg text-black/50">生成中...</span>
                  ) : (
                    currentTopic
                  )}
                </div>
              </div>
              <button
                onClick={handleNextTopic}
                disabled={isGenerating || topics.length === 0}
                className="p-3 hover:bg-black/5 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                aria-label="次のお題"
              >
                <Icon icon="mdi:chevron-right" className="w-8 h-8" />
              </button>
            </div>
            {topics.length > 0 && (
              <div className="text-xs text-black/40 text-center mt-3">
                {currentTopicIndex + 1} / {topics.length}
              </div>
            )}
          </div>

          {/* User Order Input */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-black/50 uppercase tracking-wider mb-3">
              追加オーダー（任意）
            </label>
            <input
              type="text"
              value={userOrder}
              onChange={(e) => setUserOrder(e.target.value)}
              placeholder="例：食べ物に関するお題がいい"
              className="w-full px-4 py-3 border-2 border-black/20 focus:border-black outline-none text-black transition-colors"
              disabled={isGenerating}
            />
          </div>

          {/* Regenerate Button */}
          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="w-full py-3 bg-white hover:bg-black/5 border-2 border-black font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon icon="mdi:refresh" className="w-5 h-5" />
            {isGenerating ? "生成中..." : "お題を再生成"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8 w-full h-full">
      <div className="bg-white border-2 border-black p-12 w-full max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-3">結果発表</h1>
          <div className="text-sm text-black/50">
            開票済み: {revealedCount} / {sortedAssignments.length} 人
          </div>
        </div>

        {/* Grid Layout - 3 Column Fixed */}
        <div className="grid grid-cols-3 gap-4">
          {sortedAssignments.map((assignment, index) => {
            // Check if this assignment has been revealed
            // revealOrder contains indices in the order they should be revealed
            const revealPosition = revealOrder.indexOf(index);
            const isRevealed = revealPosition < revealedCount;
            return (
              <div
                key={index}
                className={`relative aspect-square border-4 border-black flex flex-col items-center justify-center transition-all duration-500 ${
                  isRevealed ? "bg-white" : "bg-black/5"
                }`}
              >
                {/* Position indicator (registration order) */}
                <div className="absolute top-2 left-2 text-xs font-bold text-black/30">
                  #{index + 1}
                </div>

                {/* User Name - Hidden until revealed */}
                <div className="text-base font-bold text-black mb-3">
                  {isRevealed ? assignment.name : "???"}
                </div>

                {/* Number or Hidden */}
                {isRevealed ? (
                  <div className="text-6xl font-black text-black animate-pop-in">
                    {assignment.number}
                  </div>
                ) : (
                  <div className="text-6xl font-black text-black/20">?</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
