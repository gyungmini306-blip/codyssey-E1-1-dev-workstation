# 01. 최초 환경 확인

확인일: 2026-11-02 (Asia/Seoul). 아래는 실제 실행 결과의 발췌다. 개인 PC 경로는 생략했다.

```powershell
PS> [System.Environment]::OSVersion.VersionString
Microsoft Windows NT 10.0.26200.0

PS> $PSVersionTable.PSVersion.ToString()
7.6.5

PS> git --version
git version 2.52.0.windows.1

PS> docker --version
The term 'docker' is not recognized as a name of a cmdlet, function, script file, or executable program.

PS> git clone https://github.com/gyungmin306-dev/dev-workstation-lab_Codyssey11.git
Cloning into 'dev-workstation-lab_Codyssey11'...
warning: You appear to have cloned an empty repository.

PS> git switch --orphan main
Switched to a new branch 'main'

PS> git config init.defaultBranch main
PS> git config user.email gyungmin306-dev@users.noreply.github.com
PS> git config core.autocrlf input

PS> git config --local --list
core.repositoryformatversion=0
core.filemode=false
core.bare=false
core.logallrefupdates=true
core.symlinks=false
core.ignorecase=true
core.autocrlf=input
remote.origin.url=https://github.com/gyungmin306-dev/dev-workstation-lab_Codyssey11.git
remote.origin.fetch=+refs/heads/*:refs/remotes/origin/*
branch.main.remote=origin
branch.main.merge=refs/heads/main
init.defaultbranch=main
user.email=gyungmin306-dev@users.noreply.github.com
```

Git 사용자 이름은 기존 전역 설정을 상속한다. 개인 이메일을 공개하지 않도록 이 저장소의 커밋 이메일만 GitHub noreply 주소로 설정했다. `core.filemode=false`는 Windows 체크아웃의 설정으로, 리눅스 권한 실습을 완료했다는 의미가 아니다.

VS Code 설치 경로도 확인했다. GitHub 로그인, Docker 엔진 동작, WSL 리눅스 실행 여부는 별도로 검증해야 한다.
