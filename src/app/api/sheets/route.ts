import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rawSheets = await db.getSheets();
    const sheets = rawSheets.map(s => ({ id: s.id, tableName: s.tableName, updatedAt: s.updatedAt }));
    return NextResponse.json(sheets);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch sheets' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { tableName, data } = await req.json();
    if (!tableName || !data) return NextResponse.json({ error: 'tableName and data are required' }, { status: 400 });

    const id = crypto.randomUUID();
    const dataString = JSON.stringify(data);

    await db.createSheet({ id, tableName, data: dataString, updatedAt: new Date().toISOString() });

    return NextResponse.json({ id, tableName, message: 'Sheet created' }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'EXISTS') return NextResponse.json({ error: 'Table name already exists' }, { status: 409 });
    console.error(error);
    return NextResponse.json({ error: 'Failed to create sheet' }, { status: 500 });
  }
}
