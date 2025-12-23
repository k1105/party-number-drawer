import "../styles/animations.css";

interface ResultViewProps {
  number: string;
}

export default function ResultView({number}: ResultViewProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 christmas-bg text-white animate-fade-in">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-sm border border-red-300/30 shadow-2xl text-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-400 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-green-400 rounded-full blur-3xl opacity-30"></div>

        <div className="text-6xl mb-4">🎅</div>

        <h2 className="text-xl font-medium text-white/90 mb-2">
          あなたの番号は
        </h2>

        <div className="animate-pop-in my-8">
          <span className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-300 via-yellow-200 to-green-300 drop-shadow-sm">
            {number}
          </span>
        </div>
      </div>
      <p className="mt-8 text-white/40 text-xs">🎄 Merry Christmas! 🎅</p>
    </div>
  );
}
