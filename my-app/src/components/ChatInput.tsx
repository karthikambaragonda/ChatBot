import React from "react";

type ChatInputProps = {
    prompt: string;
    setPrompt: React.Dispatch<React.SetStateAction<string>>;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
};

const ChatInput: React.FC<ChatInputProps> = ({ prompt, setPrompt, handleSubmit }) => {
    return (
        <form
            onSubmit={handleSubmit}
            className="input-group p-3"
            style={{ backgroundColor: "#161b22" }}
        >
            <input
                type="text"
                className="form-control"
                placeholder="Type your message..."
                aria-label="Message input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                autoComplete="off"
                style={{
                    backgroundColor: "#0d1117",
                    borderColor: "#30363d",
                    color: "#f0f6fc",
                }}
            />
            <button
                className="btn d-flex align-items-center gap-2"
                type="submit"
                style={{ backgroundColor: "#2ea043", color: "#f0f6fc" }}
            >
                Send <i className="bi bi-send-fill"></i>
            </button>
        </form>
    );
};

export default ChatInput;
