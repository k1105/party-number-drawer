'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ResultView from './components/ResultView';
import HostView from './components/HostView';

function AppContent() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'loading' | 'host' | 'result'>('loading');
  const [targetNumber, setTargetNumber] = useState<string | null>(null);

  useEffect(() => {
    // Check URL parameters
    const n = searchParams.get('n');

    if (n) {
      setTargetNumber(n);
      setViewMode('result');
    } else {
      setViewMode('host');
    }
  }, [searchParams]);

  if (viewMode === 'loading') return null;
  if (viewMode === 'result' && targetNumber) return <ResultView number={targetNumber} />;
  return <HostView />;
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <AppContent />
    </Suspense>
  );
}
