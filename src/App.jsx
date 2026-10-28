// 보강 도우미 전체 화면: 위쪽 제목 줄 + 탭 3개(결강 등록 / 보강 배정 / 시수 통계)

import { useState } from 'react'
import { loadData } from './storage.js'
import { countSubstitutes } from './logic/stats.js'
import AbsenceForm from './components/AbsenceForm.jsx'
import AbsenceList from './components/AbsenceList.jsx'
import SubstitutePicker from './components/SubstitutePicker.jsx'
import StatsTable from './components/StatsTable.jsx'
import './App.css'

// 탭 목록: id는 프로그램이 쓰는 이름, label은 화면에 보이는 글자
const TABS = [
  { id: 'register', label: '결강 등록' },
  { id: 'assign', label: '보강 배정' },
  { id: 'stats', label: '시수 통계' },
]

// 처음 한 번 데이터를 불러옵니다 (storage.js를 통해서)
const data = loadData()

function App() {
  // 지금 보고 있는 탭
  const [tab, setTab] = useState('register')

  const { meta, teachers, absences } = data

  // 보강 배정 탭에서는 아직 배정되지 않은 첫 번째 결강을 보여 줍니다
  const firstUnassigned = absences.find((a) => !a.substituteId)

  return (
    <div className="app">
      <header className="title-bar">
        <h1>보강 도우미</h1>
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={tab === t.id ? 'tab active' : 'tab'}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="content">
        {tab === 'register' && (
          <>
            <AbsenceForm
              teachers={teachers}
              classes={meta.classes}
              periodsPerDay={meta.periodsPerDay}
              month={meta.month}
            />
            <AbsenceList absences={absences} teachers={teachers} />
          </>
        )}

        {tab === 'assign' && (
          <>
            <SubstitutePicker absence={firstUnassigned} teachers={teachers} />
            <AbsenceList absences={absences} teachers={teachers} />
          </>
        )}

        {tab === 'stats' && (
          <StatsTable
            stats={countSubstitutes(teachers, absences)}
            month={meta.month}
          />
        )}
      </main>
    </div>
  )
}

export default App
