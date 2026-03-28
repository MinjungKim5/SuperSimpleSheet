'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SheetEditor({ initialTableName, initialData }: { initialTableName: string, initialData: any[] }) {
  const router = useRouter();
  const [data, setData] = useState<any[]>(initialData);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // Drag and drop state
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, idx: number) => {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', idx.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>, idx: number) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIdx !== idx) setDragOverIdx(idx);
  };

  const handleDrop = (e: React.DragEvent<HTMLTableRowElement>, targetIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) {
      setDragOverIdx(null);
      return;
    }
    const newData = [...data];
    const [removed] = newData.splice(draggedIdx, 1);
    newData.splice(targetIdx, 0, removed);
    setData(newData);
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLTableRowElement>) => {
    setDraggedIdx(null);
    setDragOverIdx(null);
    e.currentTarget.removeAttribute('draggable');
  };

  const columns = data.length > 0 ? Object.keys(data[0]) : ['A', 'B', 'C'];
  // 초기 데이터가 아예 없을 때 최소 행 10개, 만들어진 컬럼 3개 기본
  if (data.length === 0) {
    for(let i=0; i<10; i++) {
        const row:any = {};
        columns.forEach(c => row[c] = '');
        data.push(row);
    }
  }

  const addRow = () => {
    const newRow: any = {};
    columns.forEach(c => newRow[c] = '');
    setData([...data, newRow]);
  };

  const addColumn = () => {
    const newColName = prompt('추가할 열(Column) 이름을 입력하세요:');
    if (!newColName || columns.includes(newColName)) return;
    
    setData(data.map(row => ({ ...row, [newColName]: '' })));
  };

  const removeColumn = (colToRemove: string) => {
    if (columns.length <= 1) return alert('최소 1개의 열은 남겨두어야 합니다.');
    if (!confirm(`'${colToRemove}' 열을 삭제합니까? 데이터도 함께 지워집니다.`)) return;
    
    setData(data.map(row => {
      const newRow = { ...row };
      delete newRow[colToRemove];
      return newRow;
    }));
  };

  const removeRow = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

  const updateCell = (rowIndex: number, colName: string, value: string) => {
    const newData = [...data];
    newData[rowIndex][colName] = value;
    setData(newData);
  };

  const saveSheet = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/sheets/${encodeURIComponent(initialTableName)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data })
      });
      if (!res.ok) throw new Error('Failed to save');
      router.refresh();
      setTimeout(() => setSaving(false), 500);
    } catch(e) {
      alert('데이터 저장 중 오류가 발생했습니다.');
      setSaving(false);
    }
  };

  const deleteSheet = async () => {
    if (!confirm('경고: 이 테이블을 영구적으로 삭제합니까? 복구할 수 없습니다.')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/sheets/${encodeURIComponent(initialTableName)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      router.push('/');
    } catch(e) {
      alert('삭제 중 오류가 발생했습니다.');
      setDeleting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: 'calc(100vh - 120px)' }}>
      {/* 엑셀 툴바 영역 */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', background: 'white', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <button onClick={saveSheet} disabled={saving} className="btn-primary">
          {saving ? '저장됨 ✓' : '💾 저장하기'}
        </button>
        <div style={{ flex: 1 }} />
        <button onClick={deleteSheet} disabled={deleting} className="btn-danger">
          휴지통
        </button>
      </div>

      {/* 스프레드시트 컨테이너 플렉스 영역 매꾸기 */}
      <div className="spreadsheet-container" style={{ flex: 1 }}>
        <table className="spreadsheet-table">
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>#</th>
              {columns.map(col => (
                <th key={col} style={{ minWidth: '120px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem' }}>{col}</span>
                    <button 
                      onClick={() => removeColumn(col)} 
                      style={{ background: 'transparent', border: 'none', color: '#9ca3af', fontSize: '1rem', transition: 'color 0.2s', padding: '0 2px' }}
                      onMouseOver={e=>e.currentTarget.style.color='var(--error)'} 
                      onMouseOut={e=>e.currentTarget.style.color='#9ca3af'}
                      title="이 열 삭제"
                    >×</button>
                  </div>
                </th>
              ))}
              <th style={{ minWidth: '80px', padding: 0 }}>
                <button onClick={addColumn} style={{ width: '100%', height: '100%', minHeight: '36px', background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 600, padding: '0.5rem', cursor: 'pointer' }}>+ 열 추가</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, rIdx) => (
              <tr 
                key={rIdx}
                onDragStart={(e) => handleDragStart(e, rIdx)}
                onDragOver={(e) => handleDragOver(e, rIdx)}
                onDrop={(e) => handleDrop(e, rIdx)}
                onDragEnd={handleDragEnd}
                style={{
                  opacity: draggedIdx === rIdx ? 0.4 : 1,
                  boxShadow: dragOverIdx === rIdx && draggedIdx !== null && draggedIdx > rIdx ? 'inset 0 3px 0 0 var(--primary)' : dragOverIdx === rIdx && draggedIdx !== null && draggedIdx < rIdx ? 'inset 0 -3px 0 0 var(--primary)' : 'none',
                  transition: 'opacity 0.2s'
                }}
              >
                {/* 왼쪽 숫자가 표시되는 Row 헤더 (엑셀스타일) - 드래그 핸들 */}
                <td 
                  onMouseDown={(e) => e.currentTarget.parentElement?.setAttribute('draggable', 'true')}
                  onMouseUp={(e) => e.currentTarget.parentElement?.removeAttribute('draggable')}
                  style={{ background: 'var(--table-header-bg)', textAlign: 'center', fontWeight: 500, color: 'var(--text-muted)', fontSize: '0.8rem', userSelect: 'none', cursor: 'grab' }}
                  title="드래그하여 순서 변경"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                    <span style={{ fontSize: '1.2rem', color: '#cbd5e1', lineHeight: '1' }}>⋮</span>
                    {rIdx + 1}
                  </div>
                </td>
                {/* 데이터 셀 */}
                {columns.map(col => (
                  <td key={col}>
                    <input 
                      type="text"
                      className="spreadsheet-input"
                      value={row[col] || ''}
                      onChange={e => updateCell(rIdx, col, e.target.value)}
                    />
                  </td>
                ))}
                {/* 행 삭제 버튼 */}
                <td style={{ textAlign: 'center', padding: '0.2rem', verticalAlign: 'middle' }}>
                  <button onClick={() => removeRow(rIdx)} className="btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px' }}>삭제</button>
                </td>
              </tr>
            ))}
            {/* 데이터 하단 행 추가 버튼 */}
            <tr>
              <td style={{ background: 'var(--table-header-bg)', borderBottom: 'none' }}></td>
              <td colSpan={columns.length + 1} style={{ padding: 0, borderBottom: 'none' }}>
                 <button onClick={addRow} style={{ width: '100%', background: '#f8fafc', color: 'var(--text-muted)', border: 'none', padding: '0.6rem 1rem', textAlign: 'left', cursor: 'pointer', fontWeight: 500, transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#f1f5f9'} onMouseOut={e=>e.currentTarget.style.background='#f8fafc'}>
                   + 행 추가
                 </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
