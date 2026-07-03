# KUIT Hackathon T1 Frontend

청춘의 순간을 여행 미션과 사진 조각으로 남기는 해커톤 프론트엔드 프로젝트입니다.

## 핵심 기능

- 닉네임 기반 온보딩/로그인
- 새 여행 만들기
- 여행 분위기/동행 유형 선택
- 랜덤 미션 뽑기 및 다시 뽑기
- 진행 중 미션 성공/실패 기록
- 사진을 곤충 모양 조각으로 채집
- IndexedDB 기반 로컬 이미지 저장
- 여행별 채집 기록 도감
- 여행 마무리 후 채집 기록 이동

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- Zustand
- Tailwind CSS
- idb
- ESLint
- Prettier

## Getting Started

```bash
npm install
npm run dev
```

개발 서버는 Vite 기본 설정을 사용합니다.


## 주요 폴더 구조

```text
src/
  app/                 라우터, 레이아웃, 전역 provider
  assets/              폰트와 아이콘
  features/            auth, trip, mission, record, collection 도메인 코드
  pages/               라우트 단위 페이지
  shared/              공통 API 클라이언트, 유틸, UI 컴포넌트
```

## 주요 라우트

- `/` - 로그인 상태에 따라 홈 또는 온보딩으로 이동
- `/onboarding` - 닉네임 기반 로그인
- `/home` - 진행 중 여행 홈
- `/trips/new` - 새 여행 생성
- `/missions` - 미션 모아보기
- `/missions?draw=1` - 랜덤 미션 뽑기 플로우
- `/records/new` - 미션 성공/실패 사진 채집
- `/collections` - 여행별 채집 기록 도감

## API/상태관리 개요

- API 요청은 `src/shared/api/fetchClient.ts`를 통해 처리합니다.
- API endpoint 경로는 `src/shared/api/endpoints.ts`에서 관리합니다.
- 서버 상태는 TanStack Query hook으로 조회/변경합니다.
- 로그인 사용자는 Zustand `auth-storage` persist store에 저장합니다.
- 홈, 미션, 기록 생성, 채집 기록 플로우는 라우트 페이지와 도메인 컴포넌트를 조합합니다.

## 이미지 저장 정책

- 채집 사진 원본 Blob은 브라우저 IndexedDB에 저장합니다.
- 저장소 이름은 `travel-mission-local-images`, object store 이름은 `images`입니다.
- 서버에는 `imageId`를 포함한 채집 기록 메타데이터를 전송합니다.
- 화면에서는 `imageId`로 IndexedDB 이미지를 다시 읽어 미리보기와 도감 조각을 표시합니다.

## Scripts

```bash
npm run dev      # 개발 서버 실행
npm run build    # TypeScript 빌드 및 Vite 프로덕션 빌드
npm run lint     # ESLint 검사
npm run preview  # 프로덕션 빌드 미리보기
```

## 고민했던 점과 해결 과정

- **이미지 저장 방식**  
  백엔드 S3 연동 없이 사진 채집 기능을 구현해야 했기 때문에, 원본 이미지는 브라우저 IndexedDB에 Blob으로 저장하고 백엔드에는 `imageId`, `cropType`, `memo`, `status` 같은 메타데이터만 저장하는 방식으로 해결했습니다.

- **미션 다시 뽑기 상태 처리**  
  다시 뽑기로 취소된 미션이 실패처럼 보일 수 있는 문제가 있어, 백엔드와 협업하여 `CANCELLED` 상태를 추가하고 `DRAWN`, `CANCELLED` 상태는 사용자 목록에서 숨기도록 처리했습니다.

- **도감 UI 재사용**  
  홈과 채집 기록 화면에서 같은 채집 조각 UI를 사용하기 위해 `SpecimenImage`, `SpecimenTile`, `SpecimenLayer`, `SpecimenBook`으로 역할을 나눠 재사용 가능한 구조로 정리했습니다.

