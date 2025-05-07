# 📊 LeftNav 트리 구조

좌측 네비게이션(`LeftNav.js`)은 발매중인 게임 정보와 리그 정보를 트리 구조로 표현한다.  
각 정보는 서버에서 한 번의 요청으로 받아온 후 클라이언트에서 그룹핑하여 사용한다.

---

## 🎮 발매중 게임 트리 구조

### ✅ 데이터 형식 (`buyableGames`)

```json
[
  {
    "id": 1,
    "sporttype": "야구",
    "gametype": "승1패",
    "sec": 11,
    ...
  },
  ...
]
sporttype
 └── gametype
      └── 회차 정보 (ex: 야구 승1패 11회차)
1단계: 스포츠 종류 (야구, 축구, 등)

2단계: 게임 유형 (승1패, 매치, 등)

3단계: 회차 (11회차, 20회차, 등)

상태 관리: openSportTypes, openGameTypes

[
  { "lname": "K리그1", "teamName": "서울" },
  { "lname": "K리그1", "teamName": "수원" },
  { "lname": "KBO", "teamName": "LG" },
  ...
]

리그명
 └── 팀명
// buyableGames: 그룹핑 by sporttype → gametype
// leagues: 그룹핑 by lname → teamName
const groupedLeagues = useMemo(() => {
  const map = {};
  rawLeagues.forEach(({ lname, teamName }) => {
    if (!map[lname]) map[lname] = new Set();
    map[lname].add(teamName);
  });
  return map;
}, [rawLeagues]);
💡 UI 특징
펼침/접힘을 useState로 개별 관리

아이콘, 색상, 회차 텍스트 등 커스터마이징 가능

클릭 이벤트로 상세 페이지 또는 필터 연동 가능 (예정)