# 03. 로컬 커밋 및 GitHub 인증 확인

확인일: 2026-11-02 (Asia/Seoul). 인증 정보는 기록하지 않았습니다.

```powershell
PS> git config user.name
박경민

PS> git diff --cached --check
[출력 없음: 공백 오류 없음]

PS> git commit -m "Initialize workstation lab and record Windows setup progress"
[main (root-commit) 48d440e] Initialize workstation lab and record Windows setup progress
 10 files changed, 319 insertions(+)

PS> git push -u origin main
remote: Permission to gyungmin306-dev/dev-workstation-lab_Codyssey11.git denied to gyungmini306-blip.
fatal: unable to access 'https://github.com/gyungmin306-dev/dev-workstation-lab_Codyssey11.git/': The requested URL returned error: 403

PS> git credential-manager github list
gyungmini306-blip

PS> ssh -T -o BatchMode=yes -o StrictHostKeyChecking=yes -o ConnectTimeout=10 git@github.com
git@github.com: Permission denied (publickey).

PS> git config credential.https://github.com.username gyungmin306-dev
PS> git credential-manager github login --username gyungmin306-dev --browser
[GitHub 로그인 화면 열림, 사용자 인증 대기]
```

HTTPS 업로드 실패 원인은 저장된 인증 계정이 저장소 소유자와 다르며 쓰기 권한도 없기 때문입니다. 이 저장소 안에서 사용할 인증 사용자 이름만 지정했으며, 다른 계정의 저장된 인증은 삭제하지 않았습니다. SSH 방식도 현재 인증이 실패하므로 주소만 바꿔서는 해결되지 않습니다.

GitHub 로그인 및 업로드는 아직 완료되지 않았습니다. 로그인 후 `git push -u origin main`을 다시 실행하고 원격 브랜치의 커밋과 비교해야 합니다. VS Code에서 프로젝트를 열었지만 VS Code 자체의 GitHub 로그인 완료 증거는 별도 수집 대상입니다.
