# 04. E1-1 저장소 연결

확인일: 2026-11-02 (Asia/Seoul). 사용자가 최종 선택한 계정은 `gyungmini306-blip`이며, 제출 저장소는 `codyssey-E1-1-dev-workstation`입니다.

## 저장소별 설정 변경 (실제 실행)

```powershell
PS> git remote set-url origin https://github.com/gyungmini306-blip/codyssey-E1-1-dev-workstation.git
PS> git config credential.https://github.com.username gyungmini306-blip
PS> git config user.email gyungmini306-blip@users.noreply.github.com
PS> git config user.name gyungmini306-blip
PS> git remote -v
origin https://github.com/gyungmini306-blip/codyssey-E1-1-dev-workstation.git (fetch)
origin https://github.com/gyungmini306-blip/codyssey-E1-1-dev-workstation.git (push)
```

`origin`은 원격 저장소의 별칭입니다. `set-url`은 업로드할 목적지를 변경하고, `git config`는 이 저장소에서 사용할 사용자 정보와 인증 계정을 지정합니다. 전역 설정이나 다른 수업 저장소의 인증은 변경하지 않았습니다. 기존 커밋의 작성자 정보는 당시 기록으로 보존하고 새 커밋부터 위 설정을 적용합니다.

업로드 검증 결과는 실제 push 후 추가합니다.
