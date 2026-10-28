// 교사별 시수: 이번 달 교사별 보강 시수와 합계를 표로 보여 줌

function StatsTable({ stats, month }) {
  // 모든 교사의 시수를 더한 합계
  const total = stats.reduce((sum, row) => sum + row.count, 0)

  return (
    <section className="card">
      <h2>{month.replace('-', '년 ')}월 교사별 보강 시수</h2>
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
