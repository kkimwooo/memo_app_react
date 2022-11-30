# Memo Web application 만들기

## 1. 기능
   1. 라벨 리스트 표시 추가, 제거, 이름 변경
   2. 메모 리스트 표시 , 추가, 제거, 수정 가능
   3. 메모에 대해 라벨 지정, 해제 가능


## 2. 환경 구성 및 실행 가이드
   1. node version 18.2 이상 환경
   2. localhost:8080 으로 rest 요청


## 3. 실행 가이드
   1. Backend server가 동작하는지 확인 후 
   2. npm install
   3. npm run start


## 4. 사용 패키지
   1. react 18.2.0
   2. react-dom 18.2.0
   3. axios 1.2.0 : 서버와 통신을 위해 사용
   4. recoil 0.7.6 : State 관리 패키지, Redux에 비해 코드가 적어 빠르게 만들기 위해 사용
   5. recoil-persist 4.2.0 : State를 LocalStorage에 저장 관리 해주는 패키지


## 5. 개선 과제
   1. [ ] Server 통신하는 부분에 대해 실패 처리 필요 
      1. ex) axios 통신 부분 try-catch
   2. [ ] Server 통신 시 중복 호출 감소 필요 
      1. ex) Debounce 처리?
   3. [ ] 불필요한 state 변경점 개선 필요
      1. ex) 메모 작성 시 onChange로 State 바뀌는 부분 등
   4. [ ] Custom Hooks 활용하여 컴포넌트별 중복된 함수 제거
   5. [ ] LabelList, MemoList, MemoDetail 화면 컴포넌트로 더 잘게 분리 필요
   6. [ ] 뒤로 가기 정상 동작하지 않는 경우 있음. 확인하여 개선 필요
   7. [ ] Styled Component 등 활용하여 Style 정리 필요
   8. [ ] 화면 조절에 따른 반응형 적용 필요
