// 데이터 저장·불러오기는 모두 이 파일을 거칩니다.
// 다른 파일에서는 localStorage를 직접 쓰지 않고, loadData()·saveData()만 씁니다.
//
// 지금: 브라우저의 localStorage에 저장합니다.
// 나중(윈도우앱): window.api가 있으면 그쪽을 쓰도록 아래 "윈도우앱 자리"를 채웁니다.

import sample from '../data/sample.json'

const STORAGE_KEY = 'bogang-data'

// 처음 값: 가상 데이터를 복사해서 돌려줍니다 (원본 sample이 바뀌지 않게)
function initialData() {
  return structuredClone(sample)
}

// 데이터 불러오기. 저장된 게 없으면 data/sample.json을 처음 값으로 씁니다.
export async function loadData() {
  // ----- 윈도우앱 자리 (10차시에 채울 예정) -----
  // if (window.api) {
  //   const saved = await window.api.loadData()
  //   return saved ?? initialData()
  // }
  // ------------------------------------------------

  try {
    const text = localStorage.getItem(STORAGE_KEY)
    if (text) return JSON.parse(text)
  } catch (error) {
    // 저장된 글자가 깨졌거나 localStorage를 쓸 수 없는 경우: 처음 값으로 시작합니다
    console.warn('저장된 데이터를 읽지 못해 가상 데이터로 시작합니다.', error)
  }
  return initialData()
}

// 데이터 저장하기. 데이터 전체를 통째로 저장합니다.
export async function saveData(data) {
  // ----- 윈도우앱 자리 (10차시에 채울 예정) -----
  // if (window.api) {
  //   await window.api.saveData(data)
  //   return
  // }
  // ------------------------------------------------

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
