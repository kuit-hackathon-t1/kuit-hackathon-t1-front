# GitHub Convention

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
- 설정, 문서, CI 작업 브랜치
```

## Branch Name

```text
feature/travel-style
feature/mission-recommend
feature/mission-board
feature/island-page

fix/mission-card-layout
fix/api-error-fallback

chore/github-setup
chore/frontend-ci
chore/project-structure
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
feat: implement travel style page
feat: add mission board
fix: handle empty mission list
refactor: separate mission card component
style: update landing page layout
docs: add github convention
chore: add frontend ci workflow
```
