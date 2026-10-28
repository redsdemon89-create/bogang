---
name: deploy-check
description: GitHub에 올리거나 배포하기 전에 사용하는 점검 절차
---
아래를 차례로 점검하고 결과를 표로 보여준다. 하나라도 실패하면 멈추고 알린다.
1. .gitignore에 node_modules, dist, release, .env가 들어 있는가
2. 코드에 API 키나 비밀번호로 보이는 문자열이 없는가
3. data/에 가상 이름('가상교사')만 있는가
4. npm run build가 오류 없이 끝나는가