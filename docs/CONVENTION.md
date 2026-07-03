# Project Convention

## Branch Rule

```text
main
- 최종 제출 및 배포용 브랜치
- 직접 push 금지

develop
- 개발 통합 브랜치
- 모든 기능은 develop에서 분기

feature/*
- 기능 개발 브랜치

fix/*
- 버그 수정 브랜치

chore/*
- 설정, 문서, CI, 정리 작업 브랜치
```

## Branch Name

```text
feature/onboarding-login
feature/trip-create-flow
feature/mission-draw-flow
feature/record-create-flow
feature/collection-book

fix/mission-list-layout
fix/record-preview-image
fix/collection-dialog-state

chore/dead-code-cleanup
chore/docs-update
chore/frontend-ci
```

## Commit Message

```text
type: 작업 내용
```

### Type

```text
feat     : 기능 추가
fix      : 버그 수정
refactor : 기능 변경 없는 구조 개선
style    : UI, CSS 수정
docs     : 문서 수정
chore    : 설정, 패키지, CI 작업
remove   : 파일 또는 코드 삭제
```

### Example

```text
feat: add mission draw flow
feat: implement collection book preview
fix: preserve record preview after save
style: update mission card hover motion
docs: update project README
chore: remove legacy route pages
```


## Verification

```bash
npm run build
npm run lint
```
