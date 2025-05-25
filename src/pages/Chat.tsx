// src/pages/Chat.tsx

import { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../firebase";

// 🔽 メッセージ型（Firestoreから受け取る構造）
type Message = {
  id: string;
  text: string;
  uid: string;
  name?: string;
  timestamp?: { seconds: number; nanoseconds: number };
};

// 🔽 日付フォーマット関数（yyyy/MM/dd）
const formatDate = (timestamp?: { seconds: number }) => {
  if (!timestamp) return "";
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const Chat = () => {
  // 🔽 ステート管理
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // 🔽 Firestoreのリアルタイム購読
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }));
      setMessages(msgs);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    return () => unsubscribe();
  }, []);

  // 🔽 メッセージ送信処理
  const sendMessage = async () => {
    if (!text.trim()) return;
    await addDoc(collection(db, "messages"), {
      text,
      uid: auth.currentUser?.uid,
      name: auth.currentUser?.displayName,
      timestamp: serverTimestamp(),
    });
    setText("");
  };

  return (
    <div className="flex justify-center bg-gray-200 px-10">
      <div className="w-full sm:max-w-md h-screen flex flex-col bg-white shadow-lg " style={{ height: "100%" }}>
        {/* 🔽 ヘッダー */}
        <div className="flex justify-between items-center p-4 bg-gray-100">
          <span className="font-bold text-black">Chat</span>
          <button
            onClick={() => signOut(auth)}
            className="text-sm text-blue-500"
          >
            ログアウト
          </button>
        </div>

        {/* 🔽 メッセージ一覧 */}
        <div className="flex-1 overflow-y-auto px-4 py-2 bg-gray-50">
          {messages.map((msg, index) => {
            const isUser = msg.uid === auth.currentUser?.uid;
            const currentDate = formatDate(msg.timestamp);
            const prevDate = formatDate(messages[index - 1]?.timestamp);
            const showDate = currentDate !== prevDate;

            return (
              <div key={msg.id} className="flex flex-col">
                {/* 🔽 日付区切り */}
                {showDate && (
                  <div className="text-xs text-gray-500 text-center my-4">
                    ───── {currentDate} ─────
                  </div>
                )}

                {/* 🔽 吹き出しブロック */}
                <div
                  className={`flex ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="flex flex-col max-w-[80%] w-fit break-words">
                    {/* 🔽 相手のユーザー名（自分は非表示） */}
                    {!isUser && (
                      <span className="text-xs text-gray-500 mb-1 ml-2">
                        {msg.name || "名無し"}
                      </span>
                    )}

                    {/* 🔽 吹き出し本体 */}
                    <div
                      className={`relative p-3 rounded-xl text-sm break-words ${
                        isUser
                          ? "bg-green-400 text-white rounded-br-none self-end ml-10"
                          : "bg-gray-300 text-black rounded-bl-none self-start mr-10"
                      }`}
                    >
                      {/* 🔽 メッセージ本文 */}
                      {msg.text}

                      {/* 🔽 時間表示（右下） */}
                      <div className="text-[10px] text-white/80 mt-1 text-right">
                        {msg.timestamp
                          ? new Date(
                              msg.timestamp.seconds * 1000
                            ).toLocaleTimeString("ja-JP", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </div>

                      {/* 🔽 吹き出しのしっぽ */}
                      <div
                        className={`absolute bottom-0 w-0 h-0 border-t-8 ${
                          isUser
                            ? "right-0 border-l-8 border-t-green-400"
                            : "left-0 border-r-8 border-t-gray-300"
                        }`}
                        style={{ borderColor: "transparent" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* 🔽 入力欄 */}
        <div className="p-3 border-t bg-white flex gap-2 flex-wrap sm:flex-nowrap">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => {
              bottomRef.current?.scrollIntoView({ behavior: "smooth"})
            }}
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-green-500 text-white px-4 py-2 rounded-full"
          >
            送信
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
