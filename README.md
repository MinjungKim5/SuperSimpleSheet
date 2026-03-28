# SuperSimpleSheet (슈퍼 심플 시트)

**SuperSimpleSheet**는 언제 어디서나 간편하게 테이블 데이터를 저장하고, 어떤 환경에서도 쉽게 조회할 수 있도록 설계된 가벼운 테이블 저장소 솔루션입니다.

## 🚀 기획 의도
"데이터 관리는 필요하지만, 무거운 데이터베이스나 복잡한 스프레드시트는 과하다"고 느낄 때가 있습니다. SuperSimpleSheet는 간단한 UI를 통해 테이블을 생성하고, 생성된 데이터를 즉시 JSON, CSV, XML, YAML 등 다양한 포맷으로 조회할 수 있는 API 엔드포인트를 제공합니다. 

어떤 상황(웹, 모바일, CLI, 다른 서비스 통합 등)에서도 URL 하나만으로 최신 데이터를 가져올 수 있게 하는 것이 이 프로젝트의 목표입니다.

## ✨ 주요 기능
- **웹 기반 테이블 편집기**: 직관적인 UI를 통해 엑셀처럼 데이터를 편집할 수 있습니다.
- **다양한 포맷 지원 (API)**: `/[포맷]/[테이블명]` 구조의 URL로 데이터를 즉시 조회할 수 있습니다.
  - 지원 포맷: `json`, `csv`, `xml`, `yaml` (yml)
- **심플한 인증**: `ADMIN_KEY`를 통한 간단한 접근 제어를 지원합니다.
- **모던한 UI**: Glassmorphism 디자인이 적용된 깔끔하고 반응형인 웹 인터페이스를 제공합니다.

## 🛠 기술 스택
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS (CSS Variables)
- **Data Export**: `json2csv`, `js2xmlparser`, `yaml`
- **Storage**: JSON File (Local Storage 기반)

## 📦 설치 및 실행

### 1. 로컬 개발 환경 설정
```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```
기본적으로 `http://localhost:5555`에서 실행됩니다.

### 2. 환경 변수 설정
`.env` 파일을 생성하고 관리자 키를 설정하세요 (필요한 경우).
```env
ADMIN_KEY=your_secret_key_here
```

## 🌐 배포 가이드

### GitHub에 올리기
1. 새로운 GitHub 저장소를 생성합니다.
2. 아래 명령어를 실행합니다:
```bash
git remote add origin [YOUR_GITHUB_REPO_URL]
git branch -M main
git add .
git commit -m "Initial commit: SuperSimpleSheet setup"
git push -u origin main
```

### Vercel 배포
1. [Vercel](https://vercel.com)에 로그인하고 'Add New Project'를 클릭합니다.
2. GitHub 저장소를 연결합니다.
3. **Environment Variables**에 `ADMIN_KEY`를 추가합니다.
4. 'Deploy'를 클릭합니다.

> ⚠️ **주의사항 (Vercel 배포 시)**: 현재 프로젝트는 `data.json` 파일을 데이터베이스로 사용하고 있습니다. Vercel의 서버리스 환경은 파일 시스템이 읽기 전용이거나 재배포 시 초기화되므로, 데이터가 영구적으로 보존되지 않습니다. 실제 운영 환경에서는 SQLite(Vercel Postgres 등) 또는 외부 DB 연결이 권장됩니다.

## 📝 알려진 이슈 및 로드맵
- [ ] **CSV 포맷 오류**: 현재 CSV 변환 기능이 특정 데이터 구조에서 제대로 작동하지 않을 수 있습니다. (수정 예정)
- [ ] **데이터베이스 연동**: Vercel 배포를 위한 외부 DB(Postgres, MongoDB 등) 연동 옵션 추가.
- [ ] **행/열 추가 UI 개선**: 테이블 편집기 내 사용성 개선.

## 📄 라이선스
MIT License
