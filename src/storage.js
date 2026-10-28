// 데이터 저장·불러오기는 모두 이 파일을 거칩니다.
// 지금은 data/sample.json(가상 데이터)을 읽어 오기만 합니다.
import sample from '../data/sample.json'

export function loadData() {
  return sample
}
