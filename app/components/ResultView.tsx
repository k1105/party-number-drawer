"use client";

import {useState, useEffect} from "react";
import {IconPartyPopper} from "./Icons";
import {useSocket} from "../hooks/useSocket";
import "../styles/animations.css";

interface ResultViewProps {
  number: string;
}

export default function ResultView({number}: ResultViewProps) {
  const [name, setName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {emitQRScanned, submitName, isConnected} = useSocket();

  // Notify server that QR code was scanned
  useEffect(() => {
    if (number && isConnected) {
      emitQRScanned?.(parseInt(number));
    }
  }, [number, isConnected]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      submitName?.(parseInt(number), name.trim());
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gradient-bg text-white animate-fade-in">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-sm border border-white/20 shadow-2xl text-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-300 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-300 rounded-full blur-3xl opacity-30"></div>

        <IconPartyPopper className="w-16 h-16 mx-auto mb-4 text-yellow-300 animate-bounce" />

        <h2 className="text-xl font-medium text-white/90 mb-2">
          あなたの番号は
        </h2>

        <div className="animate-pop-in my-8">
          <span className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-white drop-shadow-sm">
            {number}
          </span>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="bg-white/20 rounded-xl p-4">
              <label htmlFor="name" className="block text-sm text-white/80 mb-2">
                お名前を入力してください
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="山田 太郎"
                className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
                required
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={!name.trim() || !isConnected}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-800 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isConnected ? '名前を登録' : '接続待機中...'}
            </button>
          </form>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="bg-green-500/20 border border-green-300/30 rounded-xl p-4">
              <p className="text-green-100 font-medium">
                ✓ 登録完了しました!
              </p>
              <p className="text-white/80 text-sm mt-2">
                {name} さん
              </p>
            </div>
            <div className="bg-white/20 rounded-xl p-4 text-sm text-white/80">
              この画面を係の人に見せてください
            </div>
          </div>
        )}
      </div>
      <p className="mt-8 text-white/40 text-xs">Party Lottery App</p>
    </div>
  );
}
