# EARTH RE:BUILDING — Original Design / Hierarchical Archive

이 버전은 사용자가 제공한 **기존 EARTH-RE-BUILDING-main.zip**을 기반으로 제작되었습니다.

## 보존된 디자인
- **원본 `index.html`, `main.html`, `lounge.html`, `cards.html`, `css/common.css`, 이미지 전체**를 수정하지 않았습니다.
- 지하철 역사(`images/site-main.jpg`), 배경 7장(`BBG_*.jpg`), 기존 패널/오브젝트/애니메이션은 원본 그대로입니다.
- `archive.html`의 기존 청록색 유리 패널, 상단 5개 탭, 인물 명부/프로필/이미지 뷰어는 보존했습니다.

## 변경된 기능
- 기존 한 줄 목록을 **대분류(5개 상단 탭) → 소분류(접기/펼치기) → 개별 기록(우측 상세)**으로 교체했습니다.
- 원래 목록 패널의 레이아웃과 색상을 재사용하고, 분류 아코디언의 최소 CSS만 추가했습니다.
- WORLD도 목록 내 개별 기록으로 열람합니다(기존처럼 21개 글을 세로로 한 번에 표시하지 않음).
- 본문이 없는 이미지 자리표시자를 감추어 긴 설정 문서의 가독성을 확보했습니다. 실제 이미지가 등록되면 기존 이미지 프레임을 그대로 사용합니다.
- 76개 원고를 기존보다 쉽게 관리할 수 있도록 `content/index.json` 및 `content/records/*/*.json`에 연결했습니다.
- 기존 PERSONNEL 프로필 4명(ARGO, PLOX, MEARI, IRA)은 **원본 JSON과 원본 화면을 그대로 유지**합니다.
- Netlify/Decap CMS 관련 `admin/` 파일과 설정 가이드는 삭제했습니다.

## 콘텐츠 자료와 공개 검토
- 새 원고 76개는 앞서 제작된 99개 마스터 기반의 **공개 후보 정리본**을 재사용했습니다. 원본 WORLD 21개의 구버전 내용은 신규 페이지에 그대로 중복 게시하지 않았습니다.
- 09와 12는 별도 기록, 49/52/53 및 64/69는 통합, 40/41은 테라포밍, 82는 현장 관리, 83/84는 정치·제도, 95는 GROUPS 도입 문구로 반영했습니다.
- 비공개·공개 수위 검토 대상(15·16·21·55·56·59·60·97·98 등)과 내부 제작 문서, 96~99 통합 원문은 배포 본문에서 제외했습니다. 분류 조정과 공개 승인은 별개이므로 배포 전 읽어보고 최종 검수하세요.
- 원고의 문장을 새로 윤문하기보다 분류/표시만 최소 변경했습니다.

## 실제 수정 파일
- 수정: `archive.html` (기존 CSS·JavaScript에 분류 표시/콘텐츠 로딩 추가)
- 추가: `content/index.json`, `content/records/**/*.json`, `.nojekyll`
- 보존: `content/archive/personnel.json`, `content/lounge/*.json`, `content/cards/cards.json`와 기존 모든 화면/이미지
- 제거: `admin/`, `README_DECAP_SETUP.txt`, 오래된 4개 아카이브 JSON (혼동 방지)

## 운영 / 파일 추가
- 목차 이름과 소분류: `content/index.json` 안의 `categories[].sections[]`
- 원고 제목/분류/목록 순서: `content/index.json` 안의 `records[]`
- 본문 문장: `content/records/<대분류>/<항목>.json`의 `body` 배열
- 이미지: 본문 JSON에 `"image":"images/uploads/파일.png"`를 추가. 이미지가 없으면 빈 프레임 없음.
- 인물: 기존 `content/archive/personnel.json` (기존 명부 화면과 속성 유지)
- 변경 후 `git commit` 및 `git push`하면 GitHub Pages에서 자동 갱신됩니다.

## 배포
1. **현재 GitHub 저장소를 백업**하고 GitHub Desktop의 기존 저장소 작업 디렉터리에서 새 압축을 풀어 파일을 **루트에** 넣으세요.
2. 지난번 새 버전의 `assets/`, `js/`, `field.html` 등이 남아 있다면 삭제하고 이 ZIP의 파일만 유지하세요.
3. GitHub Desktop에서 커밋 후 `Push origin`합니다.
4. `Settings → Pages`의 `main / (root)` 배포를 확인합니다.
5. `https://kina98.github.io/EARTH-RE-BUILDING/`에서 **사무실 → WORLD/SETTINGS → 소분류 → 기록**이 열리는지 확인하세요.

### 로컬 시험
Python 설치 시 저장소 폴더에서 `python -m http.server 8000`을 실행하고 `http://localhost:8000/`에 접속하세요. `file://` 직접 열기 방식은 브라우저에서 JSON `fetch()`가 차단될 수 있습니다.

## 검증 범위
JSON 파일 연결·문법 및 상대 파일 경로에 대한 정적 검사를 수행했습니다. 실제 브라우저에서 인터랙션/모바일 레이아웃 검증은 별도 확인이 필요합니다.
