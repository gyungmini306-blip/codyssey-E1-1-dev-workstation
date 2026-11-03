# E1-1 · 개발 작업실

다른 사람도 같은 소스와 명령으로 웹 서버를 실행할 수 있도록 개발 환경을 구성했습니다. Ubuntu 컨테이너에서 터미널과 권한을 연습하고, 별도의 NGINX 컨테이너에서 접속·파일 수정·데이터 보존을 검증했습니다. 실행 방법과 실제 결과는 이 저장소에 기록했습니다.

## 실습 결과 한눈에 보기

- **접속** — 브라우저에서 내 PC의 `8080`을 열어 컨테이너의 NGINX가 보낸 페이지를 확인했습니다.
- **수정 반영** — VS Code에서 HTML을 V2로 바꾸니 PC 파일을 연결한 `8081`만 V2로 바뀌고, 이미지의 파일을 읽는 `8082`는 V1을 유지했습니다.
- **데이터 보존** — 컨테이너를 삭제한 뒤 새 컨테이너에 같은 볼륨을 연결해 기존 메모를 다시 읽었습니다.

![브라우저 접속 결과. 기존 서버 8080은 V1, PC 파일을 연결한 서버 8081은 V2](docs/evidence/15-browser-addresses.png)

*주소창과 페이지 버전을 함께 보면 됩니다. 왼쪽은 기존 서버 `8080`의 V1, 오른쪽은 PC 파일을 연결한 `8081`의 V2입니다.*

## 빠른 실행

Windows에서 Docker Desktop을 켜고 아래 명령을 실행합니다. 실습에서는 주로 **PowerShell**에서 Docker 명령을 입력하고, **VS Code**에서 HTML을 수정했습니다. Linux 파일·권한 실습은 Ubuntu 컨테이너의 Bash에서 했고, 완료 상태를 다시 확인할 때는 CMD를 사용했습니다. 버전은 Docker 29.9.2, Compose 5.6.1, Git 2.52.0입니다.

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

## 실습 방법과 검증 결과

아래 코드 블록은 실습 당시 명령과 핵심 출력입니다. 반복 줄과 긴 ID는 줄였습니다. 빠른 실행은 새 환경에서 재현할 때 사용하는 명령입니다.

### 터미널과 권한

**왜 했나** — 서버를 관리할 때는 지금 어느 폴더에 있는지, 어떤 파일이 있는지, 누가 읽거나 쓸 수 있는지 확인해야 합니다. Ubuntu 컨테이너에서 `pwd`와 `ls`로 위치와 파일을 확인하고, `chmod` 전후의 권한을 비교했습니다.

![CMD에서 ls와 cat을 실행한 화면](docs/evidence/17-cmd-terminal.png)

**화면에서 볼 곳** — `ls -la` 아래의 `memo.txt`는 `-rw-r--r--`(644), `permissions-dir`은 `drwxr-xr-x`(755)입니다. 마지막 `cat` 아래에는 파일에 적은 내용이 나옵니다. 이 화면은 최종 상태이고, 변경 전후의 명령과 출력은 아래에 있습니다.

절대 경로 `/root/e1-1/guided-practice`는 현재 위치와 관계없이 같은 폴더를 가리킵니다. 상대 경로 `archive/memo-renamed.txt`는 현재 폴더를 기준으로 찾습니다. 권한 숫자는 읽기(4), 쓰기(2), 실행 또는 디렉토리 진입(1)을 더한 값입니다. `644`는 소유자가 읽고 쓸 수 있고, `755`는 다른 사용자도 읽고 진입할 수 있습니다.

아래 표는 실제 명령과 출력에서 작업별로 확인한 내용만 뽑았습니다. PowerShell에서 `docker exec -it e1-1-ubuntu bash`를 실행해 Ubuntu 컨테이너에 들어간 뒤 실습했습니다.

| 작업 | 실행한 명령 | 확인한 결과 |
|---|---|---|
| 폴더 만들기와 이동 | `mkdir -p /root/e1-1/guided-practice` → `cd /root/e1-1/guided-practice` → `pwd` | 현재 경로가 `/root/e1-1/guided-practice`로 표시됐습니다. |
| 파일 만들기와 읽기 | `touch empty.txt .hidden-note` → `echo "E1-1 terminal practice" > memo.txt` → `ls -la`와 `cat memo.txt` | 빈 파일과 숨김 파일이 목록에 보였고, 메모에는 `E1-1 terminal practice`가 들어 있었습니다. |
| 복사와 이름 변경 | `cp memo.txt memo-copy.txt` → `mkdir -p archive` → `mv memo-copy.txt archive/memo-renamed.txt` | `ls -la archive`에서 `memo-renamed.txt`를 확인했습니다. |
| 삭제 | `rm archive/memo-renamed.txt` → `rmdir archive` | 마지막 `ls -la`에서 `archive`는 사라지고 원본 `memo.txt`는 남았습니다. |

파일과 폴더의 권한을 각각 바꾼 뒤, `ls -l memo.txt`와 `ls -ld permissions-dir`에서 확인했습니다. 아래는 출력에서 권한 부분만 뽑은 비교입니다.

| 대상 | 처음 설정과 출력 | 변경 후 설정과 출력 |
|---|---|---|
| 파일 | `chmod 600 memo.txt` → `-rw-------` | `chmod 644 memo.txt` → `-rw-r--r--` |
| 폴더 | `chmod 700 permissions-dir` → `drwx------` | `chmod 755 permissions-dir` → `drwxr-xr-x` |

### Docker 설치·운영과 셸

**왜 했나** — Docker가 설치된 상태에서 실제로 컨테이너를 실행할 수 있는지 확인했습니다. `hello-world`의 종료 코드 `0`은 프로그램이 정상 종료됐다는 뜻입니다. 웹 서버처럼 계속 실행되는 컨테이너는 목록·로그·자원 사용량으로 상태를 살폈습니다.

서버 로그에서 상태 확인 요청이 HTTP 200으로 처리된 것을 확인했습니다. 아래는 처음 한 줄을 발췌한 결과입니다.

```console
PS> docker logs --tail 10 e1-1-bind-guide
127.0.0.1 - - [03/Nov/2026:00:37:26 +0000] "GET /healthz HTTP/1.1" 200 3 "-" "Wget" "-"
```

```powershell
PS> docker run --name e1-1-hello hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
4f55086f7dd0: Pull complete
d5e71e642bf5: Download complete
Digest: sha256:c567b231f656…
Status: Downloaded newer image for hello-world:latest
Hello from Docker!
This message shows that your installation appears to be working correctly.
[이후 안내문 생략]
PS> docker ps
PS> docker ps -a
30df56aa1c4b   hello-world   "/hello"   11 seconds ago   Exited (0) 10 seconds ago             e1-1-hello
```

```powershell
PS> docker --version
Docker version 29.9.2, build a82e528
PS> docker info --format 'ServerVersion={{.ServerVersion}} OSType={{.OSType}}'
ServerVersion=29.9.2 OSType=linux
PS> docker images --digests hello-world
hello-world   latest    sha256:c567b231f656…   c567b231f656   7 months ago   25.9kB
PS> docker inspect e1-1-hello --format '{{.Id}} {{.Config.Image}} {{.State.Status}} exit={{.State.ExitCode}}'
30df56aa1c4b… hello-world exited exit=0
```

```powershell
PS> docker images codyssey-workstation
                                                    i Info →   U  In Use
codyssey-workstation:1.0
                        47411e29e641       92.7MB         26.1MB    U
codyssey-workstation:2.0
                        8c59d743332c       92.8MB         26.1MB
codyssey-workstation:3.0
                        7ec0b8a7ebd6       92.8MB         26.1MB    U
codyssey-workstation:student-1
                        03847c26e8e8       92.8MB         26.1MB    U
```

```powershell
PS> docker ps -a
91ff958c97f5   ubuntu:24.04                     "sleep infinity"         2 minutes ago    Up 2 minutes                                       e1-1-volume-after
9fdf6ee013be   codyssey-workstation:student-1   "/docker-entrypoint.…"   15 minutes ago   Up 15 minutes (healthy)   127.0.0.1:8081->80/tcp   e1-1-bind-guide
5e144b9a442f   codyssey-workstation:student-1   "/docker-entrypoint.…"   16 minutes ago   Up 16 minutes (healthy)   127.0.0.1:8082->80/tcp   e1-1-copy-guide
998efe0a81d8   codyssey-workstation:3.0         "/docker-entrypoint.…"   19 hours ago     Up 19 hours (healthy)     127.0.0.1:8080->80/tcp   codyssey-web
eed7564ae9ed   codyssey-workstation:1.0         "/docker-entrypoint.…"   21 hours ago     Exited (0) 20 hours ago                            codyssey-web-v1
9e28c1505a09   ubuntu:24.04                     "bash"                   21 hours ago     Up 21 hours                                        e1-1-ubuntu
30df56aa1c4b   hello-world                      "/hello"                 21 hours ago     Exited (0) 21 hours ago                            e1-1-hello
```

```powershell
PS> docker stats --no-stream e1-1-bind-guide
9fdf6ee013be   e1-1-bind-guide   0.00%     8.945MiB / 7.527GiB   0.12%     16.7kB / 72.2kB   868kB / 8.19kB   9
```

```console
PS> docker run -dit --name e1-1-shell-guide ubuntu:24.04 bash
PS> docker exec -it e1-1-shell-guide bash
$ echo "additional shell opened by exec"
exit
additional shell opened by exec
exit
PS> docker inspect e1-1-shell-guide --format '{{.State.Running}}'
true
```

```console
PS> docker attach e1-1-shell-guide
$ exit
exit
PS> docker inspect e1-1-shell-guide --format '{{.State.Status}}'
exited
```

추가 Bash를 `exec`로 열었다가 종료해도 컨테이너는 유지됐습니다. `attach`로 연결한 주 Bash를 종료하자 컨테이너 상태가 `exited`로 바뀌었습니다.

### 이미지 빌드와 웹 접속

**왜 했나** — NGINX가 HTML을 보내도록 `docker build`로 이미지를 만들고, `docker run`으로 컨테이너를 띄웠습니다. **외부 8080 → 내부 80**으로 연결했기 때문에, 브라우저에서 내 PC의 8080번에 접속하면 컨테이너 안 NGINX가 요청을 받습니다.

`docker build` 명령 끝의 `.`은 **현재 폴더를 빌드에 사용할 범위로 지정**합니다. 이미지에 어떤 파일을 넣는지는 Dockerfile의 `COPY`가 정합니다.

기본 서버로 `nginx:stable-alpine`을 선택했습니다. Dockerfile은 `app/`의 HTML을 NGINX가 읽는 위치에 담고, `nginx.conf`로 문서 위치와 상태 확인 경로를 지정합니다. `HEALTHCHECK`는 서버가 응답하는지 확인합니다.

```powershell
PS> docker build --progress=plain -t codyssey-workstation:1.0 .
[다운로드 진행 표시 등 중간 출력 생략]
#7 [2/3] COPY nginx.conf /etc/nginx/conf.d/default.conf
#7 DONE 0.1s
#8 [3/3] COPY app/ /usr/share/nginx/html/
#8 DONE 0.0s
#9 naming to docker.io/library/codyssey-workstation:1.0 done
#9 DONE 1.2s
```

```powershell
PS> docker run -d --name codyssey-web -p 127.0.0.1:8080:80 codyssey-workstation:1.0
PS> docker ps --filter name=codyssey-web
eed7564ae9ed   codyssey-workstation:1.0   "/docker-entrypoint.…"   34 seconds ago   Up 33 seconds (healthy)   127.0.0.1:8080->80/tcp   codyssey-web
PS> docker inspect codyssey-web --format '{{.State.Health.Status}}'
healthy
```

```powershell
PS> curl.exe -i --max-time 15 http://localhost:8080/healthz
HTTP/1.1 200 OK
ok
```

### 바인드 마운트와 COPY 비교

| 내 PC에서 접속한 포트 | 연결된 NGINX와 HTML | 수정 후 결과 |
|---|---|---|
| `8080` | 기존 컨테이너의 `80`번 · 이미지에 복사한 HTML | V1 |
| `8081` | 바인드 마운트 컨테이너의 `80`번 · PC에서 연결한 HTML | V2 |
| `8082` | 비교용 COPY 컨테이너의 `80`번 · 이미지에 복사한 HTML | V1 |

각 NGINX는 별도 컨테이너에서 `80`번으로 요청을 받습니다. V1과 V2는 HTML에 적은 버전 표시입니다. `8081`과 `8082`는 같은 이미지로 시작해, PC 파일을 수정했을 때 연결 방식에 따라 결과가 달라지는지 비교했습니다.

**왜 두 서버를 띄웠나** — VS Code에서 HTML을 버전 2로 직접 바꾼 뒤, 수정 내용이 어느 서버에 반영되는지 확인했습니다. 같은 이미지로 띄운 두 서버 중 8081은 내 PC의 폴더를 읽어서 V2가 됐고, 8082는 빌드할 때 복사한 파일을 읽어서 V1이 남았습니다. README 첫 화면은 별도로 켜 둔 기존 8080 서버의 V1과 8081의 V2를 보여줍니다.

![CMD에서 확인한 두 서버의 버전과 볼륨 메모](docs/evidence/17-cmd-docker.png)

**화면에서 볼 곳** — `docker ps`에는 두 서버가 각각 `8081 → 80`, `8082 → 80`으로 연결돼 있습니다. 바로 아래 `curl` 결과에서 **8081은 V2, 8082는 V1**입니다. 맨 아래 `cat /data/memo.txt` 결과는 새 컨테이너에서 다시 읽은 볼륨 메모입니다.

```powershell
PS> docker run -d --name e1-1-copy-guide -p 127.0.0.1:8082:80 codyssey-workstation:student-1
PS> $appPath = (Resolve-Path .\app).Path
PS> docker run -d --name e1-1-bind-guide -p 127.0.0.1:8081:80 --mount "type=bind,source=$appPath,target=/usr/share/nginx/html,readonly" codyssey-workstation:student-1
PS> docker ps --filter name=guide
9fdf6ee013be   codyssey-workstation:student-1   "/docker-entrypoint.…"   15 seconds ago       Up 14 seconds (healthy)       127.0.0.1:8081->80/tcp   e1-1-bind-guide
5e144b9a442f   codyssey-workstation:student-1   "/docker-entrypoint.…"   About a minute ago   Up About a minute (healthy)   127.0.0.1:8082->80/tcp   e1-1-copy-guide
```

수정 전에는 두 서버가 V1을 반환했습니다. HTML만 바꾼 뒤 `8081`은 V2, `8082`는 V1이었습니다.

### 볼륨 생성·삭제·재연결

**왜 컨테이너를 삭제했나** — 기존 컨테이너에서 볼륨에 저장한 데이터가 새 컨테이너에서도 유지되는지 확인했습니다. 볼륨은 게임의 세이브 폴더처럼 데이터를 따로 두는 공간입니다. 기존 컨테이너를 삭제한 뒤 같은 볼륨을 연결하니 메모를 다시 읽을 수 있었습니다.

```powershell
PS> docker volume create e1-1-user-data
e1-1-user-data
PS> $volumeMount = "type=volume,source=e1-1-user-data,target=/data"
PS> docker run -d --name e1-1-volume-before --mount $volumeMount ubuntu:24.04 sleep infinity
PS> docker exec e1-1-volume-before sh -c 'echo E1-1-volume-proof > /data/memo.txt'
PS> docker exec e1-1-volume-before cat /data/memo.txt
E1-1-volume-proof
```

```powershell
PS> docker stop e1-1-volume-before
e1-1-volume-before
PS> docker rm e1-1-volume-before
e1-1-volume-before
PS> docker ps -a --filter name=e1-1-volume-before
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
PS> docker volume ls --filter name=e1-1-user-data
local     e1-1-user-data
```

```powershell
PS> $volumeMount = "type=volume,source=e1-1-user-data,target=/data"
PS> docker run -d --name e1-1-volume-after --mount $volumeMount ubuntu:24.04 sleep infinity
PS> docker exec e1-1-volume-after cat /data/memo.txt
E1-1-volume-proof
```

### Git 설정과 GitHub 연결

**왜 했나** — HTML을 V2로 바꾼 내용을 Git으로 내 PC에 커밋했습니다. 그 기록을 GitHub의 원격 저장소에 푸시해 다른 사람도 볼 수 있게 했고, VS Code에서 GitHub 계정 연결을 확인했습니다.

![CMD에서 git log와 git ls-remote를 실행한 화면](docs/evidence/17-cmd-git.png)

**화면에서 볼 곳** — `git log` 아래에 HTML을 V2로 바꾼 실습 커밋 `d580e49`가 보입니다. `git ls-remote` 아래에는 캡처 당시 GitHub의 `main` 커밋이 표시됩니다.

```console
CMD> git --version
git version 2.52.0.windows.1
CMD> git config --local --list
remote.origin.url=https://github.com/gyungmini306-blip/codyssey-E1-1-dev-workstation.git
init.defaultbranch=main
user.email=[마스킹]
user.name=gyungmini306-blip
```

```powershell
PS> git commit -m "Update practice page to version 2"
[main d580e49] Update practice page to version 2
PS> git push
To https://github.com/gyungmini306-blip/codyssey-E1-1-dev-workstation.git
   58c49d9..d580e49  main -> main
```

![VS Code에 표시된 GitHub 계정](docs/evidence/14-vscode-github.png)

### 보너스 Docker Compose

빌드 위치와 포트 연결을 `compose.yaml`에 적어 두면, 같은 옵션을 매번 입력하지 않고 웹 서버 한 개를 다시 띄울 수 있습니다. 이번 실습에서는 PC의 `8083`을 컨테이너의 `80`에 연결했습니다.

아래는 실제 실행 출력에서 핵심 줄만 뽑은 것입니다.

```console
PS> docker compose -p e1-1-bonus up -d --build --wait
Container e1-1-bonus-web-1 Healthy

PS> curl.exe -fsS -i http://127.0.0.1:8083/healthz
HTTP/1.1 200 OK

PS> docker compose -p e1-1-bonus down
Container e1-1-bonus-web-1 Removed
```

`Healthy`는 서버가 준비됐다는 뜻이고, `200 OK`는 PC에서 보낸 요청에 서버가 응답했다는 뜻입니다. `down` 후 `ps -a`에서 프로젝트 컨테이너가 남지 않은 것도 확인했습니다.

## 문제 해결

- `ls- la`를 입력했을 때 셸이 `ls-`를 명령으로 읽었습니다. `ls -la`로 고쳐 숨김 파일을 포함한 목록을 확인했습니다.
- `--mount`에 인수가 빠져 컨테이너 실행이 실패했습니다. 마운트 설정과 이미지 이름을 한 줄에 적어 다시 실행했고, `docker ps`와 HTTP 응답으로 확인했습니다.
