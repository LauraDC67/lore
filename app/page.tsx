'use client'
import { useState, useEffect, useRef } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!question.trim()) return
    const userMessage = { role: 'user' as const, content: question }
    setMessages(prev => [...prev, userMessage])
    setQuestion('')
    setLoading(true)

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    })
    const data = await res.json()
    setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #F5F0E8;
          color: #1a1a1a;
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
        }

        .lore-wrap {
          display: flex;
          flex-direction: column;
          height: 100vh;
          max-width: 780px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .lore-header {
          padding: 40px 0 24px;
          border-bottom: 1px solid rgba(0,0,0,0.1);
          display: flex;
          align-items: baseline;
          gap: 16px;
        }

        .lore-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 42px;
          font-weight: 300;
          letter-spacing: -1px;
          color: #1a1a1a;
        }

        .lore-nav {
          margin-left: auto;
        }

        .lore-nav a {
          font-size: 12px;
          font-weight: 500;
          color: #8a7f6e;
          text-decoration: none;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-bottom: 1px solid transparent;
          transition: all 0.2s;
        }

        .lore-nav a:hover {
          color: #1a1a1a;
          border-bottom-color: #1a1a1a;
        }

        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 40px 0;
          scrollbar-width: none;
        }

        .messages-area::-webkit-scrollbar { display: none; }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 12px;
          color: #b5a99a;
        }

        .empty-icon {
          font-family: 'Cormorant Garamond', serif;
          font-size: 64px;
          font-weight: 300;
          opacity: 0.3;
        }

        .empty-text {
          font-size: 14px;
          font-weight: 300;
          letter-spacing: 0.05em;
        }

        .message {
          margin-bottom: 28px;
          animation: fadeUp 0.3s ease;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .message-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 8px;
          color: #8a7f6e;
        }

        .message-user .message-label { color: #1a1a1a; }

        .message-bubble {
          padding: 16px 20px;
          border-radius: 2px;
          font-size: 15px;
          line-height: 1.7;
          font-weight: 300;
        }

        .message-user .message-bubble {
          background: #1a1a1a;
          color: #F5F0E8;
          margin-left: 80px;
        }

        .message-assistant .message-bubble {
          background: #EDE8DF;
          color: #1a1a1a;
          border-left: 2px solid #C9A84C;
        }

        .thinking {
          display: flex;
          gap: 6px;
          align-items: center;
          padding: 16px 20px;
          background: #EDE8DF;
          border-left: 2px solid #C9A84C;
          border-radius: 2px;
        }

        .dot {
          width: 5px;
          height: 5px;
          background: #C9A84C;
          border-radius: 50%;
          animation: pulse 1.2s ease-in-out infinite;
        }

        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }

        .input-area {
          padding: 20px 0 32px;
          border-top: 1px solid rgba(0,0,0,0.1);
        }

        .input-row {
          display: flex;
          gap: 12px;
          align-items: stretch;
        }

        .input-field {
          flex: 1;
          padding: 14px 18px;
          background: white;
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: 2px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 300;
          color: #1a1a1a;
          outline: none;
          transition: border-color 0.2s;
        }

        .input-field:focus { border-color: #C9A84C; }
        .input-field::placeholder { color: #b5a99a; }

        .send-btn {
          padding: 14px 28px;
          background: #1a1a1a;
          color: #F5F0E8;
          border: none;
          border-radius: 2px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s;
        }

        .send-btn:hover { background: #C9A84C; }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <div className="lore-wrap">
        <header className="lore-header">
          <span className="lore-logo">Lore</span>
          <nav className="lore-nav">
            <a href="/admin">Admin ↗</a>
          </nav>
        </header>

        <div className="messages-area">
          {messages.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">𝕷</div>
              <p className="empty-text">Ask anything about Rocopine's cumulated knowledge</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`message message-${msg.role}`}>
              <div className="message-label">{msg.role === 'user' ? 'You' : 'Lore'}</div>
              <div className="message-bubble">{msg.content}</div>
            </div>
          ))}
          {loading && (
            <div className="message message-assistant">
              <div className="message-label">Lore</div>
              <div className="thinking">
                <div className="dot" /><div className="dot" /><div className="dot" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="input-area">
          <div className="input-row">
            <input
              className="input-field"
              placeholder="Ask a question..."
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button className="send-btn" onClick={handleSend} disabled={loading}>
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  )
}