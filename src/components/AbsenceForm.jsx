// 결강 등록: 날짜·교시·학반·결강 교사·사유를 입력받아 검사한 뒤 새 결강을 넘겨줌

import { useState } from 'react'
import { validateAbsence } from '../logic/absence.js'
import { formatDate } from '../logic/format.js'

// 빈 입력 칸
const EMPTY = { date: '', period: '', className: '', teacherId: '', reason: '' }

function AbsenceForm({ teachers, classes, periodsPerDay, timetable, absences, onAdd }) {
  // 입력 칸에 적힌 값들 (화면 안에서만 쓰는 값이라 이 부품이 들고 있습니다)
  const [form, setForm] = useState(EMPTY)
  // 안내 문구. type은 'ok'(초록) 또는 'error'(빨강)
  const [message, setMessage] = useState({ text: '', type: '' })

  // 1교시 ~ 7교시 목록 만들기
  const periods = Array.from({ length: periodsPerDay }, (_, i) => i + 1)

  // 결강 교사를 고르면 과목이 자동으로 채워집니다
  const subject = teachers.find((t) => t.id === form.teacherId)?.subject ?? ''

  // 입력 칸 하나가 바뀔 때 그 칸의 값만 바꿉니다
  function change(field) {
    return (event) => setForm({ ...form, [field]: event.target.value })
  }

  function handleSubmit(event) {
    event.preventDefault() // 페이지 새로고침 막기

    const input = { ...form, period: Number(form.period) } // 글자 "3" → 숫자 3
    const error = validateAbsence(input, timetable, absences)
    if (error) {
      setMessage({ text: error, type: 'error' })
      return
    }

    onAdd({
      date: input.date,
      period: input.period,
      class: input.className,
      subject,
      teacherId: input.teacherId,
      reason: input.reason,
    })
    setMessage({ text: `${formatDate(input.date)} ${input.period}교시 결강을 등록했습니다.`, type: 'ok' })

    // 한 교사가 하루에 여러 시간 빠지는 경우가 많아서 날짜·교사·사유는 남기고 교시·학반만 비웁니다
    setForm({ ...form, period: '', className: '' })
  }

  function handleClear() {
    setForm(EMPTY)
    setMessage({ text: '', type: '' })
  }

  return (
    <section className="card">
      <h2>결강 입력</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            날짜
            <input type="date" value={form.date} onChange={change('date')} />
          </label>

          <label>
            교시
            <select value={form.period} onChange={change('period')}>
              <option value="">선택</option>
              {periods.map((p) => (
                <option key={p} value={p}>{p}교시</option>
              ))}
            </select>
          </label>

          <label>
            학반
            <select value={form.className} onChange={change('className')}>
              <option value="">선택</option>
              {classes.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          <label>
            결강 교사
            <select value={form.teacherId} onChange={change('teacherId')}>
              <option value="">선택</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>
              ))}
            </select>
          </label>

          <label>
            과목
            <input type="text" value={subject} readOnly placeholder="교사를 고르면 자동 입력" />
          </label>

          <label>
            사유
            <select value={form.reason} onChange={change('reason')}>
              <option value="">선택</option>
              <option value="출장">출장</option>
              <option value="연수">연수</option>
              <option value="연가">연가</option>
            </select>
          </label>
        </div>

        <div className="buttons">
          <button type="submit" className="btn-main">등록</button>
          <button type="button" className="btn-sub" onClick={handleClear}>입력 지우기</button>
          {message.text && <span className={`message ${message.type}`}>{message.text}</span>}
        </div>
      </form>
    </section>
  )
}

export default AbsenceForm
