import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-key, Pragma, Cache-Control',
};

export function middleware(request: NextRequest) {
  if (request.method === 'OPTIONS') {
    return NextResponse.json({}, { headers: corsHeaders });
  }

  const path = request.nextUrl.pathname;
  let response = NextResponse.next();

  // 1. API 보호: 테이블을 추가/수정/삭제 하는 /api/sheets 하위의 요청 보호
  // (외부 시스템 연동을 위해 쿠키나 헤더의 x-admin-key 모두 확인 허용)
  if (path.startsWith('/api/sheets')) {
    // GET 요청은 단순히 목록과 내용을 보는 것이므로 예외로 할지 여부
    // 여기서는 조회도 보호하도록 통일합니다. (테이블 목록 노출 방지)
    const key = request.cookies.get('admin_key')?.value || request.headers.get('x-admin-key');
    if (key !== process.env.ADMIN_KEY) {
      response = NextResponse.json({ error: 'Unauthorized. Invalid ADMIN_KEY.' }, { status: 401 });
    }
  } else if (!path.startsWith('/api') && !path.startsWith('/_next') && !path.includes('.')) {
    // 2. UI 화면 보호: 생성/편집 관련 화면 ('/' 및 '/[tableName]') 보호.
    // /login, /API, /_next 등 정적파일, 그리고 포맷반환(/csv/users 등 세그먼트 2개 이상)은 모두 패스합니다.
    const segments = path.split('/').filter(Boolean);
    
    // 홈 화면이거나 세그먼트가 1개(예: /users)인 경우 -> 테이블 편집 화면이므로 로그인 필수
    if (segments.length === 0 || (segments.length === 1 && segments[0] !== 'login')) {
      const key = request.cookies.get('admin_key')?.value;
      if (key !== process.env.ADMIN_KEY) {
        response = NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  // CORS 헤더 추가
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
