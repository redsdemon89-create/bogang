// 결강 등록 검사(src/logic/absence.js)와 시수 통계(src/logic/stats.js) 검사
// 실행: npm test

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { validateAbsence, nextAbsenceId } from '../src/logic/absence.js'
import { monthlyStats, listMonths } from '../src/logic/stats.js'

const sample = JSON.parse(
  readFileSync(new URL('../data/sample.json', import.meta.url), 'utf8'),
)

// 가상교사01은 월요일 1교시에 1-1반 수업이 있습니다 (2026-11-02는 월요일)
const good = { date: '2026-11-02', period: 1, className: '1-1', teacherId: 't01', reason: '출장' }
const check = (input) => validateAbsence(input, sample.timetable, sample.absences)

test('올바른 결강은 통과한다', () => {
  assert.equal(check(good), null)
})

test('빈 칸이 있으면 등록하지 않는다', () => {
  for (const field of Object.keys(good)) {
    const input = { ...good, [field]: field === 'period' ? 0 : '' }
    assert.equal(check(input), '빈 칸을 모두 채워 주세요.', `${field}가 비었을 때`)
  }
})

test('그 시간에 수업이 없으면 등록하지 않는다', () => {
  assert.match(check({ ...good, period: 2 }), /수업이 없습니다/)
})

test('학반이 시간표와 다르면 등록하지 않는다', () => {
  assert.match(check({ ...good, className: '1-2' }), /1-1반입니다/)
})

test('주말에는 등록하지 않는다', () => {
  assert.match(check({ ...good, date: '2026-11-07' }), /주말/)
})

test('같은 결강을 두 번 등록하지 않는다', () => {
  // a1: 2026-11-03 3교시 2-2 가상교사05
  const input = { date: '2026-11-03', period: 3, className: '2-2', teacherId: 't05', reason: '출장' }
  assert.equal(check(input), '이미 등록된 결강입니다.')
})

test('새 결강 번호는 가장 큰 번호 + 1이다', () => {
  assert.equal(nextAbsenceId(sample.absences), 'a11')
  assert.equal(nextAbsenceId([{ id: 'a1' }, { id: 'a5' }]), 'a6') // 중간을 지워도 겹치지 않음
  assert.equal(nextAbsenceId([]), 'a1')
})

test('시수 통계는 그 달만 세고 많은 순으로 정렬한다', () => {
  const absences = structuredClone(sample.absences)
  absences[0].substituteId = 't04'
  absences[1].substituteId = 't09'
  absences[2].substituteId = 't09'
  absences.push({ id: 'a99', date: '2026-12-01', period: 1, substituteId: 't04' })

  const nov = monthlyStats(sample.teachers, absences, '2026-11')
  assert.deepEqual(nov.slice(0, 2).map((r) => [r.id, r.count]), [['t09', 2], ['t04', 1]])
  assert.equal(nov.reduce((sum, r) => sum + r.count, 0), 3)

  const dec = monthlyStats(sample.teachers, absences, '2026-12')
  assert.deepEqual([dec[0].id, dec[0].count], ['t04', 1])

  assert.deepEqual(listMonths(absences, '2026-11'), ['2026-11', '2026-12'])
})
