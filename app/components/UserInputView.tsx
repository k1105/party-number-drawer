"use client";

import {useState} from "react";
import {Icon} from "@iconify/react";

interface UserInputViewProps {
  onComplete: (userNames: string[]) => void;
}

export default function UserInputView({onComplete}: UserInputViewProps) {
  const [users, setUsers] = useState<string[]>([""]);

  const addUser = () => {
    setUsers([...users, ""]);
  };

  const removeUser = (index: number) => {
    if (users.length > 1) {
      setUsers(users.filter((_, i) => i !== index));
    }
  };

  const updateUser = (index: number, value: string) => {
    const newUsers = [...users];
    newUsers[index] = value;
    setUsers(newUsers);
  };

  const handleStart = () => {
    const validUsers = users.filter((name) => name.trim() !== "");
    if (validUsers.length > 0) {
      onComplete(validUsers);
    } else {
      alert("少なくとも1人のユーザ名を入力してください");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 text-black">
      <div className="bg-white p-6 w-full max-w-md flex flex-col items-center space-y-6">
        <div className="w-full text-center">
          <h1 className="text-2xl font-bold text-black mb-2">🎄 参加者登録</h1>
          <p className="text-sm text-black/70">
            ゲームに参加する人の名前を入力してください
          </p>
        </div>

        {/* User Input List */}
        <div className="w-full space-y-3 max-h-96 overflow-y-auto">
          {users.map((user, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-shrink-0 w-8 text-center text-black/50 text-sm font-medium">
                {index + 1}
              </div>
              <input
                type="text"
                value={user}
                onChange={(e) => updateUser(index, e.target.value)}
                placeholder="名前を入力"
                className="flex-1 px-4 py-3 border-2 border-black/20 focus:border-black outline-none text-black"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && index === users.length - 1) {
                    addUser();
                  }
                }}
              />
              {users.length > 1 && (
                <button
                  onClick={() => removeUser(index)}
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-black/50 hover:text-red-600 hover:bg-red-50 transition-colors"
                  aria-label="削除"
                >
                  <Icon icon="mdi:close" className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="w-full space-y-3 pt-2">
          <button
            onClick={addUser}
            className="w-full py-3 text-black bg-white hover:bg-gray-100 font-semibold border-2 border-black transition-colors btn-press flex items-center justify-center gap-2"
          >
            <Icon icon="mdi:plus" className="w-4 h-4" />
            参加者を追加
          </button>

          <button
            onClick={handleStart}
            className="w-full py-4 text-white bg-black hover:bg-gray-800 font-bold text-lg transform transition-all btn-press flex items-center justify-center gap-2"
          >
            🎁 開始
            <Icon icon="mdi:arrow-right" className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs text-black/50 text-center">
          {users.filter((u) => u.trim()).length} 人が参加予定
        </div>
      </div>
    </div>
  );
}
