# Public Image Assets

- 큰 이미지, 배경 이미지, 책 이미지, 피그마 export 이미지는 `public/images`에 둔다.
- SVG 아이콘은 `src/assets/icons`를 사용한다.
- `public/images` 파일은 코드에서 `/images/...` 경로로 참조한다.
- `src/assets/icons` 파일은 컴포넌트에서 import해서 사용한다.
- `public/images/icons`는 만들지 않는다.
- 파일명은 영어 소문자와 하이픈을 사용한다.
- 한글 파일명과 공백 포함 파일명은 금지한다.

## Current Priority

- `public/images/home/open-book.png`
- `public/images/record/complete-book.png`

## Planned Images

- `public/images/onboarding/splash-bg.png`
- `public/images/onboarding/butterfly-white.png`
- `public/images/onboarding/intro-butterfly.png`
- `public/images/onboarding/intro-beetle.png`
- `public/images/onboarding/intro-dragonfly.png`
- `public/images/onboarding/mission-card-sample.png`
- `public/images/onboarding/failed-memory-placeholder.png`
- `public/images/home/empty-book.png`
- `public/images/home/book-cover.png`
- `public/images/home/trip-card-bg.png`
- `public/images/trip/success-check.png`
- `public/images/trip/mission-card-back.png`
- `public/images/trip/mission-card-front.png`
- `public/images/mission/draw-card-back.png`
- `public/images/mission/draw-card-front.png`
- `public/images/mission/draw-sparkle.png`
- `public/images/record/camera-placeholder.png`
- `public/images/record/photo-frame.png`
- `public/images/specimen/butterfly-icon.png`
- `public/images/specimen/beetle-icon.png`
- `public/images/specimen/dragonfly-icon.png`
- `public/images/specimen/butterfly-mask.svg`
- `public/images/specimen/beetle-mask.svg`
- `public/images/specimen/dragonfly-mask.svg`

## Icon Notes

- Main tabs use `mission.svg`, `home.svg`, and `record.svg` from `src/assets/icons`.
- Close buttons use `close.svg`.
- Back buttons use `leftarrow.svg`.
- Random mission actions use `shuffle.svg`.
- Warning dialogs use `warning.svg`.
- Success and completion states use `okay.svg`.
- Collection header actions use `review.svg` or `tripreview.svg`.
- `camera.svg` currently exists in `src/assets/icons`; use it for camera actions. If it is replaced later, keep it in `src/assets/icons`.
