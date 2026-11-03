# 3. 남은 Docker 운영·VS Code 연동·README 제출

이 문서는 앞으로 수행할 사용자 실습 가이드다. 예상 출력은 실제 증거가 아니다. 성공 여부는 실행 결과로 확인하고, 아직 하지 않은 항목에는 완료 표시를 하지 않는다.

**목표:** attach/exec와 종료 차이를 관찰하고, 운영 로그·Git 설정·VS Code 연동 증거를 모아 README와 GitHub 제출물을 완성한다.

## 3-A. Windows PowerShell에서 저장소 열기

```powershell
Set-Location -LiteralPath 'C:\Users\gyung\Documents\Codex\2026-11-02\files-pasted-by-the-user-1\outputs\dev-workstation-lab_Codyssey11'
code .
```

앞 절과 같은 실습 저장소다. 다른 PC라면 clone한 폴더를 연다. 이 문서의 Docker·Git 명령은 Windows PowerShell에서 입력하고, Ubuntu Bash 안에 들어간 짧은 구간만 별도로 표시한다.

## 3-B. Docker 설치·이미지·컨테이너·운영 확인

```powershell
docker --version
docker info --format 'ServerVersion={{.ServerVersion}} OSType={{.OSType}}'
docker images
docker ps
docker ps -a
docker logs --tail 20 e1-1-bind-guide
docker stats --no-stream e1-1-bind-guide
```

- 버전은 설치된 클라이언트를, info의 ServerVersion은 엔진 응답을 확인한다.
- images는 이미지, ps는 실행 중인 컨테이너, ps -a는 종료된 것까지 보여준다.
- logs에서는 실제 HTTP 요청과 응답 상태를 찾는다.
- stats에서는 CPU·메모리 등 실제 사용량을 본다. 숫자는 실행 시마다 달라진다.
- bind-guide가 없다는 오류는 2번 실습을 아직 하지 않았거나 컨테이너를 제거한 경우다. 임의의 다른 컨테이너로 바꾸지 말고 진행 상태를 확인한다.

**남길 증거:** 각 명령과 실제 출력. 앞서 수집한 hello-world 성공과 Ubuntu 기본 명령 기록도 제출 문서에서 연결되어 있어야 한다.

## 3-C. exec의 추가 셸은 종료해도 주 프로세스가 남는가?

다른 실습을 방해하지 않도록 별도 Bash 컨테이너를 만든다.

**Windows PowerShell:**

```powershell
docker run -dit --name e1-1-shell-guide ubuntu:24.04 bash
docker exec -it e1-1-shell-guide bash
```

**새로 열린 Ubuntu Bash 안:**

```bash
echo "additional shell opened by exec"
exit
```

**Windows PowerShell로 돌아온 뒤:**

```powershell
docker inspect e1-1-shell-guide --format '{{.State.Running}}'
docker ps --filter name=e1-1-shell-guide
```

예상: true, 실행 중인 컨테이너가 표시된다. exec가 만든 추가 Bash만 끝났고 주 프로세스인 원래 Bash는 살아 있기 때문이다.

## 3-D. attach로 연결했다가 분리하기

**Windows PowerShell:**

```powershell
docker attach e1-1-shell-guide
```

**Ubuntu의 원래 Bash 안:**

```bash
echo "main shell connected by attach"
```

그다음 **Ctrl을 누른 채 P를 누르고, 이어서 Ctrl을 누른 채 Q를 누른다.** `Ctrl+P`, `Ctrl+Q`라는 문자를 타이핑하는 것이 아니라 키를 누른다. Windows 입력 줄로 돌아오면 확인한다.

```powershell
docker inspect e1-1-shell-guide --format '{{.State.Running}}'
```

예상: true. 이는 프로세스 종료가 아니라 터미널 연결을 분리한 것이다. Ctrl+C는 같은 의미가 아니므로 대신 사용하지 않는다. 분리되지 않으면 추가 키를 무작정 입력하지 말고 상황을 알려준다.

## 3-E. 주 프로세스 Bash에서 exit하면?

**Windows PowerShell:**

```powershell
docker attach e1-1-shell-guide
```

**Ubuntu Bash 안:**

```bash
exit
```

**Windows PowerShell로 돌아온 뒤:**

```powershell
docker inspect e1-1-shell-guide --format '{{.State.Status}}'
docker ps -a --filter name=e1-1-shell-guide
```

예상: exited. 이번에는 주 프로세스가 끝났기 때문에 컨테이너도 종료된다.

**남길 증거:** exec 뒤 true, detach 뒤 true, attach의 주 Bash에서 exit한 뒤 exited가 된 실제 명령·출력. 실제 관찰 내용을 본인 말로 한두 문장 정리한다.

## 3-F. Git 사용자·기본 브랜치·원격 확인

이 저장소에만 적용하는 설정이다. 계정은 사용자가 선택한 gyungmini306-blip, 커밋 이메일은 공개용 noreply 주소를 사용한다.

```powershell
git config user.name gyungmini306-blip
git config user.email gyungmini306-blip@users.noreply.github.com
git config init.defaultBranch main
git config --local --list
git branch --show-current
git remote -v
git status --short
```

예상: 현재 브랜치 main, 원격은 `https://github.com/gyungmini306-blip/codyssey-E1-1-dev-workstation.git`. init.defaultBranch는 앞으로 새 저장소를 만들 때의 기본값이며 기존 브랜치 이름을 바꾸는 명령은 아니다. 현재 브랜치도 별도로 확인한다.

설정 출력에 토큰·비밀번호·토큰이 들어 있는 URL 등이 없는지 확인한다. 로그인 정보나 인증 코드를 문서·캡처·채팅에 넣지 않는다.

## 3-G. VS Code에서 저장소 연동 증거 수집

1. `code .`로 열린 창의 폴더가 이 과제 저장소인지 확인한다.
2. 왼쪽 소스 제어(Source Control) 화면을 연다.
3. main 브랜치와 이번 수정 파일을 확인한다.
4. 마지막 push를 VS Code의 통합 터미널에서 실행하거나, 소스 제어의 Push 기능으로 실행한다. 일반 Git 작업에는 별도 확장이 필수는 아니다. 로그인 요청이 나오면 GitHub 계정을 gyungmini306-blip로 선택하고 브라우저에서 직접 인증한 뒤 돌아온다.
5. 계정 표시, 저장소 폴더·브랜치, 원격 전송 성공을 확인할 수 있는 화면을 캡처한다. 개인정보가 있는 다른 파일은 캡처에서 제외한다.

### VS Code 자체의 GitHub 로그인 화면이 추가로 필요한 경우

Git Credential Manager의 기존 인증으로 push하면 새 로그인 창이 나오지 않을 수 있다. 이것을 VS Code 계정 로그인 완료로 임의 표시하지 않는다. 과제의 명시적인 GitHub 로그인 증거를 위해 필요하면 공식 GitHub Pull Requests and Issues 확장을 사용한다.

```powershell
code --install-extension GitHub.vscode-pull-request-github
```

VS Code의 GitHub 아이콘 → Sign In → 브라우저에서 gyungmini306-blip로 인증 → VS Code로 돌아온다. 이후 계정과 저장소가 확인되는 화면을 캡처한다. 이 절을 위해 PR을 만들 필요는 없다. 인증 화면에 토큰이나 일회용 코드가 보이면 캡처하지 않는다.

이 절의 경로는 [VS Code 공식 GitHub 안내](https://code.visualstudio.com/docs/sourcecontrol/github)를 따른다. 로그인이나 메뉴를 찾지 못하면 현재 화면의 일반 메뉴 내용만 알려주고, 비밀번호·인증 코드는 보내지 않는다.

## 3-H. README와 실제 증거 정리

실습 후 명령과 출력을 채팅으로 보내면 기존 README에 실제 기록만 추가하는 작업을 함께 진행한다. 직접 정리할 때는 다음을 따른다.

| 수집한 것 | 저장할 위치 예시 | README에서 연결할 것 |
|---|---|---|
| 터미널·권한 전후 | docs/evidence/10-user-terminal.md | 현재 위치, 파일 조작, 파일·디렉토리 권한 로그 |
| bind 전후·COPY 비교 | docs/evidence/11-user-bind.md 및 png | 실행 명령, 호스트 수정, 변경 전후 응답·주소창 캡처 |
| 볼륨 삭제 전후 | docs/evidence/12-user-volume.md | 생성·연결·삭제·재연결·두 번의 cat 결과 |
| Docker 운영·attach/exec | docs/evidence/13-user-operations.md | 실제 상태·로그·자원 및 종료 차이 |
| Git·VS Code | docs/evidence/14-user-git.md 및 png | Git 설정, 계정·브랜치·원격 전송 증거 |

이 파일명은 앞으로 결과를 정리할 때의 예시다. 아직 없는 파일의 링크를 완료 증거로 추가하지 않는다. 실제 명령과 출력은 Markdown 코드블록에 붙이고, 예상 결과를 실제 출력으로 복사하지 않는다.

README의 환경, 체크리스트, 검증 방법, 증거 링크를 실제 결과와 맞춘다. 한 실습을 마칠 때마다 갱신해도 된다.

### 트러블슈팅 2건 이상

기존 [트러블슈팅 문서](../troubleshooting.md)에 실제 설치 문제 기록이 있다. 각 사례를 읽고 설명할 수 있게 정리한다. 새 오류가 발생하면 오류를 지우고 성공만 남기기보다 아래 순서로 실제 과정을 기록한다.

1. 문제: 어떤 명령에서 어떤 오류가 났는가?
2. 원인 가설: 무엇 때문이라고 생각했는가?
3. 확인: 어떤 명령·화면으로 확인했는가?
4. 해결/대안: 무엇을 바꾸었는가?
5. 결과: 재실행 후 실제로 무엇이 달라졌는가?

오류가 나지 않았는데 사례를 지어내지는 않는다. 공개 전 토큰·비밀번호·개인키·인증 코드·불필요한 개인 정보를 제거한다.

## 3-I. 검토하고 커밋·푸시

실제 기록을 정리한 다음, 저장소 루트에서 실행한다.

```powershell
git status --short
git diff -- app/index.html README.md
git add app/index.html README.md docs/evidence/
git diff --cached --stat
git diff --cached --check
```

추가될 파일 목록과 문서 내용을 확인한다. 캡처에는 주소창·포트와 응답 화면이 함께 있는지, 로그인 화면에는 인증 정보가 없는지 확인한다. 정상일 때 이어서 실행한다.

```powershell
git commit -m "Record my E1-1 terminal Docker and storage practice"
git push
git status --short --branch
git rev-parse HEAD
git ls-remote origin refs/heads/main
```

마지막 두 명령의 커밋 해시가 같으면 로컬의 최신 커밋이 원격 main에도 있는 것이다. 비밀번호를 직접 채팅에 보내지 않는다. 권한 오류나 rejected가 나오면 force push하지 말고 결과를 확인한다.

## 3-J. 최종 제출 전 확인

- GitHub 저장소에서 README와 소스가 실제로 보인다.
- README의 증거 링크와 이미지가 열린다.
- 필수 체크리스트 중 실제로 하지 않은 항목을 완료로 표시하지 않았다.
- README의 명령으로 이미지를 빌드·실행할 수 있다.
- 웹 접속·바인드 변경·볼륨 보존·Git/VS Code 연동 증거가 있다.
- 트러블슈팅 2건 이상과 개인정보 점검이 끝났다.

그다음 제출하는 것은 아래 **저장소 링크**다.

https://github.com/gyungmini306-blip/codyssey-E1-1-dev-workstation

위 항목을 실제 결과로 확인하기 전에는 과제 완성으로 간주하지 않는다. 결과를 보내면 남은 항목을 함께 점검한다.
