// 교사별 보강 시수를 세는 계산

// 결과 예: [{ id: "t01", name: "가상교사01", subject: "국어", count: 2 }, ...]
export function countSubstitutes(teachers, absences) {
  return teachers.map((teacher) => {
    const count = absences.filter((a) => a.substituteId === teacher.id).length
    return { ...teacher, count }
  })
}
