// 화면에 보여 줄 글자를 읽기 쉽게 바꾸는 도움 함수들

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

// "2026-11-03" → "11/3(화)"
export function formatDate(dateText) {
  const d = new Date(dateText + 'T00:00:00') // 0시로 맞춰야 날짜가 밀리지 않습니다
  return `${d.getMonth() + 1}/${d.getDate()}(${DAY_NAMES[d.getDay()]})`
}

// "2026-11" → "2026년 11월"
export function formatMonth(month) {
  const [year, mon] = month.split('-')
  return `${year}년 ${Number(mon)}월`
}

// 교사 id("t05")로 이름을 찾습니다. 없으면 빈 글자
export function teacherName(teachers, id) {
  const teacher = teachers.find((t) => t.id === id)
  return teacher ? teacher.name : ''
}
