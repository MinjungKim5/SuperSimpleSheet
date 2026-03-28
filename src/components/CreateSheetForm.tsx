'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function CreateSheetForm() {
  const [tableName, setTableName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableName || loading) return;

    setLoading(true);
    try {
      const res = await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableName,
          data: [{ 열1: '', 열2: '' }] // Default starting data
        })
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to create sheet');
        setLoading(false);
        return;
      }

      router.push(`/${tableName}`);
    } catch (err) {
      alert('Network error');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem' }}>
      <input
        type="text"
        value={tableName}
        onChange={(e) => setTableName(e.target.value)}
        placeholder="table_name (e.g., users)"
        className="input-text"
        required
        pattern="[a-zA-Z0-9_-]+"
        title="Only letters, numbers, underscores, and dashes are allowed"
      />
      <button type="submit" className="btn-primary" disabled={loading} style={{ whiteSpace: 'nowrap' }}>
        {loading ? '...' : '+ Create Table'}
      </button>
    </form>
  );
}
