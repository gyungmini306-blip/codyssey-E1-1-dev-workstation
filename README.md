# E1-1 · 개발 작업실

다른 사람도 같은 방법으로 웹 서버를 실행할 수 있도록 Docker로 환경을 만들고, 접속·파일 수정·데이터 보존을 직접 확인했습니다.

## 실행 환경과 빠른 실행

Windows에서 Docker Desktop을 켜고 CMD에서 실행합니다. 실습 환경은 Windows 11 · Windows Terminal(CMD/PowerShell) · Ubuntu 컨테이너(Bash), Docker 29.9.2, Compose 5.6.1, Git 2.52.0입니다.

```cmd
git clone https://github.com/gyungmini306-blip/codyssey-E1-1-dev-workstation.git
cd codyssey-E1-1-dev-workstation
docker compose -p e1-1-bonus up -d --build --wait
curl.exe -i http://127.0.0.1:8083/healthz
```

브라우저에서 `http://localhost:8083/`을 엽니다. 확인을 마치면 `docker compose -p e1-1-bonus down`으로 종료합니다.

## 수행 체크리스트
- [x] 터미널 조작과 파일·폴더 권한 변경
- [x] Docker 설치·점검, 이미지·컨테이너 운영, Ubuntu 셸 진입
- [x] Dockerfile 빌드·실행, 포트 접속, 바인드 마운트와 볼륨 검증
- [x] Git 설정·푸시 및 VS Code GitHub 연결
- [x] 보너스 Compose 단일 서비스 실행·종료

## 본과제 실습과 검증 결과

아래 명령과 결과는 실습 당시 기록에서 발췌했습니다. 전체 출력은 각 항목의 증거 문서에 있습니다.

### 1. Ubuntu에서 파일과 권한 다루기

서버에서 파일을 찾고 관리하는 기본기를 익히기 위해 Ubuntu 컨테이너에서 실습했습니다. 절대 경로 `/root/e1-1/guided-practice`는 루트부터, 상대 경로 `archive/memo-renamed.txt`는 현재 폴더부터 찾습니다.

| 확인할 것 | 실행한 명령 | 실제 결과 |
|---|---|---|
| 위치와 파일 생성 | `mkdir`, `cd`, `pwd`, `touch`, `ls -la`, `cat memo.txt` | 실습 폴더, 빈 파일과 숨김 파일, 메모 `E1-1 terminal practice`를 확인했습니다. |
| 복사·이동·삭제 | `cp memo.txt memo-copy.txt`, `mv memo-copy.txt archive/memo-renamed.txt`, `rm archive/memo-renamed.txt` | `ls -la archive`에 새 이름의 파일이 보였고, 삭제 후에는 해당 파일이 사라졌습니다. |
| 파일 권한 | `chmod 600 memo.txt` → `chmod 644 memo.txt`, 각 단계에서 `ls -l memo.txt` | `-rw-------` → `-rw-r--r--` |
| 폴더 권한 | `chmod 700 permissions-dir` → `chmod 755 permissions-dir`, 각 단계에서 `ls -ld permissions-dir` | `drwx------` → `drwxr-xr-x` |

권한 숫자는 읽기(4), 쓰기(2), 실행 또는 폴더 진입(1)을 더한 값입니다. [파일 조작과 권한 변경 전후의 실제 출력](docs/evidence/10-user-terminal.md)

![CMD에서 확인한 파일 목록, 최종 권한과 메모](docs/evidence/17-cmd-terminal.png)

*목록에서 파일의 644와 폴더의 755를, 마지막 `cat` 아래에서 메모 내용을 확인할 수 있습니다.*

### 2. NGINX 웹 서버 실행과 검증

![같은 이미지로 띄운 서버의 HTML 응답과 볼륨 재연결 흐름](docs/evidence/docker-workstation-flow.svg)

*동작을 설명하는 개념 그림입니다. 실제 실습 결과는 아래에 있습니다.*

#### Docker 설치·운영과 셸

| 확인할 것 | 실행한 명령 | 실제 결과 |
|---|---|---|
| 엔진과 첫 실행 | `docker --version`, `docker info`, `docker run --name e1-1-hello hello-world`, `docker ps -a` | CLI와 엔진 29.9.2, `Hello from Docker!`, 종료 코드 `0`을 확인했습니다. |
| 이미지와 서버 상태 | `docker images`, `docker logs`, `docker stats` | 실습용 이미지, `/healthz` 요청의 HTTP 200, 조회 당시 메모리 `8.945MiB`를 확인했습니다. |
| 셸을 닫았을 때 | `docker exec`, `docker attach`, `docker inspect` | 추가 Bash를 닫아도 실행 상태가 유지됐고, 주 Bash를 종료하자 `exited`가 됐습니다. |

[Docker 첫 실행 출력](docs/evidence/05-hello-world.md) · [운영 명령과 셸 종료 출력](docs/evidence/13-user-operations.md)

#### 웹 서버에 접속

정적 HTML을 보내기 위해 기존 NGINX 이미지를 선택했습니다. Dockerfile에 HTML과 서버 설정을 담는 방법을 적고 `docker build`로 이미지를 만든 뒤, `docker run -d --name codyssey-web -p 127.0.0.1:8080:80 codyssey-workstation:1.0`으로 서버를 띄웠습니다. PC의 **8080번**으로 보낸 요청은 컨테이너 안의 **80번**으로 전달됩니다. 브라우저에서 페이지가 열렸고, 상태 확인 주소는 **`200 OK`와 `ok`**를 반환했습니다. [빌드·실행·접속 출력](docs/evidence/07-web-server.md)

![8080에서 열린 웹페이지와 8081에서 열린 수정 페이지](docs/evidence/15-browser-addresses.png)

*왼쪽은 기존 서버 `8080`의 V1, 오른쪽은 PC 파일을 연결한 `8081`의 V2입니다.*

#### HTML 수정 반영과 볼륨 보존

| 확인할 것 | 어떻게 비교했나 | 실제 결과 |
|---|---|---|
| PC에서 수정한 HTML이 반영되는지 | 같은 이미지로 `8081`과 `8082`를 띄우고, `8081`만 `--mount type=bind`로 PC 폴더를 연결했습니다. VS Code에서 HTML을 V2로 바꾼 뒤 두 주소에 `curl.exe`로 다시 요청했습니다. | 수정 전 둘 다 V1. 수정 후 **8081은 V2**, 이미지에 복사한 파일을 읽는 **8082는 V1**. |
| 컨테이너를 교체해도 메모가 남는지 | `docker volume create`로 만든 볼륨에 메모를 저장하고 `docker rm`으로 기존 컨테이너를 삭제했습니다. 새 컨테이너에 같은 볼륨을 연결해 `cat /data/memo.txt`로 읽었습니다. | 삭제 전과 재연결 후에 모두 **`E1-1-volume-proof`**가 나왔습니다. |

[바인드 마운트 실행과 수정 전후 출력](docs/evidence/11-user-bind.md) · [볼륨 생성·삭제·재연결 출력](docs/evidence/12-user-volume.md)

![두 서버의 버전과 새 컨테이너에서 읽은 메모](docs/evidence/17-cmd-docker.png)

*두 `curl.exe` 응답에서 V2와 V1을 비교하고, 마지막 `cat` 아래에서 새 컨테이너가 읽은 메모를 확인할 수 있습니다.*

### 3. Git으로 기록하고 GitHub에 공유하기

VS Code에서 HTML을 V2로 바꾸고 `git add`와 `git commit`으로 내 PC에 변경을 기록했습니다. `git push`로 GitHub에 올렸고, 실제 출력의 `58c49d9..d580e49  main -> main`으로 전송을 확인했습니다. `git config --local --list`에서 사용자 이름과 기본 브랜치를, VS Code 계정 메뉴에서 GitHub 로그인을 확인했습니다. [Git 설정·커밋·푸시의 실제 출력](docs/evidence/14-user-git.md)

![CMD에서 조회한 실습 커밋과 GitHub 원격 브랜치](docs/evidence/17-cmd-git.png)

*`git log`에 실습 커밋 `d580e49`, `git ls-remote`에 캡처 당시 원격 `main`의 커밋이 표시됩니다.*

![VS Code 계정 메뉴에 표시된 GitHub 로그인](docs/evidence/14-vscode-github.png)

*계정 메뉴에 `gyungmini306-blip (GitHub)`이 표시됩니다.*

## 문제 해결

| 문제 | 원인과 확인 | 해결 |
|---|---|---|
| 파일 목록 조회 실패 | `ls- la`를 입력해 셸이 `ls-`를 명령 이름으로 읽었습니다. `command not found`가 출력됐습니다. | `ls -la`로 고쳐 숨김 파일을 포함한 목록을 확인했습니다. |
| 바인드 마운트 실행 실패 | `--mount` 뒤 연결 설정이 빠져 `flag needs an argument: --mount`가 출력됐습니다. | 마운트 설정과 이미지 이름을 한 줄에 입력한 뒤 `docker ps`와 HTTP 응답을 확인했습니다. |

## 보너스 1번 · Docker Compose 기초

빌드 위치와 포트 연결을 `compose.yaml`에 저장했습니다. `services.web`은 웹 서버 한 개, `build: .`은 현재 폴더의 Dockerfile, `ports`는 **PC의 8083 → 컨테이너의 80** 연결을 뜻합니다. 같은 설정을 다시 입력하지 않고 서버를 띄울 수 있습니다.

| 실행한 명령 | 확인한 결과 |
|---|---|
| `docker compose -p e1-1-bonus up -d --build --wait` | 단일 웹 서버가 `healthy` 상태가 됐습니다. |
| `curl.exe -fsS -i http://127.0.0.1:8083/healthz` | `HTTP/1.1 200 OK`와 본문 `ok`를 받았습니다. |
| `docker compose -p e1-1-bonus down` | 종료 실습에서 컨테이너를 제거했고, 뒤이은 `ps -a`에는 표 제목만 남았습니다. |

![PowerShell에서 확인한 Compose 상태와 8083의 HTTP 응답](docs/evidence/19-compose-powershell.png)

*`docker compose ps` 아래의 포트·상태와 `curl.exe` 아래의 HTTP 200 응답을 확인할 수 있습니다. [Compose 시작·접속·종료 전체 출력](docs/evidence/16-compose-bonus.md)*
