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

## 업로드 성공 및 원격 커밋 검증 (실제 실행)

```powershell
PS> git push -u origin main
branch 'main' set up to track 'origin/main'.
To https://github.com/gyungmini306-blip/codyssey-E1-1-dev-workstation.git
 * [new branch]      main -> main

PS> git rev-parse HEAD
6d45f618248d0d226b312222f570212dc1316ea8

PS> git ls-remote origin refs/heads/main
6d45f618248d0d226b312222f570212dc1316ea8 refs/heads/main

PS> git status --short --branch
## main...origin/main
```

로컬 HEAD와 원격 main의 커밋 해시가 일치해 파일과 이력이 GitHub에 올라갔음을 확인했습니다. 위 해시는 검증 당시 커밋이며, 이 증거 문서를 갱신해 커밋하면 최신 해시는 달라집니다. 과거의 계정 불일치는 사용자가 최종 선택한 계정의 새 저장소에 연결하여 해결했습니다. VS Code GitHub 로그인 검증은 별도 항목으로 남겨 두었습니다.
