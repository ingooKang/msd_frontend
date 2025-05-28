const MatchDetailPanel = ({row, allRows})=>{
    return (
        <div className="match-detail baseball">
            <h3>{row.atname} vs {row.htname}</h3>
            <p>경기일 : {row.matchday} | 장소: {row.matchplace}</p>
            <p>스코어 : {row.ascore } - { row.hscore}</p>
            {/*이닝별 점수, 타자/투수 정보등 확장 예정 */}
        </div>
    );
};
export default MatchDetailPanel;