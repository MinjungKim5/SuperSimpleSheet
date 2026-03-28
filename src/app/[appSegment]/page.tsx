import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { SheetEditor } from '@/components/SheetEditor';

export const dynamic = 'force-dynamic';

export default async function SheetPage({ params }: { params: Promise<{ appSegment: string }> }) {
  const rawParams = await params;
  const tableName = decodeURIComponent(rawParams.appSegment);
  
  if (['api', 'json', 'csv', 'yaml', 'yml', 'xml', 'favicon.ico'].includes(tableName)) {
     return notFound();
  }

  let row;
  try { 
    row = await db.getSheet(tableName); 
  } catch (e) {
    console.error('Error fetching sheet:', e);
  }

  if (!row) return notFound();

  const data = JSON.parse(row.data);

  return (
    <div className="container" style={{ maxWidth: '1600px', width: '100%', padding: '2rem' }}>
      <header className="header" style={{ marginBottom: '1rem', borderBottom: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <Link href="/" className="btn-secondary" style={{ border: 'none', padding: '0.4rem 0.8rem', background: '#f8fafc', boxShadow: 'none' }}>← 뒤로가기</Link>
           <h1 style={{ fontSize: '1.4rem', color: 'var(--foreground)' }}>{tableName}</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <div style={{ background: 'var(--table-header-bg)', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
              API URL: GET /{'{포맷}'}/{tableName}
           </div>
        </div>
      </header>

      <main>
        <SheetEditor initialTableName={tableName} initialData={data} />
      </main>
    </div>
  );
}
