// 결강 등록에 필요한 계산: 입력 검사, 새 결강 번호 만들기

import { dayOfWeek } from './recommend.js'

// 입력한 결강이 등록해도 되는지 검사합니다.
// 문제가 있으면 안내 문구를, 없으면 null을 돌려줍니다.
// input: { date, period(숫자), className, teacherId, reason }
export function validateAbsence(input, timetable, absences) {
  const { date, period, className, teacherId, reason } = input

  if (!date || !period || !className || !teacherId || !reason) {
    return '빈 칸을 모두 채워 주세요.'
  }

  const day = dayOfWeek(date)
  if (day === '토' || day === '일') {
    return '주말에는 결강을 등록할 수 없습니다.'
  }

  // 그 교사가 그 요일·교시에 실제로 수업이 있는지
  const lesson = (timetable[teacherId]?.[day] ?? []).find((l) => l.period === period)
  if (!lesson) {
    return `이 교사는 ${day}요일 ${period}교시에 수업이 없습니다.`
  }
  if (lesson.class !== className) {
    return `이 교사의 ${day}요일 ${period}교시 수업은 ${lesson.class}반입니다.`
  }

  const duplicate = absences.some(
    (a) => a.teacherId === teacherId && a.date === date && a.period === period,
  )
  if (duplicate) {
    return '이미 등록된 결강입니다.'
  }

  return null
}

// 새 결강 번호: 지금 있는 번호 중 가장 큰 수 + 1 ("a10"이 있으면 "a11")
// 중간 결강을 지워도 번호가 겹치지 않게 개수가 아니라 가장 큰 수를 씁니다.
export function nextAbsenceId(absences) {
  const numbers = absences.map((a) => Number(a.id.slice(1)) || 0)
  return 'a' + (Math.max(0, ...numbers) + 1)
}
