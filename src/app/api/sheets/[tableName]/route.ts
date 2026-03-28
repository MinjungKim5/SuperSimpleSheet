import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ tableName: string }> }) {
  try {
    const tableName = decodeURIComponent((await params).tableName);
    const row = await db.getSheet(tableName);
    if (!row) return NextResponse.json({ error: 'Sheet not found' }, { status: 404 });
    return NextResponse.json({ id: row.id, tableName: row.tableName, data: JSON.parse(row.data), updatedAt: row.updatedAt });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ tableName: string }> }) {
  try {
    const tableName = decodeURIComponent((await params).tableName);
    const { data, newTableName } = await req.json();
    const finalTableName = newTableName || tableName;
    if (!data) return NextResponse.json({ error: 'data is required' }, { status: 400 });

    await db.updateSheet(tableName, finalTableName, JSON.stringify(data));
    return NextResponse.json({ message: 'Sheet updated', tableName: finalTableName });
  } catch (error: any) {
    if (error.message === 'NOT_FOUND') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (error.message === 'EXISTS') return NextResponse.json({ error: 'Table name already exists' }, { status: 409 });
    console.error(error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ tableName: string }> }) {
  try {
     const tableName = decodeURIComponent((await params).tableName);
     await db.deleteSheet(tableName);
     return NextResponse.json({ message: 'Sheet deleted' });
  } catch (error: any) {
     if (error.message === 'NOT_FOUND') return NextResponse.json({ error: 'Not found' }, { status: 404 });
     console.error(error);
     return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
