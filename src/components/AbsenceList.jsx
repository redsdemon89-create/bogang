// 결강 목록: 등록된 결강을 날짜·교시 순서로 표에 보여 줌

import { formatDate, teacherName } from '../logic/format.js'

function AbsenceList({ absences, teachers }) {
  // 날짜 → 교시 순서로 정렬한 복사본 (원래 목록은 그대로 둡니다)
  const sorted = [...absences].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? -1 : 1
    return a.period - b.period
  })

  return (
    <section className="card">
      <h2>등록된 결강 ({absences.length}건)</h2>
      {/* 화면이 좁으면 표만 옆으로 밀어서 볼 수 있습니다 */}
      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>날짜</th>
              <th>교시</th>
              <th>학반</th>
              <th>과목</th>
              <th>결강 교사</th>
              <th>사유</th>
              <th>보강 교사</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr>
                <td colSpan="8" className="empty">아직 등록된 결강이 없습니다.</td>
              </tr>
            )}
            {sorted.map((a, index) => (
              <tr key={a.id}>
                <td>{index + 1}</td>
                <td>{formatDate(a.date)}</td>
                <td>{a.period}교시</td>
                <td>{a.class}</td>
                <td>{a.subject}</td>
                <td>{teacherName(teachers, a.teacherId)}</td>
                <td>{a.reason}</td>
                <td>
                  {a.substituteId
                    ? teacherName(teachers, a.substituteId)
                    : <span className="not-assigned">미배정</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default AbsenceList
