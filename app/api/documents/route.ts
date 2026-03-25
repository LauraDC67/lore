import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ documents: data })
}

export async function POST(req: NextRequest) {
  const { title, dept, author, date, content } = await req.json()

  const { data, error } = await supabase
    .from('documents')
    .insert([{ title, dept, author, date, content }])
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ document: data[0] })
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()

  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}