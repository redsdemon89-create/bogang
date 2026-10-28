// 결강 등록: 날짜·교시·학반·결강 교사·과목·사유를 입력하는 칸 (아직 등록 동작 없음)

function AbsenceForm({ teachers, classes, periodsPerDay, month }) {
  // 1교시 ~ 7교시 목록 만들기
  const periods = Array.from({ length: periodsPerDay }, (_, i) => i + 1)

  // 그 달의 마지막 날짜 (예: "2026-11" → 30)
  const [year, mon] = month.split('-').map(Number)
  const lastDay = new Date(year, mon, 0).getDate()

  return (
    <section className="card">
      <h2>결강 입력</h2>
      {/* onSubmit에서 새로고침만 막아 둡니다. 등록 기능은 다음 단계에서 연결합니다 */}
      <form onSubmit={(event) => event.preventDefault()}>
        <div className="form-grid">
          <label>
            날짜
            <input type="date" min={`${month}-01`} max={`${month}-${lastDay}`} />
          </label>

          <label>
            교시
            <select defaultValue="">
              <option value="">선택</option>
              {periods.map((p) => (
                <option key={p} value={p}>{p}교시</option>
              ))}
            </select>
          </label>

          <label>
            학반
            <select defaultValue="">
              <option value="">선택</option>
              {classes.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          <label>
            결강 교사
            <select defaultValue="">
              <option value="">선택</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>
              ))}
            </select>
          </label>

          <label>
            과목
            <input type="text" readOnly placeholder="교사를 고르면 자동 입력" />
          </label>

          <label>
            사유
            <select defaultValue="">
              <option value="">선택</option>
              <option value="출장">출장</option>
              <option value="연수">연수</option>
              <option value="연가">연가</option>
            </select>
          </label>
        </div>

        <div className="buttons">
          <button type="submit" className="btn-main">등록</button>
          <button type="reset" className="btn-sub">입력 지우기</button>
        </div>
      </form>
    </section>
  )
}

export default AbsenceForm
