'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [key, setKey] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key) return;
    
    // 키를 쿠키에 저장합니다. (30일간 유지 설정)
    document.cookie = `admin_key=${key}; path=/; max-age=${60*60*24*30}; SameSite=Strict`;
    
    // 홈으로 이동 후 즉시 새로고침하여 서버에 쿠키가 전달되도록 함
    router.push('/');
    router.refresh();
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass" style={{ padding: '3rem', maxWidth: '400px', width: '100%', textAlign: 'center', background: '#ffffff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: 'var(--primary)' }}>SuperSimpleSheet</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
          접근 권한이 필요합니다. 관리자 키(ADMIN_KEY)를 입력하세요.
        </p>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="password" 
            value={key} 
            onChange={e => setKey(e.target.value)} 
            className="input-text" 
            placeholder="Key를 입력하세요" 
            style={{ textAlign: 'center', letterSpacing: '2px', padding: '1rem' }}
            required
            autoFocus
          />
          <button type="submit" className="btn-primary" style={{ padding: '1rem' }}>
            액세스 잠금 해제
          </button>
        </form>
      </div>
    </div>
  );
}
