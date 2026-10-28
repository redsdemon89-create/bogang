// 교사별 보강 시수를 세는 계산

// 고를 수 있는 달 목록: 결강이 있는 달 + 기본 달, 오래된 순
// 결과 예: ["2026-11", "2026-12"]
export function listMonths(absences, defaultMonth) {
  const months = new Set([defaultMonth, ...absences.map((a) => a.date.slice(0, 7))])
  return [...months].sort()
}

// 그 달의 교사별 보강 시수. 많은 순, 같으면 교사 번호 순
// 결과 예: [{ id: "t04", name: "가상교사04", subject: "수학", count: 2 }, ...]
export function monthlyStats(teachers, absences, month) {
  return teachers
    .map((teacher) => {
      const count = absences.filter(
        (a) => a.substituteId === teacher.id && a.date.startsWith(month),
      ).length
      return { ...teacher, count }
    })
    .sort((a, b) => b.count - a.count || (a.id < b.id ? -1 : 1))
}
