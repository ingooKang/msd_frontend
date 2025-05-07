function FilterBar({ year, setYear, round, setRound, roundList, roundInfo }) {
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let y = currentYear; y >= 2020; y--) {
      yearOptions.push(y);
    }
  
    return (
      <div style={{ marginBottom: "10px" }}>
        {/* 📌 연도, 회차, 요약 정보 테이블 */}
        <table style={{
          width: "100%",
          backgroundColor: "#f6f6f6",
          borderCollapse: "collapse",
          marginBottom: "10px",
          fontSize: "14px"
        }}>
          <tbody>
            <tr>
              <th style={{ padding: "6px", border: "1px solid #ccc", textAlign: "center", width: "10%" }}>연도</th>
              <td style={{ padding: "6px", border: "1px solid #ccc", width: "20%" }}>{year}</td>
              <th style={{ padding: "6px", border: "1px solid #ccc", textAlign: "center", width: "10%" }}>회차</th>
              <td style={{ padding: "6px", border: "1px solid #ccc", width: "20%" }}>{round}</td>
              <th style={{ padding: "6px", border: "1px solid #ccc", textAlign: "center", width: "10%" }}>발매기간</th>
              <td style={{ padding: "6px", border: "1px solid #ccc", width: "30%" }}>{roundInfo}</td>
            </tr>
          </tbody>
        </table>
  
        {/* 📌 드롭다운 영역 */}
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          {yearOptions.map((y) => (
            <option key={y} value={y}>{y}년</option>
          ))}
        </select>
        &nbsp;
        <select value={round} onChange={(e) => setRound(e.target.value)}>
          {roundList.map((r) => (
            <option key={r} value={r}>{r}회차</option>
          ))}
        </select>
      </div>
    );
  }
  
  export default FilterBar;
  