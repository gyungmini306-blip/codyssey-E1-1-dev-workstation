# Codyssey E1-1 · 내 컴퓨터에 개발자용 작업실 꾸미기

## 1. 프로젝트 개요

다른 사람도 같은 웹 서버를 실행할 수 있도록 개발 환경을 구성했습니다. 먼저 Ubuntu의 Bash에서 파일과 권한을 다뤘습니다. 그다음 Dockerfile로 NGINX 웹 서버를 만들고, PC에서 접속해 HTML 변경이 반영되는지 확인했습니다. 별도의 Ubuntu 컨테이너에서는 볼륨에 쓴 데이터가 컨테이너 교체 후에도 남는지 확인했습니다. 소스와 실습 기록은 Git으로 관리하고 GitHub에 공유했습니다. 6절의 명령으로 저장소를 내려받아 웹 서버를 실행할 수 있습니다.

## 2. 실행 환경과 저장소 구성

| 항목 | 실제 실습 환경 |
|---|---|
| OS · 터미널 | Windows 11 · Windows Terminal |
| 셸 | Windows PowerShell 5.1, 일부 확인은 CMD, Linux 실습은 Ubuntu 24.04의 Bash |
| Docker | Docker Desktop 4.97.0 · CLI/엔진 29.9.2 · Linux 컨테이너 모드 · Compose v5.6.1 |
| Git · 편집기 | Git 2.52.0.windows.1 · VS Code |

| 경로 | 역할 |
|---|---|
| [app/index.html](app/index.html) | 웹 서버가 제공하는 정적 HTML |
| [Dockerfile](Dockerfile) · [nginx.conf](nginx.conf) | 이미지 구성과 NGINX 수신 포트·응답 설정 |
| [docs/evidence/](docs/evidence/) | 실습 로그와 캡처. 각 항목에서 해당 기록을 연결합니다. |
| [compose.yaml](compose.yaml) | 보너스 과제의 단일 웹 서비스 설정 |

Docker 명령은 Docker Desktop을 실행한 뒤 PowerShell에서 입력합니다. 파일과 권한 명령은 Ubuntu 컨테이너의 Bash에서 실행합니다. 실습 증거는 사용자가 제공한 캡처와 터미널 출력에서 발췌했습니다. 따라 실행할 명령은 실행 방법으로 표시했습니다.

## 3. 수행 체크리스트

- [x] 터미널 조작 · [명령과 출력](docs/evidence/10-user-terminal.md)
- [x] 파일·디렉터리 권한 변경 · [권한 전후 비교](#4-터미널과-권한-실습)
- [x] Docker 엔진 점검과 운영 · [목록·로그·리소스 기록](docs/evidence/13-user-operations.md)
- [x] hello-world와 Ubuntu 실습 · [실행과 셸 종료 결과](#5-docker-점검과-운영)
- [x] 커스텀 이미지 빌드·실행 · [빌드와 접속 결과](#6-커스텀-웹-서버-이미지와-포트-매핑)
- [x] 포트 매핑 접속 · [명령과 HTTP 응답](#6-커스텀-웹-서버-이미지와-포트-매핑)
- [x] 바인드 마운트와 볼륨 영속성 · [수정·삭제 전후 비교](#7-바인드-마운트와-볼륨-영속성)
- [x] Git 설정과 GitHub 푸시 · [마스킹한 설정과 푸시 결과](#8-git-설정과-github-연동)
- [x] VS Code GitHub 로그인 · [계정 메뉴 캡처](docs/evidence/14-vscode-github.png)
- [x] Git 원격 저장소 연동 · [사용자 원격 주소와 푸시 출력](docs/evidence/14-user-git.md)

## 4. 터미널과 권한 실습

Ubuntu 컨테이너에서 작업 폴더와 메모를 만들었습니다. 원본을 남겨 둔 채 복사본만 옮기고 삭제하기 위해 `cp`로 복사하고, `mv`로 위치와 이름을 바꾼 뒤 `rm`으로 지웠습니다. 기존 `e1-1-ubuntu`가 실행 중이면 PowerShell에서 `docker exec -it e1-1-ubuntu bash`로 들어갑니다. 새 환경에서는 `docker run --rm -it ubuntu:24.04 bash`로 시작할 수 있습니다.

### 작업 위치와 파일 목록

`pwd`에 작업 경로가 표시되고, `ls -la`에는 숨김 파일인 `.hidden-note`와 빈 파일인 `empty.txt`가 보입니다. `cat memo.txt`로 저장한 문구를 확인했습니다.

![작업 위치, 숨김 파일 목록, 메모 내용 확인](docs/evidence/23-terminal-location-list.png)

### 복사본 이동과 삭제

`mv` 뒤에는 `archive` 안에 `memo-renamed.txt`가 보입니다. 복사본과 빈 폴더를 지운 뒤 마지막 목록에서 원본 `memo.txt`가 남은 것을 확인했습니다.

![메모 복사본을 옮기고 지운 뒤 원본이 남은 화면](docs/evidence/21-terminal-copy-move-delete.png)

**파일 조작 명령과 실제 출력**

```console
$ mkdir -p /root/e1-1/guided-practice
$ cd /root/e1-1/guided-practice
$ pwd
/root/e1-1/guided-practice
$ touch empty.txt .hidden-note
$ echo "E1-1 terminal practice" > memo.txt
$ ls -la
-rw-r--r-- 1 root root    0 Nov  3 00:05 .hidden-note
-rw-r--r-- 1 root root    0 Nov  3 00:05 empty.txt
-rw-r--r-- 1 root root   23 Nov  3 00:05 memo.txt
$ cat memo.txt
E1-1 terminal practice
$ cp memo.txt memo-copy.txt
$ mkdir -p archive
$ mv memo-copy.txt archive/memo-renamed.txt
$ cd archive
$ ls -la
-rw-r--r-- 1 root root   23 Nov  3 00:08 memo-renamed.txt
$ cd ..
$ rm archive/memo-renamed.txt
$ ls -la archive
total 8
drwxr-xr-x 2 root root 4096 Nov  3 00:09 .
drwxr-xr-x 3 root root 4096 Nov  3 00:09 ..
$ rmdir archive
```

`/root/e1-1/guided-practice`는 루트부터 찾는 절대 경로이고, `archive/memo-renamed.txt`는 현재 폴더를 기준으로 찾는 상대 경로입니다. 목록에서 빈 파일 두 개의 크기가 0이고, 복사본을 지운 뒤 `archive`에 파일이 남지 않은 것을 확인했습니다.

### 파일과 디렉터리 권한 변경 전후

`chmod` 실행 뒤, 파일은 `644 → 600`, 폴더는 `755 → 700`이 되어 그룹과 기타 사용자의 권한이 사라졌습니다.

![chmod 전후의 파일과 폴더 권한을 확인한 실제 화면](docs/evidence/23-terminal-permissions.png)

`ls -l`로 파일을, `ls -ld`로 디렉터리 자체를 조회했습니다. 각각 권한을 변경한 뒤 다시 조회해 전후를 비교했습니다.

```console
$ ls -l memo.txt
-rw-r--r-- 1 root root 23 Nov  4 09:27 memo.txt
$ chmod 600 memo.txt
$ ls -l memo.txt
-rw------- 1 root root 23 Nov  4 09:27 memo.txt
$ ls -ld permissions-dir
drwxr-xr-x 2 root root 4096 Nov  4 09:32 permissions-dir
$ chmod 700 permissions-dir
$ ls -ld permissions-dir
drwx------ 2 root root 4096 Nov  4 09:32 permissions-dir
```

| 권한 | 일반 파일 | 디렉터리 |
|---|---|---|
| `r` = 4 | 내용 읽기 | 이름 목록 읽기 |
| `w` = 2 | 내용 수정 | 항목 생성·삭제·이름 변경에 필요하며 일반적으로 `x`도 필요 |
| `x` = 1 | 프로그램으로 실행 | 디렉터리 진입과 경로 탐색 |

숫자는 소유자·그룹·기타 사용자 순서입니다. `644`는 `rw-r--r--`, `755`는 `rwxr-xr-x`입니다. 위 실습에서는 권한 비트 변경을 확인했습니다. [터미널 전체 기록](docs/evidence/10-user-terminal.md)

## 5. Docker 점검과 운영

웹 서버를 만들기 전에 Docker가 컨테이너를 실행할 수 있는지 확인했습니다. PowerShell에서 `docker info`로 엔진 응답을 확인하고 `hello-world`를 실행했습니다. 이후 목록으로 실행·종료 상태를, 로그로 서버 응답을, `docker stats`로 리소스 사용량을 확인했습니다. 아래 출력은 컨테이너를 실행한 뒤 조회한 기록입니다.

```console
PS> docker --version
Docker version 29.9.2, build a82e528
PS> docker info --format 'ServerVersion={{.ServerVersion}} OSType={{.OSType}}'
ServerVersion=29.9.2 OSType=linux
PS> docker run --name e1-1-hello hello-world
Hello from Docker!
PS> docker images codyssey-workstation
codyssey-workstation:student-1
PS> docker ps -a
… hello-world … Exited (0) … e1-1-hello
PS> docker logs --tail 10 e1-1-bind-guide
… "GET /healthz HTTP/1.1" 200 …
PS> docker stats --no-stream e1-1-bind-guide
… e1-1-bind-guide   0.00%   8.945MiB / 7.527GiB …
PS> docker stop e1-1-volume-before
e1-1-volume-before
```

이미지 자동 다운로드 및 실행 기록은 [hello-world 로그](docs/evidence/05-hello-world.md), 전체 운영 출력은 [Docker 운영 로그](docs/evidence/13-user-operations.md), 중지와 삭제 확인은 [볼륨 실습 로그](docs/evidence/12-user-volume.md)에 있습니다.

**Ubuntu의 셸과 컨테이너 수명.** `docker run -dit --name e1-1-shell-guide ubuntu:24.04 bash`로 Bash를 주 프로세스로 시작했습니다. 추가 Bash에서 나갈 때와 주 Bash를 종료할 때의 차이를 비교했습니다.

```console
PS> docker exec -it e1-1-shell-guide bash
$ echo "additional shell opened by exec"
additional shell opened by exec
$ exit
PS> docker inspect e1-1-shell-guide --format '{{.State.Running}}'
true
PS> docker attach e1-1-shell-guide
$ exit
PS> docker inspect e1-1-shell-guide --format '{{.State.Status}}'
exited
```

추가 Bash를 종료한 뒤에는 실행 상태가 `true`였고, 주 Bash를 종료하자 `exited`로 바뀌었습니다. `attach` 연결만 분리했을 때는 주 Bash가 계속 실행됐습니다. [셸 실습 원본](docs/evidence/13-user-operations.md)

## 6. 커스텀 웹 서버 이미지와 포트 매핑

NGINX로 제 HTML을 제공하기 위해 [Dockerfile](Dockerfile)에 베이스 이미지 `nginx:stable-alpine`을 지정했습니다. `COPY`로 HTML과 서버 설정을 이미지에 넣고, `LABEL`로 이미지 용도를 기록했습니다. `EXPOSE 80`은 컨테이너가 사용할 포트를 표시하고, 실제 수신 포트는 [nginx.conf](nginx.conf)의 `listen 80`에서 정합니다. `HEALTHCHECK`는 컨테이너 내부에서 `/healthz`에 요청을 보내 NGINX 응답을 점검합니다.

**실행 방법.** Docker Desktop을 켜고 PowerShell에서 저장소를 내려받습니다. 이미 내려받았다면 처음 두 줄 대신 해당 저장소 폴더로 이동한 뒤 빌드부터 실행합니다.

```powershell
git clone https://github.com/gyungmini306-blip/codyssey-E1-1-dev-workstation.git e1-1
cd e1-1
docker build -t e1-1-web:v1 .
docker run -d --name e1-1-web -p 127.0.0.1:8080:80 e1-1-web:v1
curl.exe -i http://127.0.0.1:8080/healthz
```

**접속 결과 · PC 8080 → 컨테이너 80.** `docker build`로 만든 이미지에서 컨테이너를 실행했고, PC에서 보낸 요청에 NGINX가 아래와 같이 응답했습니다. 브라우저에서 `http://localhost:8080/`을 열어 웹페이지도 확인했습니다. 7절의 수정 전 캡처에서 주소창과 페이지를 함께 확인할 수 있습니다.

```console
=> => naming to docker.io/library/e1-1-web:v1                     0.0s
HTTP/1.1 200 OK
Server: nginx/1.30.6

ok
```

`v1`은 이미지에 붙인 태그입니다. 브라우저의 페이지 버전은 HTML 안의 문구로 결정됩니다. `8080`이 이미 사용 중이면 실행 명령과 접속 주소에 같은 빈 포트를 지정합니다.

## 7. 바인드 마운트와 볼륨 영속성

### HTML 수정 반영

PC에서 수정한 파일이 어느 서버에 반영되는지 비교했습니다. `8080` 서버를 그대로 둔 상태에서, 저장소 루트의 PowerShell로 **같은 이미지**를 쓰는 두 번째 서버를 실행했습니다. `8081`에만 PC의 `app/` 폴더를 NGINX의 웹 폴더에 읽기 전용으로 연결했습니다.

```powershell
$appPath = (Resolve-Path .\app).Path
$mountSpec = "type=bind,source=$appPath,target=/usr/share/nginx/html,readonly"
docker run -d --name e1-1-web-bind -p 127.0.0.1:8081:80 --mount $mountSpec e1-1-web:v1
```

두 페이지가 버전 2인 것을 확인한 뒤, PC의 `app/index.html`을 열고 화면에 표시되는 `페이지 버전: 2` 문구를 `페이지 버전: 3 (바인드 입니다.)`로 바꾼 뒤 저장했습니다. 이미지를 다시 빌드하거나 컨테이너를 다시 시작하지 않고, 두 페이지를 새로고침했습니다.

| 서버 | 읽는 파일 | 수정 전 | 수정 후 |
|---|---|---|---|
| `8080` | 빌드할 때 이미지에 복사해 둔 HTML | 버전 2 | **버전 2 유지** |
| `8081` | 바인드 마운트로 연결한 PC의 HTML | 버전 2 | **버전 3으로 변경** |

**수정 전.** 왼쪽 `8080`과 오른쪽 `8081` 모두 페이지 버전 2를 반환했습니다.

![수정 전 왼쪽 8080과 오른쪽 8081 모두 페이지 버전 2](docs/evidence/24-replay-bind-before-cropped.png)

**수정 후.** 같은 순서로, 왼쪽 `8080`은 버전 2를 유지했고 오른쪽 `8081`에만 버전 3이 표시됐습니다.

![수정 후 왼쪽은 버전 2를 유지하고 오른쪽은 버전 3으로 변경](docs/evidence/24-replay-bind-after.png)

### 컨테이너 교체 후 데이터 확인

컨테이너를 삭제한 뒤에도 메모가 남는지 확인했습니다. PowerShell에서 볼륨을 생성하고 첫 컨테이너에 연결해 메모를 저장했습니다. 그 컨테이너를 삭제한 뒤 새 컨테이너에 같은 볼륨을 연결했습니다.

**실행 방법.** 아래 명령은 파일명 입력 오류를 바로잡아 같은 결과를 확인할 수 있도록 정리한 절차이며, 원본 로그는 아닙니다. 처음 컨테이너의 `cat`과 새 컨테이너의 `cat` 출력을 비교합니다. 이름이 이미 사용 중이면 새 실습용 이름으로 바꿉니다.

```powershell
docker volume create e1-1-replay-data
docker run -d --name e1-1-volume-before --mount "type=volume,source=e1-1-replay-data,target=/data" ubuntu:24.04 sleep infinity
docker exec e1-1-volume-before sh -c 'echo E1-1-volume-proof > /data/memo.txt'
docker exec e1-1-volume-before cat /data/memo.txt
docker stop e1-1-volume-before
docker rm e1-1-volume-before
docker volume ls --filter "name=e1-1-replay-data"
docker run -d --name e1-1-volume-after --mount "type=volume,source=e1-1-replay-data,target=/data" ubuntu:24.04 sleep infinity
docker exec e1-1-volume-after cat /data/memo.txt
```

**실제 결과.** 기존 컨테이너를 삭제한 뒤에도 볼륨이 목록에 남았고, 새 컨테이너에서는 메모를 다시 쓰지 않고도 같은 내용을 읽었습니다.

```console
PS> docker volume ls --filter "name=e1-1-replay-data"
DRIVER    VOLUME NAME
local     e1-1-replay-data
```

| 확인 시점 | 실제 메모 출력 |
|---|---|
| 첫 컨테이너에서 삭제 전 조회 | `E1-1-volume-proof` |
| 새 컨테이너에 같은 볼륨 연결 후 조회 | `E1-1-volume-proof` |

## 8. Git 설정과 GitHub 연동

HTML 수정 이력을 남기고 공유하기 위해 Git으로 커밋한 뒤 GitHub에 푸시했습니다. 저장소 루트에서 작성자 설정과 기본 브랜치를 확인하고, 현재 브랜치는 별도 명령으로 조회했습니다. Git은 PC에서 변경 이력을 기록하고, GitHub는 푸시한 이력을 원격에서 공유합니다. 아래는 `git config --list`에 로컬 범위를 지정해 조회한 실제 출력의 마스킹 발췌입니다.

```console
CMD> git config --local --list
init.defaultbranch=main
user.email=[마스킹]
user.name=[마스킹]
PS> git --no-pager branch --show-current
main
PS> git push
   58c49d9..d580e49  main -> main
```

푸시 출력에서 HTML 수정 커밋이 원격 `main`에 올라간 것을 확인했습니다. VS Code 계정 메뉴에서는 GitHub 로그인 상태를 확인했습니다.

![VS Code에서 확인한 GitHub 로그인](docs/evidence/14-vscode-github.png)

사용자가 제공한 같은 저장소의 원격 주소 확인 결과입니다.

```console
PS> git --no-pager remote -v
origin  https://github.com/gyungmini306-blip/codyssey-E1-1-dev-workstation.git (fetch)
origin  https://github.com/gyungmini306-blip/codyssey-E1-1-dev-workstation.git (push)
```

## 9. 트러블슈팅

사용자가 제공한 오류 출력과 해결 후 결과를 정리했습니다.

| 문제 | 원인 가설 | 확인 방법과 결과 | 해결 및 결과 |
|---|---|---|---|
| PowerShell에서 웹 응답의 한글이 깨짐 | 웹 응답과 PowerShell의 문자 해석 방식이 달랐을 수 있음 | 같은 응답에서 영문 표식 `SIMPLE_PAGE_V1`은 보였지만 한글 문구는 깨져 보였습니다. | `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8`을 적용한 뒤 `curl.exe`로 다시 조회하니 한글 버전 문구가 정상 표시됐습니다. [사용자 전후 출력](docs/evidence/11-user-bind.md) |
| Git 설정 조회 후 다음 명령 결과 대신 less 도움말이 나옴 | 출력 보기 프로그램에 머물러 입력이 셸 명령으로 처리되지 않았을 수 있음 | 사용자 기록에 `SUMMARY OF LESS COMMANDS`와 `log file:`이 나타났습니다. | PowerShell에서 `git --no-pager`로 다시 조회한 뒤 `main`, 원격 주소, 파일 변경 상태를 확인했습니다. [사용자 오류 및 재조회 출력](docs/evidence/14-user-git.md) |

## 10. 보너스 1번 · Docker Compose 기초

빌드와 실행 옵션을 한 파일로 공유하려고 [compose.yaml](compose.yaml)에 웹 서비스 하나와 포트 연결 `8083:80`을 기록했습니다. Docker Desktop을 켠 상태에서 저장소 루트의 PowerShell로 실행했습니다.

```console
PS> docker compose -p e1-1-replay up -d --build --wait
Image e1-1-replay-web Built
Container e1-1-replay-web-1 Healthy
PS> curl.exe -i http://127.0.0.1:8083/healthz
HTTP/1.1 200 OK

ok
PS> docker compose -p e1-1-replay down
Container e1-1-replay-web-1 Removed
Network e1-1-replay_default Removed
```

**실행 → 접속 → 정리**를 확인했습니다. `up`으로 설정을 적용하니 상태 점검을 통과했고, PC의 `8083`에서 정상 응답을 받았습니다. `down` 후에는 Compose가 만든 컨테이너와 네트워크가 제거됐습니다.
