오늘의 작업을 체계적으로 정리해볼게! 🗂️
📅 2025-05-29 코지 & 너의 MSD 프로젝트 개발 로그

✅ 주요 개발 목표
스포츠 경기 데이터 기반 탑독/언더독 통계 생성 및 누적 관리 시스템 구현

🛠️ 진행된 작업 요약
1. DB 설계 및 테이블 생성
tbl_team_game_context_stats: 팀별 홈/원정, 탑독/언더독 구분 통계 저장

PK: team_id, league_name, is_home, is_topdog

필드: win_count, draw_count, lose_count, total_count

2. 경기 기반 통계 집계 로직 구현
매일 경기 결과 기반으로 각 팀의 상황별 결과를 분석하여 해당 테이블에 기록

승/무/패 집계 및 누적

3. MyBatis 매퍼 작성
selectStat, insertStat, updateStat 메서드 구현

selectStat에서는 teamId, leagueName, isHome, isTopdog 기준 조회

4. 매핑 오류 디버깅
MyBatis 로그 상 쿼리는 정상적으로 결과 1건 리턴

하지만 Java에서는 null 처리 → DTO 필드명과 DB 컬럼명의 네이밍 차이로 인한 자동 매핑 실패

✅ 해결

resultMap 직접 정의하여 명시적 매핑 적용 → selectStat 정상 작동 확인

5. 서비스 로직 구성
GameStatBatchServiceImpl: 경기 리스트 조회 → 각 경기 분석 → 탑독 판단 → 통계 갱신

TeamGameContextStatsService: 통계 존재 여부 판단 후 insert or update

6. 테스트 및 오류 처리
중복 insert 에러 (PK 충돌) → select 결과가 null이라 발생 → 매핑 수정으로 해결

로그 확인: MyBatis 쿼리 로그와 결과값 콘솔 출력 병행


📅 2025-05-31 코지 & 너의 MSD 프로젝트 개발 로그

🔧 1. 순위 변화 관련 기능 리팩토링
latest_rank에서 팀의 순위를 가져와 홈/원정 여부 상관없이 처리되도록 쿼리 개선.

team_type 유지 필요성 재확인.

getRankChangeIcon 함수 검토 및 확인.

뷰에서는 변화 반영이 되지 않는 문제 해결.

📊 2. 팀 순위 변화 및 컨텍스트 그래프 추가
TeamContextChart.js에 최근 순위 변화 그래프(LineChart) 추가.

y축 범위 축소, x축 제한(10개) 적용.

Bar 그래프 상단에 퍼센트 비율 표시.

세로/가로 축 범위 조정하여 시각화 최적화.

⚙️ 3. 초기 회차 세팅 로직 개선
페이지 초기 로딩 시, 1회차 → 현재 회차로 자동 변경되도록 로직 수정.

roundLoaded 플래그 도입으로 중복 요청 방지.

🚀 4. 초기 로딩 속도 개선
loading 상태 관리 도입.

로딩 중입니다 메시지 추가 및 fetch 순서 최적화.

🧮 5. 분석 하단 표 추가
최근 10~20경기 기준:

배당 적정성

득/실점

점수 합계

득실차

평균득점합산

TeamContextChart.js 하단에 테이블 UI 구성 완료.

경기 수는 사용자가 선택할 수 있도록 설계 시작.

🔗 6. 데이터 연동 준비
getGameHist API 설계 방향 확정 (파라미터: teamName, leagueName, count).

DTO 필드 정의: teamName, matchday, oppTeamName, lname, hscore, ascore, difscore, sumScore.

Controller 통합 여부 판단 후 TeamGameContextStatsController에 포함하는 것으로 결정.

필요한 다음 단계는:

getGameHist용 DTO, Service, Repository 코드 작성.

실제 데이터 API 연동 및 TeamContextChart.js에서 테이블 값 업데이트 구현.

⚽ 시스템 요약: 스포츠 경기 및 순위 관리 흐름
1. 테이블 역할 정리
테이블명	설명
	tbl_game_info	모든 스포츠 게임 정보를 저장. 배트맨 프로토 경기의 기준이 되는 게임 데이터 관리
	tbl_data_proto	tbl_game_info의 게임을 기반으로 다양한 배팅 유형과 결과를 관리
	rnkctrl	매일 순위 수집 대상 리그 관리. regular='Y' 조건에 따라 수집 대상 여부 결정
	rnkdatanew	rnkctrl의 정규 리그(regular='Y')에 대한 일일 순위 정보 수집 테이블
	tbl_game_rank	각 경기일 기준, 홈팀과 원정팀의 경기 전 순위를 기록하는 테이블
	tbl_team_game_context_stats	각 경기 결과를 바탕으로 팀의 승/무/패 및 순위 변동 통계를 누적 관리하는 테이블

2. 데이터 집계 프로세스
	매일 tbl_game_info와 tbl_game_rank를 조합하여 다음 조건에 맞는 경기 데이터를 조회:

	홈팀/원정팀의 경기일 기준 순위(checkday)가 존재하는 경우

	득점(hscore, ascore)이 모두 존재하는 완료된 경기만 대상

	조회 SQL 예시:

	SELECT
		gi.game_id, gi.lname, gi.hscore, gi.ascore,
		gi.home_team AS homeTeam, gi.away_team AS awayTeam,
		STR_TO_DATE(SUBSTRING(gi.matchday, 1, 8), '%y.%m.%d') AS matchDate,
		hr.rnk AS homeRank, ar.rnk AS awayRank
	FROM tbl_game_info gi
	JOIN tbl_game_rank hr ON gi.game_id = hr.game_id AND hr.teamType = 'h'
		AND STR_TO_DATE(SUBSTRING(gi.matchday, 1, 8), '%y.%m.%d') = hr.checkday
	JOIN tbl_game_rank ar ON gi.game_id = ar.game_id AND ar.teamType = 'a'
		AND STR_TO_DATE(SUBSTRING(gi.matchday, 1, 8), '%y.%m.%d') = ar.checkday
	WHERE gi.hscore IS NOT NULL AND gi.ascore IS NOT NULL;
	
3. 통계 테이블 갱신 (tbl_team_game_context_stats)
위 조회 결과를 기반으로 각 팀의 경기 결과(승/무/패)를 기존 통계에 추가하거나 신규로 입력

경기 전 순위 정보를 활용하여 순위 변동성과 경기 결과 관계 분석이 가능하도록 설계

📅 2025-06-01 MSD 프로젝트 개발 로그 요약
✅ 주요 작업 목표
경기 클릭 시, 해당 경기의 배당 적정성을 평가하여 분석 결과에 포함하는 기능 구현

🔧 진행 내용 요약
1. team-context API 개선 설계
기존 API에 gameId 파라미터 추가

경기 단위 배당 평가 결과(OddsEvaluationDto)를 함께 반환하도록 구조 개선

2. OddsEvaluationDto 설계
구성 클래스 분리:

OutcomeDetail: 승/무/패 평가

HandicapResult: 핸디캡 판단

OverUnderResult: 언더오버 판단

확장성과 테스트 편의성 고려하여 각 컴포넌트 클래스 분리

3. GameOddsInfoDto 구조 설계
tbl_data_proto 구조에 따라 List<GameOddsInfoDto>로 구성

TYPE 필드 기준으로 WDL, HANDICAP, OU 분리 처리

4. MyBatis 매퍼 작성
TeamGameContextStatsMapper.getGameOddsInfos(gameId) 메서드 구현

tbl_data_proto에서 배당 관련 데이터 전부 조회하는 쿼리 작성

5. OddsEvaluationService 구현
List<GameOddsInfoDto>를 받아 TYPE별 분기 처리

teamName, isHome, isTopdog 조건으로 통계 조회

기대 확률 계산 → 배당 환산 확률과 비교

OutcomeDetail, HandicapResult, OverUnderResult 구성 및 조립

