// 결강 목록: 등록된 결강을 날짜·교시 순서로 표에 보여 줌 (삭제 또는 고르기 버튼 포함)

import { formatDate, teacherName } from '../logic/format.js'

// onDelete가 있으면 [삭제] 칸이, onSelect가 있으면 [고르기] 칸이 생깁니다
function AbsenceList({ absences, teachers, onDelete, onSelect, selectedId }) {
  // 날짜 → 교시 순서로 정렬한 복사본 (원래 목록은 그대로 둡니다)
  const sorted = [...absences].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? -1 : 1
    return a.period - b.period
  })

  const unassigned = absences.filter((a) => !a.substituteId).length
  const columnCount = 8 + (onSelect ? 1 : 0) + (onDelete ? 1 : 0)

  // 삭제는 한 번 더 물어보고 진행합니다
  function handleDelete(a) {
    let question = `${formatDate(a.date)} ${a.period}교시 ${a.class} ${a.subject} 결강을 삭제할까요?`
    if (a.substituteId) {
      question += `\n배정된 보강(${teacherName(teachers, a.substituteId)})도 함께 지워집니다.`
    }
    if (window.confirm(question)) {
      onDelete(a.id)
    }
  }

  return (
    <section className="card">
      <h2>등록된 결강 ({absences.length}건, 미배정 {unassigned}건)</h2>
      {/* 화면이 좁으면 표만 옆으로 밀어서 볼 수 있습니다 */}
      <div className="table-box">
        <table>
          <thead>
            <tr>
              {onSelect && <th>고르기</th>}
              <th>번호</th>
              <th>날짜</th>
              <th>교시</th>
              <th>학반</th>
              <th>과목</th>
              <th>결강 교사</th>
              <th>사유</th>
              <th>보강 교사</th>
              {onDelete && <th>삭제</th>}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr>
                <td colSpan={columnCount} className="empty">아직 등록된 결강이 없습니다.</td>
              </tr>
            )}
            {sorted.map((a, index) => (
              <tr key={a.id} className={a.id === selectedId ? 'selected' : ''}>
                {onSelect && (
                  <td>
                    <button type="button" className="btn-small btn-select" onClick={() => onSelect(a.id)}>
                      {a.id === selectedId ? '선택됨' : '고르기'}
                    </button>
                  </td>
                )}
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
                {onDelete && (
                  <td>
                    <button type="button" className="btn-small btn-delete" onClick={() => handleDelete(a)}>
                      삭제
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default AbsenceList
