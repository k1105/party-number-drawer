import "../styles/animations.css";

interface ResultViewProps {
  number: string;
}

export default function ResultView({number}: ResultViewProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gradient-bg text-white animate-fade-in">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-sm border border-white/20 shadow-2xl text-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-300 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-300 rounded-full blur-3xl opacity-30"></div>

        <h2 className="text-xl font-medium text-white/90 mb-2">
          あなたの番号は
        </h2>

        <div className="animate-pop-in my-8">
          <span className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-white drop-shadow-sm">
            {number}
          </span>
        </div>
      </div>
    </div>
  );
}
