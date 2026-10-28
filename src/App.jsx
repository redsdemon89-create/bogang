// 보강 도우미 전체 화면: 위쪽 제목 줄 + 탭 3개(결강 등록 / 보강 배정 / 시수 통계)

import { useEffect, useState } from 'react'
import { loadData, saveData } from './storage.js'
import { recommendSubstitutes } from './logic/recommend.js'
import { nextAbsenceId } from './logic/absence.js'
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

function App() {
  // 지금 보고 있는 탭
  const [tab, setTab] = useState('register')
  // 바뀌지 않는 기본 자료(meta, teachers, timetable). 불러오기 전에는 null
  const [base, setBase] = useState(null)
  // 결강 목록: 이 하나의 상태로 관리합니다
  const [absences, setAbsences] = useState([])
  // 보강 배정 탭에서 고른 결강의 id
  const [selectedId, setSelectedId] = useState(null)

  // 화면이 처음 열릴 때 한 번 데이터를 불러옵니다 (storage.js를 통해서)
  useEffect(() => {
    loadData().then((data) => {
      setBase(data)
      setAbsences(data.absences)
    })
  }, [])

  if (!base) {
    return <p className="app">불러오는 중…</p>
  }

  const { meta, teachers, timetable } = base

  // 결강 목록을 바꾸는 곳은 모두 이 함수를 거칩니다: 화면을 바꾸고, 저장도 합니다
  function updateAbsences(next) {
    setAbsences(next)
    saveData({ ...base, absences: next }).catch((error) => {
      console.error('저장하지 못했습니다.', error)
    })
  }

  function addAbsence(absence) {
    const id = nextAbsenceId(absences)
    updateAbsences([...absences, { id, ...absence, substituteId: null }])
  }

  function deleteAbsence(id) {
    updateAbsences(absences.filter((a) => a.id !== id))
  }

  // teacherId에 null을 넣으면 배정 취소
  function assignSubstitute(absenceId, teacherId) {
    updateAbsences(
      absences.map((a) => (a.id === absenceId ? { ...a, substituteId: teacherId } : a)),
    )
  }

  // 결강을 고르면 추천 칸이 있는 맨 위로 올라갑니다
  function selectAbsence(id) {
    setSelectedId(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const selected = absences.find((a) => a.id === selectedId)
  const candidates = selected
    ? recommendSubstitutes(selected, { teachers, timetable, absences })
    : []

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
              timetable={timetable}
              absences={absences}
              onAdd={addAbsence}
            />
            <AbsenceList absences={absences} teachers={teachers} onDelete={deleteAbsence} />
          </>
        )}

        {tab === 'assign' && (
          <>
            <SubstitutePicker
              absence={selected}
              teachers={teachers}
              candidates={candidates}
              onAssign={(teacherId) => assignSubstitute(selected.id, teacherId)}
              onUnassign={() => assignSubstitute(selected.id, null)}
            />
            <AbsenceList
              absences={absences}
              teachers={teachers}
              onSelect={selectAbsence}
              selectedId={selectedId}
            />
          </>
        )}

        {tab === 'stats' && (
          <StatsTable teachers={teachers} absences={absences} defaultMonth={meta.month} />
        )}
      </main>
    </div>
  )
}

export default App
