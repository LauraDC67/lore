'use client'
import { useState, useEffect } from 'react'

interface Document {
  id: number
  title: string
  dept: string
  author: string
  date: string
  content: string
}

export default function AdminPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [form, setForm] = useState({ title: '', dept: '', author: '', date: '', content: '' })
  const [loading, setLoading] = useState(false)

  const fetchDocuments = async () => {
    const res = await fetch('/api/documents')
    const data = await res.json()
    setDocuments(data.documents || [])
  }

  useEffect(() => { fetchDocuments() }, [])

  const handleSubmit = async () => {
    if (!form.title || !form.content) return
    setLoading(true)
    await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setForm({ title: '', dept: '', author: '', date: '', content: '' })
    await fetchDocuments()
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    await fetch('/api/documents', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    await fetchDocuments()
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

        .admin-wrap {
          max-width: 780px;
          margin: 0 auto;
          padding: 0 24px 60px;
        }

        .admin-header {
          padding: 40px 0 24px;
          border-bottom: 1px solid rgba(0,0,0,0.1);
          display: flex;
          align-items: baseline;
          gap: 16px;
          margin-bottom: 40px;
        }

        .lore-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 42px;
          font-weight: 300;
          letter-spacing: -1px;
        }

        .admin-badge {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #C9A84C;
          border: 1px solid #C9A84C;
          padding: 3px 8px;
          border-radius: 2px;
        }

        .back-link {
          margin-left: auto;
          font-size: 12px;
          font-weight: 500;
          color: #8a7f6e;
          text-decoration: none;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-bottom: 1px solid transparent;
          transition: all 0.2s;
        }

        .back-link:hover { color: #1a1a1a; border-bottom-color: #1a1a1a; }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 400;
          margin-bottom: 20px;
          color: #1a1a1a;
        }

        .form-card {
          background: white;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 2px;
          padding: 32px;
          margin-bottom: 48px;
        }

        .field {
          margin-bottom: 16px;
        }

        .field label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #8a7f6e;
          margin-bottom: 6px;
        }

        .field input, .field textarea {
          width: 100%;
          padding: 12px 16px;
          background: #F5F0E8;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 2px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 300;
          color: #1a1a1a;
          outline: none;
          transition: border-color 0.2s;
        }

        .field input:focus, .field textarea:focus {
          border-color: #C9A84C;
          background: white;
        }

        .field textarea {
          height: 140px;
          resize: vertical;
        }

        .field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .submit-btn {
          padding: 13px 32px;
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
          margin-top: 8px;
        }

        .submit-btn:hover { background: #C9A84C; }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .docs-count {
          font-size: 13px;
          color: #8a7f6e;
          margin-bottom: 16px;
          font-weight: 300;
        }

        .doc-card {
          background: white;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 2px;
          padding: 20px 24px;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          transition: border-color 0.2s;
        }

        .doc-card:hover { border-color: rgba(0,0,0,0.2); }

        .doc-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 400;
          margin-bottom: 4px;
        }

        .doc-meta {
          font-size: 12px;
          color: #8a7f6e;
          font-weight: 300;
          letter-spacing: 0.02em;
        }

        .delete-btn {
          background: none;
          border: none;
          font-size: 12px;
          color: #b5a99a;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.05em;
          transition: color 0.2s;
          padding: 2px 0;
          flex-shrink: 0;
          margin-left: 16px;
        }

        .delete-btn:hover { color: #c0392b; }

        .empty-docs {
          text-align: center;
          padding: 40px;
          color: #b5a99a;
          font-size: 14px;
          font-weight: 300;
          border: 1px dashed rgba(0,0,0,0.1);
          border-radius: 2px;
        }
      `}</style>

      <div className="admin-wrap">
        <header className="admin-header">
          <span className="lore-logo">Lore</span>
          <span className="admin-badge">Admin</span>
          <a href="/" className="back-link">← Back to chat</a>
        </header>

        <h2 className="section-title">Add a document</h2>
        <div className="form-card">
          <div className="field">
            <label>Title</label>
            <input placeholder="Ex: A/B test onboarding — men 30-45" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          </div>
          <div className="field-row">
            <div className="field">
              <label>Department</label>
              <input placeholder="Ex: Marketing" value={form.dept} onChange={e => setForm({...form, dept: e.target.value})} />
            </div>
            <div className="field">
              <label>Author</label>
              <input placeholder="Ex: Laura" value={form.author} onChange={e => setForm({...form, author: e.target.value})} />
            </div>
          </div>
          <div className="field">
            <label>Date</label>
            <input placeholder="Ex: 2024-03" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
          </div>
          <div className="field">
            <label>Content</label>
            <textarea placeholder="Paste your Notion content here..." value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
          </div>
          <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Adding...' : 'Add document'}
          </button>
        </div>

        <h2 className="section-title">Indexed documents</h2>
        <p className="docs-count">{documents.length} document{documents.length > 1 ? 's' : ''} in the knowledge base</p>

        {documents.length === 0 ? (
          <div className="empty-docs">No documents yet</div>
        ) : (
          documents.map(doc => (
            <div key={doc.id} className="doc-card">
              <div>
                <p className="doc-title">{doc.title}</p>
                <p className="doc-meta">{[doc.dept, doc.author, doc.date].filter(Boolean).join(' · ')}</p>
              </div>
              <button className="delete-btn" onClick={() => handleDelete(doc.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </>
  )
}