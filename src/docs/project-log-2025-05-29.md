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

