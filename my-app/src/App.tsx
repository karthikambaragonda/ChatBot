import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import MessageBubble from "./components/MessageBubble";
import ChatInput from "./components/ChatInput";
import Footer from "./components/footer";

type Message = {
  id: number;
  from: "user" | "ai";
  text: string;
  time: string;
};

function App() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check backend readiness
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch("https://chatbot-ra89.onrender.com/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: "ping" }),
        });
        if (res.ok) setLoading(false);
        else throw new Error("API not ready");
      } catch {
        setTimeout(checkBackend, 1000);
      }
    };
    checkBackend();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMessage: Message = {
      id: Date.now(),
      from: "user",
      text: prompt.trim(),
      time,
    };

    setMessages((msgs) => [...msgs, userMessage]);
    setPrompt("");

    try {
      const res = await fetch("https://chatbot-ra89.onrender.com/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage.text }),
      });
      const data = await res.json();

      const aiMessage: Message = {
        id: Date.now() + 1,
        from: "ai",
        text: data.response,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((msgs) => [...msgs, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 2,
        from: "ai",
        text: error instanceof Error ? error.message : "Failed to get response.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((msgs) => [...msgs, errorMessage]);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center text-light"
        style={{ height: "90vh", backgroundColor: "#0d1117" }}
      >
        <div className="spinner-border text-success" role="status" />
        <div className="mt-3">Loading AI model...</div>
      </div>
    );
  }

  return (
    <>
      <div
        className="d-flex flex-column"
        style={{ minHeight: "90vh", backgroundColor: "#0d1117" }}
      >
        <header
          className="p-3 text-center"
          style={{
            backgroundColor: "#161b22",
            color: "#f0f6fc",
            fontWeight: "bold",
            fontSize: "1.6rem",
          }}
        >
          AI ChatBot
        </header>

        <main
          className="flex-grow-1 p-4"
          style={{
            backgroundColor: "#0d1117",
            overflowY: "auto",
          }}
        >
          {messages.length === 0 && (
            <div
              className="text-center"
              style={{ color: "#8b949e", marginTop: "3rem", fontSize: "1.1rem" }}
            >
              Ask me anything — start the chat!
            </div>
          )}

          {messages.map(({ id, from, text, time }) => (
            <MessageBubble key={id} from={from} text={text} time={time} />
          ))}
          <div ref={messagesEndRef} />
        </main>

        <ChatInput prompt={prompt} setPrompt={setPrompt} handleSubmit={handleSubmit} />
      </div>

      <Footer />
    </>
  );
}

export default App;
