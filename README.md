# E1-1 · 개발 작업실

다른 사람도 같은 방법으로 웹 서버를 실행할 수 있도록 Docker로 환경을 만들고, 접속·파일 수정·데이터 보존을 직접 확인했습니다.

![브라우저 접속 결과. 기존 서버 8080은 V1, PC 파일을 연결한 서버 8081은 V2](docs/evidence/15-browser-addresses.png)

*주소창과 페이지 버전을 함께 보면 됩니다. 왼쪽은 기존 서버 `8080`의 V1, 오른쪽은 PC 파일을 연결한 `8081`의 V2입니다.*

## 빠른 실행

Windows에서 Docker Desktop을 켜고 CMD에서 실행합니다. 실습 환경은 Windows 11 · Windows Terminal(CMD/PowerShell) · Ubuntu 컨테이너(Bash), Docker 29.9.2, Compose 5.6.1, Git 2.52.0입니다.

```cmd
git clone https://github.com/gyungmini306-blip/codyssey-E1-1-dev-workstation.git
cd codyssey-E1-1-dev-workstation
docker compose -p e1-1-bonus up -d --build --wait
curl.exe -i http://127.0.0.1:8083/healthz
```

브라우저에서 `http://localhost:8083/`을 엽니다. 확인을 마치면 `docker compose -p e1-1-bonus down`으로 종료합니다.

## 무엇을 했고 왜 했나

| 실습 | 한 일과 이유 | 확인한 결과 |
|---|---|---|
| 터미널과 권한 | Ubuntu 컨테이너에서 파일 생성·복사·이동·삭제를 연습하고, `chmod`로 접근 권한을 바꿨습니다. | 파일은 `600 → 644`, 폴더는 `700 → 755`로 바뀌었습니다. |
| Docker 점검 | Docker가 실제로 컨테이너를 실행하는지 확인하려고 `hello-world`를 실행하고 상태·로그를 조회했습니다. | `Hello from Docker!`가 출력됐고 종료 코드는 `0`이었습니다. |
| 이미지와 웹 접속 | 누구나 같은 서버를 띄울 수 있도록 Dockerfile에 NGINX와 HTML을 담는 방법을 적었습니다. 내 PC에서 접속하려고 `8080:80`으로 포트를 연결했습니다. | 브라우저에서 `localhost:8080`으로 페이지가 열렸습니다. |
| HTML 수정 반영 | PC 파일을 수정했을 때 바로 반영되는지 보려고, 같은 이미지로 실행한 두 서버의 파일 읽는 방식만 바꿨습니다. | PC 폴더를 연결한 **8081은 V2**, 이미지에 복사한 파일을 쓰는 **8082는 V1**을 반환했습니다. |
| 볼륨 | 서버를 교체해도 메모를 읽을 수 있도록 Docker가 따로 관리하는 저장 공간에 메모를 넣었습니다. | 기존 컨테이너를 삭제하고 같은 볼륨을 새 컨테이너에 연결하니 `E1-1-volume-proof`가 남아 있었습니다. |
| Git과 GitHub | Git으로 HTML 변경을 기록하고, 다른 사람이 확인할 수 있도록 GitHub에 공유했습니다. | 커밋 `d580e49`를 푸시했고 VS Code에서 GitHub 계정 연결을 확인했습니다. |
| 보너스 Compose | 빌드와 포트 옵션을 매번 입력하지 않도록 `compose.yaml`에 기록했습니다. | 웹 서버 하나를 실행해 `8083/healthz`의 HTTP 200을 확인했고, `down` 뒤 프로젝트 컨테이너 목록이 비었습니다. |

## 수행 체크리스트

- [x] 터미널 조작과 파일·폴더 권한 변경

- [x] Docker 설치·점검, 이미지·컨테이너 운영, Ubuntu 셸 진입

- [x] Dockerfile 빌드·실행, 포트 접속, 바인드 마운트와 볼륨 검증

- [x] Git 설정·푸시 및 VS Code GitHub 연결

- [x] 보너스 Compose 단일 서비스 실행·종료

## 실제 명령과 결과

아래 코드 블록은 실습 당시 출력의 발췌입니다. 빠른 실행은 새 환경에서 재현할 때 사용하는 명령입니다.

### 터미널과 권한

![CMD에서 ls와 cat을 실행한 화면](docs/evidence/17-cmd-terminal.png)

**화면에서 볼 곳** — `ls -la` 아래의 `memo.txt`는 `-rw-r--r--`(644), `permissions-dir`은 `drwxr-xr-x`(755)입니다. 마지막 `cat` 아래에는 파일에 적은 내용이 나옵니다. 이 화면은 최종 상태이고, 변경 전후의 명령과 출력은 아래에 있습니다.

절대 경로 `/root/e1-1/guided-practice`는 현재 위치와 관계없이 같은 폴더를 가리킵니다. 상대 경로 `archive/memo-renamed.txt`는 현재 폴더를 기준으로 찾습니다. 권한 숫자는 읽기(4), 쓰기(2), 실행 또는 디렉토리 진입(1)을 더한 값입니다. `644`는 소유자가 읽고 쓸 수 있고, `755`는 다른 사용자도 읽고 진입할 수 있습니다.

```console
PS> docker exec -it e1-1-ubuntu bash
root@9e28c1505a09:/# mkdir -p /root/e1-1/guided-practice
root@9e28c1505a09:/# cd /root/e1-1/guided-practice
root@9e28c1505a09:~/e1-1/guided-practice# pwd
/root/e1-1/guided-practice
root@9e28c1505a09:~/e1-1/guided-practice# touch empty.txt .hidden-note
root@9e28c1505a09:~/e1-1/guided-practice# echo "E1-1 terminal practice" > memo.txt
root@9e28c1505a09:~/e1-1/guided-practice# ls -la
total 12
drwxr-xr-x 2 root root 4096 Nov  3 00:05 .
drwxr-xr-x 3 root root 4096 Nov  3 00:05 ..
-rw-r--r-- 1 root root    0 Nov  3 00:05 .hidden-note
-rw-r--r-- 1 root root    0 Nov  3 00:05 empty.txt
-rw-r--r-- 1 root root   23 Nov  3 00:05 memo.txt
root@9e28c1505a09:~/e1-1/guided-practice# cat memo.txt
E1-1 terminal practice
```

```console
$ cp memo.txt memo-copy.txt
$ ls -la
total 16
drwxr-xr-x 2 root root 4096 Nov  3 00:08 .
drwxr-xr-x 3 root root 4096 Nov  3 00:05 ..
-rw-r--r-- 1 root root    0 Nov  3 00:05 .hidden-note
-rw-r--r-- 1 root root    0 Nov  3 00:05 empty.txt
-rw-r--r-- 1 root root   23 Nov  3 00:08 memo-copy.txt
-rw-r--r-- 1 root root   23 Nov  3 00:05 memo.txt
$ mkdir -p archive
$ ls- la
bash: ls-: command not found
$ ls -la
total 20
drwxr-xr-x 3 root root 4096 Nov  3 00:08 .
drwxr-xr-x 3 root root 4096 Nov  3 00:05 ..
-rw-r--r-- 1 root root    0 Nov  3 00:05 .hidden-note
drwxr-xr-x 2 root root 4096 Nov  3 00:08 archive
-rw-r--r-- 1 root root    0 Nov  3 00:05 empty.txt
-rw-r--r-- 1 root root   23 Nov  3 00:08 memo-copy.txt
-rw-r--r-- 1 root root   23 Nov  3 00:05 memo.txt
$ mv memo-copy.txt archive/memo-renamed.txt
$ ls -la
total 16
drwxr-xr-x 3 root root 4096 Nov  3 00:09 .
drwxr-xr-x 3 root root 4096 Nov  3 00:05 ..
-rw-r--r-- 1 root root    0 Nov  3 00:05 .hidden-note
drwxr-xr-x 2 root root 4096 Nov  3 00:09 archive
-rw-r--r-- 1 root root    0 Nov  3 00:05 empty.txt
-rw-r--r-- 1 root root   23 Nov  3 00:05 memo.txt
$ cd archive
$ ls -la
total 12
drwxr-xr-x 2 root root 4096 Nov  3 00:09 .
drwxr-xr-x 3 root root 4096 Nov  3 00:09 ..
-rw-r--r-- 1 root root   23 Nov  3 00:08 memo-renamed.txt
$ cd ..
$ ls -la archive
total 12
drwxr-xr-x 2 root root 4096 Nov  3 00:09 .
drwxr-xr-x 3 root root 4096 Nov  3 00:09 ..
-rw-r--r-- 1 root root   23 Nov  3 00:08 memo-renamed.txt
$ rm archive/memo-renamed.txt
$ ls -la archive
total 8
drwxr-xr-x 2 root root 4096 Nov  3 00:09 .
drwxr-xr-x 3 root root 4096 Nov  3 00:09 ..
$ rmdir archive
$ ls -la
total 12
drwxr-xr-x 2 root root 4096 Nov  3 00:09 .
drwxr-xr-x 3 root root 4096 Nov  3 00:05 ..
-rw-r--r-- 1 root root    0 Nov  3 00:05 .hidden-note
-rw-r--r-- 1 root root    0 Nov  3 00:05 empty.txt
-rw-r--r-- 1 root root   23 Nov  3 00:05 memo.txt
```

```console
$ mkdir -p permissions-dir
$ chmod 600 memo.txt
$ chmod 700 permissions-dir
$ ls -l memo.txt
-rw------- 1 root root 23 Nov  3 00:05 memo.txt
$ ls -ld permissions-dir
drwx------ 2 root root 4096 Nov  3 00:12 permissions-dir
$ chmod 644 memo.txt
$ chmod 755 permissions-dir
$ ls -l memo.txt
-rw-r--r-- 1 root root 23 Nov  3 00:05 memo.txt
$ ls -ld permissions-dir
drwxr-xr-x 2 root root 4096 Nov  3 00:12 permissions-dir
```

### Docker 설치·운영과 셸

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
Digest: sha256:c567b231f65614688711a75f31518a064258a51d442117a3e771a3a8fdba78ef
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.
[이후 안내문 생략]

PS> docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES

PS> docker ps -a
CONTAINER ID   IMAGE         COMMAND    CREATED          STATUS                      PORTS     NAMES
30df56aa1c4b   hello-world   "/hello"   11 seconds ago   Exited (0) 10 seconds ago             e1-1-hello
```

```powershell
PS> docker info --format 'ServerVersion={{.ServerVersion}} OSType={{.OSType}}'
ServerVersion=29.9.2 OSType=linux

PS> docker images --digests hello-world
REPOSITORY    TAG       DIGEST                                                                    IMAGE ID       CREATED        SIZE
hello-world   latest    sha256:c567b231f65614688711a75f31518a064258a51d442117a3e771a3a8fdba78ef   c567b231f656   7 months ago   25.9kB

PS> docker inspect e1-1-hello --format '{{.Id}} {{.Config.Image}} {{.State.Status}} exit={{.State.ExitCode}}'
30df56aa1c4ba9ddcb044cafdd8542b172a1b4b9a1ffefaf6277678ba2db12d4 hello-world exited exit=0
```

```powershell
PS> docker images codyssey-workstation
                                                    i Info →   U  In Use
IMAGE                   ID             DISK USAGE   CONTENT SIZE   EXTRA
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
CONTAINER ID   IMAGE                            COMMAND                  CREATED          STATUS                    PORTS                    NAMES
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
CONTAINER ID   NAME              CPU %     MEM USAGE / LIMIT     MEM %     NET I/O           BLOCK I/O        PIDS
9fdf6ee013be   e1-1-bind-guide   0.00%     8.945MiB / 7.527GiB   0.12%     16.7kB / 72.2kB   868kB / 8.19kB   9
```

```console
PS> docker run -dit --name e1-1-shell-guide ubuntu:24.04 bash
be12c0450ba9f86acf1ba8fc5634f202f9d306755471fb446ef1dbd156c2e05c
PS> docker exec -it e1-1-shell-guide bash
root@be12c0450ba9:/# echo "additional shell opened by exec"
exit
additional shell opened by exec
exit
PS> docker inspect e1-1-shell-guide --format '{{.State.Running}}'
true
```

```console
PS> docker attach e1-1-shell-guide
root@be12c0450ba9:/# exit
exit
PS> docker inspect e1-1-shell-guide --format '{{.State.Status}}'
exited
```

추가 Bash를 `exec`로 열었다가 종료해도 컨테이너는 유지됐습니다. `attach`로 연결한 주 Bash를 종료하자 컨테이너 상태가 `exited`로 바뀌었습니다.

### 이미지 빌드와 웹 접속

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
eed7564ae9ed46f40f1881785db85794623b222c3935d314769f93532e5097ef

PS> docker ps --filter name=codyssey-web
CONTAINER ID   IMAGE                      COMMAND                  CREATED          STATUS                    PORTS                    NAMES
eed7564ae9ed   codyssey-workstation:1.0   "/docker-entrypoint.…"   34 seconds ago   Up 33 seconds (healthy)   127.0.0.1:8080->80/tcp   codyssey-web

PS> docker inspect codyssey-web --format '{{.State.Health.Status}}'
healthy
```

```powershell
PS> curl.exe -i --max-time 15 http://localhost:8080/
HTTP/1.1 200 OK
Server: nginx/1.30.6
Date: Mon, 02 Nov 2026 03:59:14 GMT
Content-Type: text/html
Content-Length: 2229
[나머지 헤더 및 HTML 중간 부분 생략]
  <title>Codyssey E1-1 · Dev Workstation Lab</title>
    <h1>나의 개발 작업실</h1>
    <p class="marker" id="mount-marker">콘텐츠 버전: WORKSTATION_V1</p>

PS> curl.exe -i --max-time 15 http://localhost:8080/healthz
HTTP/1.1 200 OK
Server: nginx/1.30.6
Date: Mon, 02 Nov 2026 03:59:15 GMT
Content-Type: text/plain
Content-Length: 3
Connection: keep-alive

ok
```

### 바인드 마운트와 COPY 비교

![CMD에서 확인한 두 서버의 버전과 볼륨 메모](docs/evidence/17-cmd-docker.png)

**화면에서 볼 곳** — `docker ps`에는 두 서버가 각각 `8081 → 80`, `8082 → 80`으로 연결돼 있습니다. 바로 아래 `curl` 결과에서 **8081은 V2, 8082는 V1**입니다. 맨 아래 `cat /data/memo.txt` 결과는 새 컨테이너에서 다시 읽은 볼륨 메모입니다.

```powershell
PS> docker run -d --name e1-1-copy-guide -p 127.0.0.1:8082:80 codyssey-workstation:student-1
5e144b9a442f062a6bc7e4a0130863bb85866f327bc17a38ea88642c5c038665

PS> $appPath = (Resolve-Path .\app).Path
PS> docker run -d --name e1-1-bind-guide -p 127.0.0.1:8081:80 ==mount
docker: invalid reference format

PS> docker run -d --name e1-1-bind-guide -p 127.0.0.1:8081:80 --mount
flag needs an argument: --mount

PS> "type=bind,source=$appPath,target=/usr/share/nginx/html,readonly" codyssey-workstation:student-1
식 또는 문에서 예기치 않은 'codyssey-workstation:student-1' 토큰입니다.
[ParserError / UnexpectedToken: 위치 표시 등 중간 출력 생략]

PS> $appPath = (Resolve-Path .\app).Path
PS> docker run -d --name e1-1-bind-guide -p 127.0.0.1:8081:80 --mount "type=bind,source=$appPath,target=/usr/share/nginx/html,readonly" codyssey-workstation:student-1
9fdf6ee013be8740e6d2e557f52e9ece75de503524217568cef9416bb83ff45d

PS> docker ps --filter name=guide
CONTAINER ID   IMAGE                            COMMAND                   CREATED              STATUS                        PORTS                    NAMES
9fdf6ee013be   codyssey-workstation:student-1   "/docker-entrypoint.…"   15 seconds ago       Up 14 seconds (healthy)       127.0.0.1:8081->80/tcp   e1-1-bind-guide
5e144b9a442f   codyssey-workstation:student-1   "/docker-entrypoint.…"   About a minute ago   Up About a minute (healthy)   127.0.0.1:8082->80/tcp   e1-1-copy-guide
```

수정 전에는 두 서버가 V1을 반환했습니다. HTML만 바꾼 뒤 `8081`은 V2, `8082`는 V1이었습니다.

### 볼륨 생성·삭제·재연결

```powershell
PS> docker volume create e1-1-user-data
e1-1-user-data

PS> $volumeMount = "type=volume,source=e1-1-user-data,target=/data"
PS> docker run -d --name e1-1-volume-before --mount $volumeMount ubuntu:24.04 sleep infinity
77d4a42449559c220892e446f3b117a622b57398cb5ae41cf716ccf6187ad886

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
DRIVER    VOLUME NAME
local     e1-1-user-data
```

```powershell
PS> $volumeMount = "type=volume,source=e1-1-user-data,target=/data"
PS> docker run -d --name e1-1-volume-after --mount $volumeMount ubuntu:24.04 sleep infinity
91ff958c97f598400a36d7de5c44b38a9b530b320cb4e7e514ea185c151ad9b4
PS> docker exec e1-1-volume-after cat /data/memo.txt
E1-1-volume-proof
```

### Git 설정과 GitHub 연결

![CMD에서 git log와 git ls-remote를 실행한 화면](docs/evidence/17-cmd-git.png)

**화면에서 볼 곳** — `git log` 아래에 HTML을 V2로 바꾼 실습 커밋 `d580e49`가 보입니다. `git ls-remote` 아래에는 캡처 당시 GitHub의 `main` 커밋이 표시됩니다.

```console
CMD> git --version
git version 2.52.0.windows.1
CMD> git config --local --list
core.repositoryformatversion=0
core.filemode=false
core.bare=false
core.logallrefupdates=true
core.symlinks=false
core.ignorecase=true
core.autocrlf=input
remote.origin.url=https://github.com/gyungmini306-blip/codyssey-E1-1-dev-workstation.git
remote.origin.fetch=+refs/heads/*:refs/remotes/origin/*
branch.main.remote=origin
branch.main.merge=refs/heads/main
init.defaultbranch=main
user.email=[마스킹]
user.name=gyungmini306-blip
credential.https://github.com.username=gyungmini306-blip
```

```powershell
PS> git --no-pager diff -- app/index.html
warning: in the working copy of 'app/index.html', CRLF will be replaced by LF the next time Git touches it
[V1 → V2 한 줄 변경의 diff 본문 생략: 위 링크 참고]

PS> git add app/index.html
warning: in the working copy of 'app/index.html', CRLF will be replaced by LF the next time Git touches it
PS> git --no-pager diff --cached --stat
 app/index.html | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
PS> git commit -m "Update practice page to version 2"
[main d580e49] Update practice page to version 2
 1 file changed, 1 insertion(+), 1 deletion(-)
PS> git push
Enumerating objects: 7, done.
Counting objects: 100% (7/7), done.
Delta compression using up to 8 threads
Compressing objects: 100% (4/4), done.
Writing objects: 100% (4/4), 386 bytes | 386.00 KiB/s, done.
Total 4 (delta 3), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (3/3), completed with 3 local objects.
To https://github.com/gyungmini306-blip/codyssey-E1-1-dev-workstation.git
   58c49d9..d580e49  main -> main
PS> git status --short --branch
## main...origin/main
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
