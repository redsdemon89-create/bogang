// 보강 교사 추천: 고른 결강의 추천 교사를 보여 주고, 누르면 배정·배정 취소

import { formatDate, teacherName } from '../logic/format.js'

// candidates: recommend.js의 recommendSubstitutes() 결과 (추천 순서대로)
function SubstitutePicker({ absence, teachers, candidates, onAssign, onUnassign }) {
  if (!absence) {
    return (
      <section className="card">
        <h2>보강 교사 추천</h2>
        <p className="hint">아래 결강 목록에서 [고르기]를 눌러 결강을 골라 주세요.</p>
      </section>
    )
  }

  return (
    <section className="card">
      <h2>보강 교사 추천</h2>
      <p className="picker-target">
        {formatDate(absence.date)} {absence.period}교시 · {absence.class} · {absence.subject}
        {' '}(결강: {teacherName(teachers, absence.teacherId)})
      </p>

      {absence.substituteId ? (
        <div className="current-sub">
          <span>배정된 교사: <strong>{teacherName(teachers, absence.substituteId)}</strong></span>
          <button type="button" className="btn-sub" onClick={onUnassign}>배정 취소</button>
        </div>
      ) : (
        <p className="hint">교사를 누르면 보강이 배정됩니다.</p>
      )}

      {candidates.length === 0 ? (
        <p className="empty">이 시간에 보강할 수 있는 교사가 없습니다.</p>
      ) : (
        <div className="candidate-list">
          {candidates.map((t, index) => (
            <button
              key={t.id}
              type="button"
              className={t.id === absence.substituteId ? 'candidate assigned' : 'candidate'}
              onClick={() => onAssign(t.id)}
            >
              <span className="candidate-name">{index + 1}. {t.name}</span>
              <span className="candidate-info">
                {t.subject} · 이번 달 {t.count}시간
                {t.sameSubject && <span className="badge">같은 교과</span>}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

export default SubstitutePicker
