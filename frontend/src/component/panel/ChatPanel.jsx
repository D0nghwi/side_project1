import { chat } from "../../asset/style/uiClasses"
import { useState } from "react"; 

function ChatPanel({ noteId, noteTitle, noteContent }) {
    const [messages, setMessages] = useState([
    {
        role: "assistant",
        content:
            `안녕하세요! 저는 StudyI입니다.\n` +
            `지금 보고 있는 노트 ${noteId || "-"}(${ noteTitle || "제목 없음"})에 대해 궁금한 점이나,\n` +
            `React, FastAPI, 공부한 내용 등을 물어보시면 도와드릴게요.`,
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        setError(null);

        // 프론트 대화에 사용자 메시지 추가
        const newUserMessage = { role: "user", content: trimmed };
        const newMessages = [...messages, newUserMessage];
        setMessages(newMessages);
        setInput("");

        try {
            setLoading(true);

            // 백엔드(/chat) 호출
            const response = await fetch("http://localhost:8000/chat/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: newMessages,
                    note:{
                        id: noteId,
                        title: noteTitle,
                        content: noteContent,
                    }
                }),
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("Chat API error:", response.status, text);
                throw new Error("서버 응답이 올바르지 않습니다.");
            }

            const data = await response.json();

            const assistantMessage = {
                role: "assistant",
                content: data.output,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (err) {
            console.error(err);
            setError(err.message || "채팅 도중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // Enter 로 전송, Shift+Enter 로 줄바꿈
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={chat.container}>
            <div className={chat.headerWrap}>
                <h2 className={chat.headerTitle}>StudyI 챗봇</h2>
                <p className={chat.headerDesc}>
                    노트 내용이나 관련 개념 혹은 모르는 내용 등을 질문해 보세요.
                </p>
            </div>

            <div className={chat.list}>
                {messages.length === 0 && (
                    <p className={chat.empty}>
                        아직 메시지가 없습니다. 아래 입력창에 질문을 적어보세요.
                    </p>
                )}

                {messages.map((msg, index) => {
                    const isUser = msg.role === "user";
                    return (
                        <div
                            key={index}
                            className={`${chat.rowBase} ${
                                isUser ? "justify-end" : "justify-start"
                            }`}
                        >
                            <div
                                className={`${chat.bubbleBase} ${
                                    isUser ? chat.bubbleUser : chat.bubbleAssistant
                                }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    );
                })}

                {loading && <div className={chat.thinking}>StudyI가 생각 중입니다...</div>}
            </div>

            {error && <div className={chat.errorBox}>{error}</div>}

            <div className="mt-auto">
                <textarea
                    className={chat.input}
                    placeholder={"질문을 입력하고 Enter를 눌러 전송\n(Shift+Enter 줄바꿈)"}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <div className={chat.sendWrap}>
                    <button
                        type="button"
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className={chat.sendBtn}
                    >
                        {loading ? "전송 중..." : "전송"}
                    </button>
                </div>
            </div>
        </div>
    );
}


export default ChatPanel;