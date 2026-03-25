import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '@/lib/supabase'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
})

export async function POST(req: NextRequest) {
  const { question } = await req.json()

  // Récupérer tous les documents
  const { data: documents } = await supabase
    .from('documents')
    .select('title, dept, author, date, content')

  const context = documents?.map(doc =>
    `[${doc.title} — ${doc.dept} — ${doc.author} — ${doc.date}]\n${doc.content}`
  ).join('\n\n') || 'Aucun document disponible.'

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: `Tu es Lore, l'assistant de mémoire institutionnelle de l'entreprise. 
Tu réponds aux questions des employés en te basant uniquement sur les documents internes fournis.
Pour chaque réponse, cite les sources (titre du document, auteur, date).
Si l'information n'est pas dans les documents, dis-le clairement.

Documents disponibles :
${context}`,
    messages: [{ role: 'user', content: question }]
  })

  const response = message.content[0].type === 'text' ? message.content[0].text : ''

  return NextResponse.json({ response })
}