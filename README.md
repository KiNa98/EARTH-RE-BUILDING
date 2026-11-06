# EARTH RE:BUILDING — FIELD ARCHIVE

GitHub Pages에서 직접 배포할 수 있는 **정적 사이트**입니다. Netlify, Decap CMS, Node, 빌드 도구, 서버 DB가 필요하지 않습니다.

## 구현된 것

- `index.html`: 반지하 역사 인터랙티브 허브 (사무실·휴게실·창고·승강기)
- `archive.html`: WORLD / SETTINGS / REGIONS / GROUPS / PERSONNEL 5개 대분류, 하위 분류 접기, 독립 기록 열람
- 기록 전체 검색, 기록별 고유 URL, 관련 기록, 모바일 대응, 키보드 포커스, 이미지 없는 글 표시
- `lounge.html`, `cards.html`, `field.html`: 부가 공간. **실제 기사·카드·게임은 존재하지 않는다고 명시**
- 독립 JSON 기록 **76개**(WORLD 12 / SETTINGS 55 / REGIONS 5 / GROUPS 4 / PERSONNEL 0)
- 개별 원고 파일, 일관된 단일 목차, 별도 이미지 파일
- Netlify/Decap CMS 코드와 연동 **없음**

## 중요한 주의사항

1. 이 배포 ZIP은 **기존 GitHub 저장소 소스코드 자체를 다운로드하지 못한 상태**에서 새로 작성되었습니다. 따라서 실제 기존 이미지와 스크립트는 포함하지 않았습니다. 대신 자체 제작한 `assets/station.svg`를 임시 역사 배경으로 사용합니다. 기존 역 이미지와 매우 유사한 외형을 보장하지 않습니다.
2. 99개 마스터 원고 가운데 **공개 검토 대상으로 표시된 9개, 내부/편집용 6개, 통합 공개 여부를 보류한 96·99번 원고**는 배포되지 않습니다. 이들의 **원문을 숨겨서 번들에 넣는 방식도 사용하지 않았습니다.**
3. 나머지 공개 후보 원고들도 배포 전에 내용·표현을 최종 확인해야 합니다. 일부는 마스터 초안 문장의 표현을 유지합니다. 사용자가 `main` 브랜치에 올리면 누구나 열람할 수 있습니다.
4. PERSONNEL은 캐릭터 설정 원본이 확보되지 않아 비워둡니다. 추측으로 프로필을 작성하지 않았습니다.
5. 화면은 원본을 기반으로 재구축한 **새 디자인**이며, 원래 사이트의 디자인과 픽셀 단위 동일성을 보장하지 않습니다.

## GitHub Pages 배포

> 저장소를 삭제할 필요는 없습니다. ZIP 전체를 그대로 업로드하기 전에 기존 파일을 백업하고, **저장소의 현재 파일을 교체**하면 됩니다. 파일을 올릴 때는 ZIP 자체가 아니라 **ZIP 안의 파일·폴더를 저장소 루트에** 올려 주세요.

1. GitHub 저장소(`KiNa98/EARTH-RE-BUILDING`)의 `main` 브랜치가 있는지 확인합니다.
2. 기존 파일을 백업한 뒤 새 사이트 파일을 루트에 업로드합니다. 과거 `admin/`, `netlify.toml` 등의 파일이 남으면 사용하지 않더라도 불필요하므로 제거합니다.
3. `Settings → Pages → Build and deployment`에서 `Deploy from a branch`, 브랜치 `main`, 폴더 `/(root)`을 선택합니다.
4. 게시될 URL은 일반적으로 `https://kina98.github.io/EARTH-RE-BUILDING/`입니다. 저장소 이름이 다르면 이 부분도 달라집니다. 예전 `/Project-ARGO/` URL을 유지하려면 기존 저장소/리디렉션을 별도로 관리해야 합니다.
5. 정상 배포 확인: 홈에서 `ARCHIVE` → `SETTINGS` → `AI·로봇·인격권` → `로봇과 인격 AI의 구분`을 클릭해 본문이 나오는지 확인합니다.

**상대 경로로 작성되어 있어** 사용자명/저장소명 뒤에 하위 경로가 붙는 GitHub Pages에서도 작동합니다.

## 로컬 미리보기

`file://`로 `index.html`을 직접 열면 브라우저 보안 정책 때문에 JSON `fetch()`가 차단될 수 있습니다. 간단한 로컬 웹 서버를 사용하세요.

```sh
python -m http.server 8000
```

브라우저에서 `http://localhost:8000/`으로 접속합니다.

## 콘텐츠 수정: 기본 2개 파일

한 기록에 대한 수정은 `content/records/` 아래 JSON **1개만 수정**하면 됩니다. 제목/목록 설명도 변경하려면 `content/index.json`의 같은 ID를 찾아 수정합니다.

### 예시: 기존 기록의 본문 수정

`content/records/settings/settings-031.json`:

```json
{
  "id": "settings-031",
  "title": "동일 중력권의 대중용 워프",
  "category": "SETTINGS",
  "section": "transport",
  "source_ids": [31],
  "body": [
    "첫 번째 문단입니다.",
    "두 번째 문단입니다."
  ]
}
```

`body` 배열의 문자열을 수정하면 사이트의 본문이 바뀝니다. 이미지가 필요하면 파일을 `assets/`에 넣고 기록에 `"image": "assets/파일명.svg"`를 추가합니다. 이미지가 없으면 그 영역은 표시되지 않습니다.

### 새 기록 추가

1. 고유한 ID를 정합니다. 예: `regions-101`. 동일 ID가 이미 존재하면 안 됩니다.
2. `content/records/regions/regions-101.json` 파일을 만들고 `id`, `title`, `category`, `section`, `body`를 입력합니다.
3. `content/index.json`의 `records` 배열에 `id`, `title`, `category`, `section`, `summary`, `path`를 등록합니다.
4. `section`에는 해당 대분류의 `sections[].id`에 존재하는 값만 사용합니다. 새로운 하위 분류가 필요하면 `categories` 내 `sections`에도 새 분류를 추가합니다.
5. 저장 후 GitHub에 커밋하면 자동 게시됩니다. 등록할 인물은 `category: "PERSONNEL"`, `section: "argo"` 또는 `"east"`를 사용합니다.

`source_ids`는 원본 99개 마스터와 대조하기 위한 내부 숫자이며 **화면에 그대로 출력하지 않습니다.** 새로 만든 독립 기록은 이를 생략해도 됩니다.

### 통합·이동 처리 현황

- 원본 49·52·53 → `settings-049` 한 기록
- 원본 64·69 → `settings-064` 한 기록
- 원본 71·78 → `settings-071` 재건 사례에 통합
- 40·41 → SETTINGS / `terraform`
- 82 → SETTINGS / `reconstruction`
- 83·84 → SETTINGS / `civic` 유지
- 09·12 → WORLD / `history`의 서로 다른 두 기록 유지
- 95 → GROUPS 분류 도입 설명에 반영, 독립 기록 없음
- 96~99 → 공개 구성 검토가 끝나지 않아 현재 배포 대상 제외
- 동문·동관·신리·선농동 → 이름만으로 신규 지역 페이지를 생성하지 않음

## 주요 파일

```text
index.html                 # 메인 역사
main.html                  # 과거 링크 호환용 홈 이동
archive.html               # 아카이브 뷰어
lounge.html, cards.html    # 부가 공간
field.html                 # 승강기 안내
css/site.css               # 디자인 공통
css/archive.css            # 아카이브 전용
js/site.js                 # 모달 / 역사 오브젝트
js/archive.js              # 목차·검색·JSON 불러오기
js/inner.js                # 보조 페이지
assets/station.svg         # 대체 역사 배경 일러스트
assets/*.svg               # 공용 분위기 도식
content/index.json         # 단일 목차
content/records/...        # 독립 본문 JSON
```

## 기존 배경으로 교체하기

원본 역사 배경을 갖고 있다면 `images/site-main.jpg`를 새 사이트의 `assets/site-main.jpg`로 넣은 후, `index.html`의 `src="assets/station.svg"`만 해당 경로로 변경할 수 있습니다. 단, 기존 일러스트의 사무실·휴게실·창고·승강기 위치가 다르면 `css/site.css`의 `.hotspot-archive`, `.hotspot-lounge`, `.hotspot-storage`, `.hotspot-field` 좌표도 조정해야 합니다. **모바일 화면은 배경의 임의 위치와 관계없이 접근할 수 있도록 별도 2×2 메뉴를 사용합니다.**

## 안전과 관리

- 관리자 페이지가 없으므로 GitHub 파일 편집/커밋으로 원고를 관리합니다.
- 공개를 원치 않는 원고는 브라우저에서 숨기지 말고 **`content/index.json`에서 항목을 빼고 관련 JSON도 삭제**한 후 배포하세요.
- 비밀번호, 이메일, 비공개 자료를 JSON에 넣지 마세요. GitHub Pages 파일은 외부에서 직접 접근할 수 있습니다.
- 모든 현재 SVG는 자체 제작 도식입니다. 추후 기존 콘셉트 아트를 재사용하려면 권리와 최신 설정의 일치 여부를 확인하세요.
