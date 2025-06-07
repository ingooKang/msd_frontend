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

📅 2025-06-02 MSD 프로젝트 개발 & 점검 요약
	✅ 1. 분석 API 구조 변경 대응
	TeamContextResponseDto로 응답 구조 변경:

	contextStats: Map<String, TeamGameContextStatsDTO>

	oddsEvaluation: OddsEvaluationDto

	TeamContextChart 컴포넌트 전체 수정 완료:

	contextStats → 바 차트 시각화

	oddsEvaluation → 분석 결과 요약 출력 추가

	AnalysisPanel에서는 기존 구조 유지하며 그대로 사용 가능 확인

	✅ 2. 백엔드 예외 방어 처리
	evaluateOdds() 내 stats.getTotalCount() 호출 시 stats == null로 인한 NPE 발생 확인

	해결:

	null 체크 추가

	OddsEvaluationDto.empty() 방식으로 안전한 반환 구조 적용

	message, hasData 필드 추가 설계로 프론트 예외 처리 가능

	✅ 3. 쿼리 로직 점검 및 누락 원인 분석
	기존 쿼리 분석:

	tbl_game_info + tbl_game_rank 조인 쿼리에서 순위 데이터가 존재하는 경기만 집계됨

	문제:

	분석 제외된 경기가 많음

	원인 진단:

	순위 수집이 안 된 리그

	matchday 날짜 포맷 문제

	checkday와 매핑 실패

	경기 결과 누락 (hscore, ascore NULL)

	해결을 위한 SQL 제안:

	누락된 경기 추적용 LEFT JOIN 쿼리 제공 (순위 데이터 미존재 게임 추출용)
🗓️ 2025-06-03 작업 요약 – 인구 & 코지의 MSD 프로젝트
	✅ 1. 배당 기반 Topdog/Underdog 통계 시스템 구현
	기존 순위 기반 외에, 배당 정보(WINBAT/LOSEBAT)를 기준으로 한 분석 로직 설계

	기준: 배당이 더 낮은 팀 = Topdog

	✅ 2. GameOddsInfoDto 활용 및 쿼리 개선
	tbl_data_proto의 WINBAT, TIEBAT, LOSEBAT, HANDY, UNDEROVER 등 직접 활용

	GameInfoMapper.getWdlOddsByGameId(gameId) 메서드 개선

	GameOddsInfoDto에 gameId 필드 추가 및 매핑 완료

	✅ 3. 통계 테이블 설계 및 매핑
	새 테이블: tbl_team_game_odds_context_stats

	팀/리그/홈/Topdog 기준으로 승/무/패/전체 경기 누적

	FK 없이 설계 (유연성 고려)

	DTO: TeamGameOddsContextStatsDto

	Mapper + XML: selectStat, insertStat, updateStat 구현

	✅ 4. Topdog 판단 유틸
	OddsTopdogUtils 클래스 작성:

	isHomeTeamTopdog(dto)

	getTopdogTeam(dto)

	✅ 5. 배치 처리 로직 구현
	GameStatBatchServiceImpl.updateOddsBasedTeamStats() 작성

	완료 경기 목록 순회

	각 경기 배당 기준 Topdog 판단

	홈/원정 각각 updateStats(...) 호출

	✅ 6. 통계 갱신 서비스 구현
	TeamGameOddsContextStatsService.updateStats(...)

	존재 여부 판단 → insert or update

	승/무/패 결과 반영

	✅ 7. 강제 실행 API 추가
	GameStatBatchController에 /api/batch/odds-context-stats POST API 추가

	cURL로 수동 실행 가능

	실제 통계 저장 정상 확인

	✅ 8. 정상 작동 검증 완료
	DB 내 통계 누적 확인 (TINYINT ↔ boolean 매핑 문제 없음)

	전체 흐름 자동화까지 완료됨 (@Scheduled로 오전 11시 실행)

	💬 다음 할 일 제안
	프론트 차트(TeamContextChart.js)에서 배당 기준 통계 함께 표시

	API 응답 구조 확장 (contextStatsByOdds 추가)

	시각화/툴팁에 “배당 기준”과 “순위 기준” 구분 명시
	
📅 2025-06-04 MSD 프로젝트 개발 로그 요약
	✅ 주요 목표
	배당 기반 팀 통계 시각화 통합 및 API 정합성 확보

	통계 기준에 따른 시스템 설계 검토 및 확장 가능성 점검

	🛠️ 진행된 작업
	1. contextStatsByOdds API 응답 통합 완료
	TeamContextResponseDto에 contextStatsByOdds 추가

	TeamGameOddsContextStatsService.getStatsByTeam(...) 구현 및 Controller에 연결

	isHome, isTopdog TINYINT 매핑 오류 수정 (Y/N → 1/0)

	2. 프론트 TeamContextChart.js 시각화 통합
	contextStatsByOdds 상태 관리 및 fetch 연동 완료

	기준 전환 버튼 구현 (순위 기준 ↔ 배당 기준)

	차트 시각화 조건 분기 로직 완성 (useOddsData 기준)

	3. 로딩 조건 통합 및 안정성 개선
	contextStats, contextStatsByOdds null 체크 통합

	res.text() → JSON parse 시 empty string 대비

	curl 테스트 기반 확인 및 서버 오류 로그 분석 수행

	4. selectOne 예외 처리 및 구조 수정
	TooManyResultsException 발생 → selectList로 리팩토링 필요 확인

	배당 데이터가 복수일 수 있다는 도메인 특성 반영

	“배당 변경은 자연스러운 현상”으로 구조 수용 결정

	5. 통계 기준 설계 재검토
	배당 기준 통계를 복수로 쌓을 경우 구조 전반 리팩토링 필요성 인식

	지금은 “배당 1건 = 통계 1건” 유지 결정

	추후 확장 시 contextStatsByOdds 키 구조 → home_topdog_WDL 등으로 명확히 분기하는 설계 필요

	6. 스키마 확장 고려 사항 논의
	sport_type 필드 추가 필요성 제기

	team_id, league_name 중복 발생 방지

	설계적으로 안전성과 정합성 강화
📌 2025-06-06 MSD 프로젝트 개발 로그 요약 (코지 & 너)
		✅ 주요 목표
		기존 팀 컨텍스트 API 개선 → 홈팀/원정팀 정보를 한 번에 받아오는 API 설계

		롬복 오류 해결 및 이클립스 설정 점검

		프론트 차트 데이터 정상 표시 여부 확인 및 디버깅

		🔧 백엔드 작업
		1. 서비스 구조 개선
		AnalysisService에 getDualTeamContext(...) 메서드 추가

		gameId 기반으로 홈/원정 팀명 조회

		각 팀에 대해 getTeamContext(...) 호출

		두 팀의 컨텍스트를 DualTeamContextResponse로 묶어 반환

		2. Mapper 확장
		getTeamsByGameId(gameId) 쿼리 작성 (UNION으로 홈/원정 팀 둘 다 반환)

		3. 컨트롤러 추가
		@GetMapping("/dual-context") 방식의 API 설계

		파라미터: gameId, leagueName, sportType

		🔧 롬복 문제 해결
		lombok-1.18.32.jar 다운로드 후 커맨드라인에서 java -jar 실행

		설치 경로에 이클립스 명시하여 수동 설치 완료

		Eclipse 재시작 후 @Data 등 정상 작동 확인

		💻 프론트 점검 사항
		TeamContextChart 컴포넌트: useEffect 내 fetch 구문에서 data 파싱 누락 → data 초기화 문제 발생

		sportType 누락으로 API 호출 시 oddsBasedContextStats가 null → 파라미터 추가 후 해결

		로딩 상태 분기 (loading state) 및 조건부 렌더링 구현

		🔜 다음 작업 제안
		새로 만든 API(/api/analysis/dual-context)로 프론트 통합 fetch 로직 구현

		AnalysisPanel에서 두 팀의 데이터를 각각 요청하지 않고 한 번에 처리하도록 구조 개편

		이후 클릭 시 경기 상세 전환, 배당 상세분석 확장 예정


