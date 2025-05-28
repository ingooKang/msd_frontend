# 📅 2025-05-28 작업 로그

## 🔀 Git 브랜치 정리
- `feature/login` → `main` 병합
- `feature/analysis` 브랜치 생성 후 작업 전환
- `.git` 디렉토리 내부에서 명령 실행 오류 → 루트 디렉토리로 이동하여 해결
- `master` 브랜치 사용 중인 프로젝트로 확인 → 브랜치 관리 명확히 구분 필요

### Git alias 추가
```bash
alias gs='git status -sb'
alias ga='git add .'
alias gc='git commit -m'
alias gp='git push'

📊 순위 분석 기능 개발
1. 데이터베이스
tbl_game_info: 경기 메타 정보 테이블

tbl_game_rank: 경기일 기준 전후 순위 기록 테이블

2. MyBatis 쿼리
두 팀의 순위 히스토리 조회 SQL 작성

OR 조건 괄호 누락 오류 수정:

3. Spring API
/api/toto/analysis/team-rank-history (GET 방식)

쿼리 파라미터: lname, teams, date

🧩 프론트엔드 작업
1. AnalysisPanel.js
props: game → { lname, htname, atname, matchday }

fetch: GET 방식 호출로 변경

TeamTrendChart에 rankData 전달

2. TeamTrendChart.js
팀별 순위 변화를 Chart.js 기반 LineChart로 시각화

data.find is not a function 오류 해결

team_name → teamName 필드명 수정

3. DataTable.js
각 row에 분석 보기 버튼 추가 → 해당 game을 AnalysisPanel에 전달

상단 공통 분석 버튼 제거

기존 상세 분석 버튼(아이콘)은 유지

분석 toggle 상태 관리 로직 개선 예정

🔜 다음 작업
분석 버튼 클릭 시 중복 차트 렌더링 방지 (toggle 개선)

분석 범위 matchday - 5일 기준 필터링 로직 적용

팀별 고정 색상 지정 (Chart.js)

API 테스트 케이스 /test/rank-sample 작성

필요 시 상태 관리 전환 (Redux or Context)

