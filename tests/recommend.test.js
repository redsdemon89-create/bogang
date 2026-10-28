// 보강 교사 추천 규칙(src/logic/recommend.js) 검사
// 실행: npm test

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  dayOfWeek,
  recommendSubstitutes,
} from '../src/logic/recommend.js'

// 가상 데이터 읽기 (검사마다 복사본을 만들어 써서 서로 영향을 주지 않게 합니다)
const sample = JSON.parse(
  readFileSync(new URL('../data/sample.json', import.meta.url), 'utf8'),
)
const freshData = () => structuredClone(sample)
const findAbsence = (data, id) => data.absences.find((a) => a.id === id)
const ids = (list) => list.map((t) => t.id)

test('2026-11-03은 화요일로 계산된다', () => {
  assert.equal(dayOfWeek('2026-11-03'), '화')
})

test('가상 데이터의 결강은 모두 그 교사의 실제 수업 시간이다', () => {
  const data = freshData()
  for (const a of data.absences) {
    const day = dayOfWeek(a.date)
    const lessons = data.timetable[a.teacherId][day] ?? []
    const lesson = lessons.find((l) => l.period === a.period)
    assert.ok(lesson, `${a.id}: ${a.teacherId}는 ${day} ${a.period}교시에 수업이 없음`)
    assert.equal(lesson.class, a.class, `${a.id}: 학반이 시간표와 다름`)

    const teacher = data.teachers.find((t) => t.id === a.teacherId)
    assert.equal(teacher.subject, a.subject, `${a.id}: 과목이 교사 교과와 다름`)
  }
})

test('추천 목록에 본인, 그 시간 수업 있는 교사, 그날 결강인 교사가 없다', () => {
  const data = freshData()
  for (const a of data.absences) {
    const day = dayOfWeek(a.date)
    for (const t of recommendSubstitutes(a, data)) {
      assert.notEqual(t.id, a.teacherId, `${a.id}: 결강 교사 본인이 추천됨`)

      const lessons = data.timetable[t.id][day] ?? []
      assert.ok(
        !lessons.some((l) => l.period === a.period),
        `${a.id}: ${t.id}는 그 시간에 수업이 있는데 추천됨`,
      )

      assert.ok(
        !data.absences.some((x) => x.teacherId === t.id && x.date === a.date),
        `${a.id}: ${t.id}는 그날 결강인데 추천됨`,
      )
    }
  }
})

test('그날 다른 교시에 결강인 교사도 빠진다', () => {
  const data = freshData()
  const a1 = findAbsence(data, 'a1') // 11/3(화) 3교시

  // 처음에는 가상교사04가 추천에 들어 있습니다
  assert.ok(ids(recommendSubstitutes(a1, data)).includes('t04'))

  // 가상교사04가 같은 날 2교시(2-1반 수업)에 결강하면
  data.absences.push({
    id: 'test-1', date: '2026-11-03', period: 2, class: '2-1',
    subject: '수학', teacherId: 't04', reason: '출장', substituteId: null,
  })
  assert.ok(!ids(recommendSubstitutes(a1, data)).includes('t04'))
})

test('같은 시간에 이미 보강 중인 교사는 빠진다', () => {
  const data = freshData()
  const a1 = findAbsence(data, 'a1') // 11/3(화) 3교시
  const a2 = findAbsence(data, 'a2') // 같은 날 같은 3교시

  assert.ok(ids(recommendSubstitutes(a1, data)).includes('t04'))

  // a2에 가상교사04를 배정하면, a1 추천에서는 빠져야 합니다
  a2.substituteId = 't04'
  assert.ok(!ids(recommendSubstitutes(a1, data)).includes('t04'))
})

test('추천 순서는 이번 달 보강 시수가 적은 순이고, 같으면 같은 교과가 먼저다', () => {
  const data = freshData()
  // 다른 날 결강에 보강을 배정해서 시수 차이를 만듭니다
  findAbsence(data, 'a3').substituteId = 't04' // 가상교사04: 2시간
  findAbsence(data, 'a4').substituteId = 't04'
  findAbsence(data, 'a5').substituteId = 't01' // 가상교사01: 1시간

  const a1 = findAbsence(data, 'a1') // 수학 결강
  const result = recommendSubstitutes(a1, data)

  assert.equal(result.find((t) => t.id === 't04').count, 2)
  assert.equal(result.find((t) => t.id === 't01').count, 1)

  for (let i = 1; i < result.length; i++) {
    const before = result[i - 1]
    const after = result[i]
    assert.ok(before.count <= after.count, `${before.id}(${before.count}) 다음에 ${after.id}(${after.count})`)
    if (before.count === after.count) {
      assert.ok(before.sameSubject || !after.sameSubject, `같은 시수인데 ${after.id}(같은 교과)가 뒤에 옴`)
    }
  }

  // 수학 교사인 가상교사04도 시수가 가장 많으니 맨 뒤로 갑니다
  assert.equal(result[0].id, 't06')
  assert.equal(result.at(-1).id, 't04')
})
