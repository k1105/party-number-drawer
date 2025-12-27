"use client";

import {useState, useEffect, Suspense} from "react";
import {useSearchParams} from "next/navigation";
import ResultView from "./components/ResultView";
import QRDistributionView from "./components/QRDistributionView";
import ResultsRevealView from "./components/ResultsRevealView";
import StatusHeader from "./components/StatusHeader";
import ActionButton from "./components/ActionButton";

interface UserAssignment {
  name: string;
  number: number;
}

type HostMode = "registration" | "topic" | "results-reveal";

function AppContent() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"loading" | "host" | "result">(
    "loading"
  );
  const [hostMode, setHostMode] = useState<HostMode>("registration");
  const [targetNumber, setTargetNumber] = useState<string | null>(null);
  const [userNames, setUserNames] = useState<string[]>([]);
  const [assignments, setAssignments] = useState<UserAssignment[]>([]);
  const [resetKey, setResetKey] = useState(0);
  const [revealedCount, setRevealedCount] = useState(-1);
  const [currentAssignments, setCurrentAssignments] = useState<
    UserAssignment[]
  >([]);

  useEffect(() => {
    // Check URL parameters
    const n = searchParams.get("n");

    if (n) {
      setTargetNumber(n);
      setViewMode("result");
    } else {
      setViewMode("host");
    }
  }, [searchParams]);

  const handleUserAdd = (userName: string) => {
    setUserNames((prev) => [...prev, userName]);
  };

  const handleAssignmentsChange = (userAssignments: UserAssignment[]) => {
    setCurrentAssignments(userAssignments);
  };

  const handleStart = () => {
    if (currentAssignments.length === userNames.length) {
      setAssignments(currentAssignments);
      setHostMode("topic");
    }
  };

  const handleResultStart = () => {
    setRevealedCount(0);
    setHostMode("results-reveal");
  };

  const handleRevealNext = () => {
    if (revealedCount < assignments.length) {
      setRevealedCount((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setHostMode("registration");
    setAssignments([]);
    setCurrentAssignments([]);
    setRevealedCount(-1);
    setResetKey((prev) => prev + 1);
  };

  if (viewMode === "loading") return null;

  // Determine status based on current mode
  const getStatus = (): "ENTRY" | "GAME" | "RESULT" => {
    if (viewMode === "result") return "RESULT";
    if (hostMode === "registration") return "ENTRY";
    if (hostMode === "topic") return "GAME";
    return "RESULT";
  };

  // Determine action button
  const getActionButton = () => {
    if (viewMode === "result") return null;

    if (hostMode === "registration") {
      const canStart = currentAssignments.length === userNames.length && userNames.length > 0;
      return (
        <ActionButton
          label="START"
          onClick={handleStart}
          disabled={!canStart}
        />
      );
    }

    if (hostMode === "topic") {
      return <ActionButton label="RESULT" onClick={handleResultStart} />;
    }

    if (hostMode === "results-reveal") {
      const allRevealed = revealedCount === assignments.length;
      if (allRevealed) {
        return <ActionButton label="REMATCH" onClick={handleReset} />;
      } else {
        return <ActionButton label="NEXT" onClick={handleRevealNext} />;
      }
    }

    return null;
  };

  return (
    <>
      <StatusHeader status={getStatus()} />
      {getActionButton()}
      <div
        className={`min-h-screen pt-20 pb-24 ${
          viewMode === "result" ? "result-bg" : "christmas-bg"
        }`}
      >
        {viewMode === "result" && targetNumber ? (
          <ResultView number={targetNumber} />
        ) : (
          <>
            {hostMode === "registration" && (
              <div className="h-full">
                <QRDistributionView
                  key={resetKey}
                  userNames={userNames}
                  onAssignmentsChange={handleAssignmentsChange}
                  onUserAdd={handleUserAdd}
                />
              </div>
            )}
            {hostMode === "topic" && (
              <ResultsRevealView
                assignments={assignments}
                onReset={handleReset}
                userNames={userNames}
                revealedCountExternal={-1}
              />
            )}
            {hostMode === "results-reveal" && (
              <ResultsRevealView
                assignments={assignments}
                onReset={handleReset}
                userNames={userNames}
                revealedCountExternal={revealedCount}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <AppContent />
    </Suspense>
  );
}
