"use client";

import {useState, useEffect, Suspense} from "react";
import {useSearchParams} from "next/navigation";
import ResultView from "./components/ResultView";
import UserInputView from "./components/UserInputView";
import QRDistributionView from "./components/QRDistributionView";
import ResultsRevealView from "./components/ResultsRevealView";

interface UserAssignment {
  name: string;
  number: number;
}

type HostMode = "user-input" | "qr-distribution" | "results-reveal";

function AppContent() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"loading" | "host" | "result">(
    "loading"
  );
  const [hostMode, setHostMode] = useState<HostMode>("user-input");
  const [targetNumber, setTargetNumber] = useState<string | null>(null);
  const [userNames, setUserNames] = useState<string[]>([]);
  const [assignments, setAssignments] = useState<UserAssignment[]>([]);

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

  const handleUserInputComplete = (names: string[]) => {
    setUserNames(names);
    setHostMode("qr-distribution");
  };

  const handleQRDistributionComplete = (userAssignments: UserAssignment[]) => {
    setAssignments(userAssignments);
    setHostMode("results-reveal");
  };

  const handleReset = () => {
    setHostMode("qr-distribution");
    setAssignments([]);
  };

  if (viewMode === "loading") return null;

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        viewMode === "result" ? "result-bg" : "christmas-bg"
      }`}
    >
      {viewMode === "result" && targetNumber ? (
        <ResultView number={targetNumber} />
      ) : (
        <>
          {hostMode === "user-input" && (
            <UserInputView onComplete={handleUserInputComplete} />
          )}
          {hostMode === "qr-distribution" && (
            <QRDistributionView
              userNames={userNames}
              onComplete={handleQRDistributionComplete}
            />
          )}
          {hostMode === "results-reveal" && (
            <ResultsRevealView
              assignments={assignments}
              onReset={handleReset}
              userNames={userNames}
            />
          )}
        </>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <AppContent />
    </Suspense>
  );
}
