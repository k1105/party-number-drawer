"use client";

import {useState} from "react";
import {Icon} from "@iconify/react";

interface UserInputViewProps {
  onUserAdd: (userName: string) => void;
  registeredUsers: string[];
}

export default function UserInputView({
  onUserAdd,
  registeredUsers,
}: UserInputViewProps) {
  const [currentName, setCurrentName] = useState("");

  const handleAddUser = () => {
    if (currentName.trim() !== "") {
      onUserAdd(currentName.trim());
      setCurrentName("");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white border-2 border-black p-8 h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black mb-2">参加者登録</h2>
          <p className="text-sm text-black/60">
            名前を入力して追加ボタンを押してください
          </p>
        </div>

        {/* Input Area */}
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={currentName}
              onChange={(e) => setCurrentName(e.target.value)}
              placeholder="名前を入力"
              className="flex-1 px-4 py-3 border-2 border-black/20 focus:border-black outline-none text-black transition-colors"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddUser();
                }
              }}
            />
            <button
              onClick={handleAddUser}
              className="px-6 py-3 bg-black text-white hover:bg-gray-800 font-medium transition-all flex items-center gap-2"
            >
              <Icon icon="mdi:plus" className="w-5 h-5" />
              追加
            </button>
          </div>
        </div>

        {/* Registered Users List */}
        <div className="flex-1 min-h-0">
          <div className="text-xs font-bold text-black/50 uppercase tracking-wider mb-3">
            登録済み ({registeredUsers.length}人)
          </div>
          <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-full">
            {registeredUsers.map((name, index) => (
              <div
                key={index}
                className="px-3 py-2 bg-black text-white text-sm font-medium text-center"
              >
                {name}
              </div>
            ))}
            {registeredUsers.length === 0 && (
              <div className="col-span-3 text-center text-sm text-black/30 py-4">
                まだ参加者が登録されていません
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
