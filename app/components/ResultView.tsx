import "../styles/animations.css";

interface ResultViewProps {
  number: string;
}

export default function ResultView({number}: ResultViewProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-black animate-fade-in">
      <div className="bg-white p-8 w-full max-w-sm text-center relative overflow-hidden">
        <div className="text-6xl mb-4">🎅</div>

        <h2 className="text-xl font-medium text-black mb-2">あなたの番号は</h2>

        <div className="animate-pop-in my-8">
          <span className="text-8xl font-black text-accent-red">{number}</span>
        </div>
      </div>
      <p className="mt-8 text-black/60 text-xs">🎄 Merry Christmas! 🎅</p>
    </div>
  );
}
