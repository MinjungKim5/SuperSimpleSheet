import Link from 'next/link';
import { db } from '@/lib/db';
import { CreateSheetForm } from '@/components/CreateSheetForm';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let sheets: any[] = [];
  try { 
    sheets = await db.getSheets(); 
  } catch (e) {
    console.error('Error fetching sheets:', e);
  }

  return (
    <div className="container animate-fade-in">
      <header className="header">
        <div className="logo">SuperSimpleSheet</div>
      </header>

      <main>
        <div className="glass" style={{ padding: '2rem', marginBottom: '3rem', background: '#ffffff' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--foreground)' }}>테이블 만들기</h2>
          <CreateSheetForm />
        </div>

        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: 'var(--foreground)' }}>내 테이블 목록</h3>
        {sheets.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>아직 만들어진 테이블이 없습니다.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {sheets.map((sheet) => (
              <div key={sheet.id} className="glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '1.25rem', wordBreak: 'break-all', color: 'var(--foreground)' }}>{sheet.tableName}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(sheet.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Link href={`/${encodeURIComponent(sheet.tableName)}`} className="btn-primary" style={{ flex: 1, padding: '0.6rem', fontSize: '0.9rem' }}>
                    ✎ 엑셀 편집
                  </Link>
                  <a href={`/json/${encodeURIComponent(sheet.tableName)}`} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '0.6rem', fontSize: '0.9rem', color: 'var(--primary)' }}>JSON</a>
                  <a href={`/csv/${encodeURIComponent(sheet.tableName)}`} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '0.6rem', fontSize: '0.9rem', color: '#16a34a' }}>CSV</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
