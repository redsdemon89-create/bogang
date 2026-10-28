// 보강 교사 추천 계산 (plan.md의 '추천 규칙'을 따릅니다)
//
// 1. 그 요일·교시에 수업이 없는 교사만
// 2. 결강 교사 본인, 그날 결강이 있는 교사, 같은 시간에 이미 보강 중인 교사는 제외
// 3. 이번 달 보강 시수가 적은 순서
// 4. 시수가 같으면 같은 교과 교사를 먼저

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

// "2026-11-03" → "화"
export function dayOfWeek(dateText) {
  const d = new Date(dateText + 'T00:00:00') // 0시로 맞춰야 날짜가 밀리지 않습니다
  return DAY_NAMES[d.getDay()]
}

// 이 교사가 추천에서 빠지는 이유를 돌려줍니다. 빠지지 않으면 null
// data: { timetable, absences } (sample.json과 같은 모양)
export function excludeReason(teacher, absence, data) {
  if (teacher.id === absence.teacherId) {
    return '결강 교사 본인'
  }

  const day = dayOfWeek(absence.date)
  const lessons = data.timetable[teacher.id]?.[day] ?? []
  const hasLesson = lessons.find((l) => l.period === absence.period)
  if (hasLesson) {
    return `${day} ${absence.period}교시에 수업 있음 (${hasLesson.class})`
  }

  const absentThatDay = data.absences.find(
    (a) => a.teacherId === teacher.id && a.date === absence.date,
  )
  if (absentThatDay) {
    return `그날 결강 (${absentThatDay.reason})`
  }

  // 지금 추천하려는 결강 자신은 빼고 봅니다 (이미 배정된 것을 바꿀 때를 위해)
  const busySubstitute = data.absences.find(
    (a) =>
      a.id !== absence.id &&
      a.substituteId === teacher.id &&
      a.date === absence.date &&
      a.period === absence.period,
  )
  if (busySubstitute) {
    return `같은 시간에 이미 보강 중 (${busySubstitute.class})`
  }

  return null
}

// 결강 하나에 대한 추천 교사 목록을 순서대로 돌려줍니다.
// 결과 예: [{ id, name, subject, count: 0, sameSubject: true }, ...]
export function recommendSubstitutes(absence, data) {
  const month = absence.date.slice(0, 7) // "2026-11"

  // 이번 달 보강 시수 세기
  function monthlyCount(teacherId) {
    return data.absences.filter(
      (a) => a.substituteId === teacherId && a.date.startsWith(month),
    ).length
  }

  return data.teachers
    .filter((t) => excludeReason(t, absence, data) === null)
    .map((t) => ({
      ...t,
      count: monthlyCount(t.id),
      sameSubject: t.subject === absence.subject,
    }))
    .sort((a, b) => {
      if (a.count !== b.count) return a.count - b.count // 시수 적은 순
      if (a.sameSubject !== b.sameSubject) return a.sameSubject ? -1 : 1 // 같은 교과 먼저
      return a.id < b.id ? -1 : 1 // 그래도 같으면 교사 번호 순 (순서가 매번 같게)
    })
}
