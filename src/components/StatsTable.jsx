// 교사별 시수: 고른 달의 교사별 보강 시수를 많은 순으로 표에 보여 줌

import { useState } from 'react'
import { listMonths, monthlyStats } from '../logic/stats.js'
import { formatMonth } from '../logic/format.js'

function StatsTable({ teachers, absences, defaultMonth }) {
  // 지금 고른 달 (화면 안에서만 쓰는 값)
  const [month, setMonth] = useState(defaultMonth)

  const months = listMonths(absences, defaultMonth)
  const stats = monthlyStats(teachers, absences, month)
  // 모든 교사의 시수를 더한 합계
  const total = stats.reduce((sum, row) => sum + row.count, 0)

  return (
    <section className="card">
      <h2>교사별 보강 시수</h2>
      <label className="month-picker">
        월 선택
        <select value={month} onChange={(event) => setMonth(event.target.value)}>
          {months.map((m) => (
            <option key={m} value={m}>{formatMonth(m)}</option>
          ))}
        </select>
      </label>

      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>교사</th>
              <th>교과</th>
              <th>보강 시수</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.subject}</td>
                <td>{row.count}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan="2">합계</th>
              <th>{total}</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  )
}

export default StatsTable
