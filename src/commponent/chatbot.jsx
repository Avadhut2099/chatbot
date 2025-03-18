import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hi there 👋\nHow can I help you today?", type: "AI Reply" },
  ]);
  const [userMessage, setUserMessage] = useState("");
  const chatboxRef = useRef(null);

  useEffect(() => {
    chatboxRef.current?.scrollTo(0, chatboxRef.current.scrollHeight);
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const newMessages = [
      ...messages,
      { text: userMessage, type: "User input" },
      { text: "Thinking...", type: "AI Reply" },
    ];
    setMessages(newMessages);
    setUserMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: userMessage,
                },
              ],
            },
          ],
        }),
      });
      const data = await response.json();

      const botReply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I didn't understand that.";

      setMessages([
        ...messages,
        { text: userMessage, type: "User input" },
        { text: botReply, type: "AI Reply" },
      ]);
    } catch {
      setMessages([
        ...messages,
        { text: userMessage, type: "User input" },
        { text: "Error fetching response.", type: "error" },
      ]);
    }
  };

  return (
    <div className="  bg-white w-150 rounded-2xl  border shadow-xl border-gray-300 ">
      <header className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center py-3 font-bold text-xl rounded-t-2xl">
        Chatbot
      </header>
      <div ref={chatboxRef} className="h-96 overflow-y-auto p-4 ">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 my-1 rounded-lg w-fit ${
              msg.type === "User input"
                ? "bg-indigo-500 text-white ml-auto"
                : "bg-gray-200 text-black"
            }`}
          >
            {msg.type === "AI Reply" ? (
              <ReactMarkdown>{msg.text}</ReactMarkdown> //   AI messages with Markdown
            ) : (
              msg.text
            )}
          </div>
        ))}
      </div>
      <div className="p-3 flex items-center border-t">
        <textarea
          className="flex-1 p-2 border rounded-md resize-none"
          placeholder="Enter a message..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && !e.shiftKey && handleSendMessage()
          }
        />
        <button
          className="ml-3 p-2 bg-indigo-600 text-white rounded-md"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
