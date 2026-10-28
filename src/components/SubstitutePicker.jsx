// 보강 교사 추천: 결강 하나를 골라 그 시간에 보강할 교사 후보를 보여 줌 (아직 추천 규칙·배정 동작 없음)

import { formatDate, teacherName } from '../logic/format.js'

function SubstitutePicker({ absence, teachers }) {
  if (!absence) {
    return (
      <section className="card">
        <h2>보강 교사 추천</h2>
        <p className="empty">배정할 결강이 없습니다.</p>
      </section>
    )
  }

  // 지금은 결강 교사 본인만 빼고 모두 보여 줍니다.
  // plan.md의 추천 규칙(빈 시간·시수 적은 순 등)은 다음 단계에서 src/logic/에 만듭니다.
  const candidates = teachers.filter((t) => t.id !== absence.teacherId)

  return (
    <section className="card">
      <h2>보강 교사 추천</h2>
      <p className="picker-target">
        {formatDate(absence.date)} {absence.period}교시 · {absence.class} · {absence.subject}
        {' '}(결강: {teacherName(teachers, absence.teacherId)})
      </p>
      <p className="hint">※ 추천 규칙은 아직 적용 전이라 전체 교사가 보입니다.</p>
      <div className="candidate-list">
        {candidates.map((t) => (
          <button key={t.id} type="button" className="candidate">
            {t.name}
            <span className="candidate-subject">{t.subject}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default SubstitutePicker
