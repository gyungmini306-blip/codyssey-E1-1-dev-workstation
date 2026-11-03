# 13. 사용자 직접 Docker 운영 및 셸 종료 실습

실습일: 2026-11-03 (Asia/Seoul). 사용자가 직접 실행해 제공한 실제 명령과 출력이다. 반복되는 Windows 개인 경로와 프롬프트는 축약했다. 보조 도구는 이 기록을 문서화했다.

## 13-A. Docker 버전과 엔진 점검

```powershell
PS> docker --version
Docker version 29.9.2, build a82e528
PS> docker info --format 'ServerVersion={{.ServerVersion}} OSType={{.OSType}}'
ServerVersion=29.9.2 OSType=linux
```

클라이언트 버전뿐 아니라 엔진의 ServerVersion과 Linux 컨테이너 실행 환경도 응답했다.

## 13-B. 이미지 목록

사용자의 터미널에서 표시된 열과 줄바꿈을 보존했다.

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

사용자 직접 빌드한 student-1을 포함해 실습 과정의 이미지가 존재한다.

## 13-C. 컨테이너 전체 목록

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

ps -a에는 종료된 hello-world와 이전 웹 컨테이너도 표시된다. 실행 중인 것과 종료된 것, 동일 이미지로 만든 별도 컨테이너를 구분해 확인했다.

## 13-D. 서버 로그

```powershell
PS> docker logs --tail 10 e1-1-bind-guide
127.0.0.1 - - [03/Nov/2026:00:37:26 +0000] "GET /healthz HTTP/1.1" 200 3 "-" "Wget" "-"
127.0.0.1 - - [03/Nov/2026:00:37:36 +0000] "GET /healthz HTTP/1.1" 200 3 "-" "Wget" "-"
127.0.0.1 - - [03/Nov/2026:00:37:46 +0000] "GET /healthz HTTP/1.1" 200 3 "-" "Wget" "-"
127.0.0.1 - - [03/Nov/2026:00:37:56 +0000] "GET /healthz HTTP/1.1" 200 3 "-" "Wget" "-"
127.0.0.1 - - [03/Nov/2026:00:38:06 +0000] "GET /healthz HTTP/1.1" 200 3 "-" "Wget" "-"
127.0.0.1 - - [03/Nov/2026:00:38:16 +0000] "GET /healthz HTTP/1.1" 200 3 "-" "Wget" "-"
127.0.0.1 - - [03/Nov/2026:00:38:26 +0000] "GET /healthz HTTP/1.1" 200 3 "-" "Wget" "-"
127.0.0.1 - - [03/Nov/2026:00:38:37 +0000] "GET /healthz HTTP/1.1" 200 3 "-" "Wget" "-"
127.0.0.1 - - [03/Nov/2026:00:38:47 +0000] "GET /healthz HTTP/1.1" 200 3 "-" "Wget" "-"
127.0.0.1 - - [03/Nov/2026:00:38:57 +0000] "GET /healthz HTTP/1.1" 200 3 "-" "Wget" "-"
```

Dockerfile의 HEALTHCHECK가 wget으로 /healthz를 요청했고 HTTP 200을 받았다. 이 발췌는 자동 점검 로그이며 브라우저 접속 캡처를 대신하지 않는다. 로그의 +0000은 UTC이며 문서의 실습일 기준 시간대는 Asia/Seoul이다.

## 13-E. 리소스 사용량

```powershell
PS> docker stats --no-stream e1-1-bind-guide
CONTAINER ID   NAME              CPU %     MEM USAGE / LIMIT     MEM %     NET I/O           BLOCK I/O        PIDS
9fdf6ee013be   e1-1-bind-guide   0.00%     8.945MiB / 7.527GiB   0.12%     16.7kB / 72.2kB   868kB / 8.19kB   9
```

해당 시점의 CPU·메모리·입출력·프로세스 수를 확인했다. 수치는 실행 시점에 따라 달라진다.

## 13-F. exec의 추가 Bash 종료 후 컨테이너 유지

사용자가 별도 실습 컨테이너에서 직접 실행한 기록이다. Ubuntu 터미널에 여러 줄을 입력하면서 표시된 입력·출력 순서를 보존했다. 이후 Docker가 출력한 일반 Debug 기능 안내는 생략했다.

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

- run -dit로 생성한 원래 Bash가 컨테이너의 주 프로세스다.
- exec는 별도의 추가 Bash를 생성했다.
- 추가 Bash에서 exit한 뒤에도 State.Running이 true다. 추가 셸의 종료와 컨테이너 주 프로세스의 종료가 다름을 확인했다.

## 현재 수행 상태

사용자 직접 버전·엔진·이미지·전체 컨테이너·로그·자원 사용량 및 exec 추가 Bash 종료 후 컨테이너 유지를 확인했다. attach 연결·분리와 주 프로세스 종료 비교는 이어서 기록한다. 아직 전체 셸 종료 방식 비교를 완료 표시하지 않는다.
