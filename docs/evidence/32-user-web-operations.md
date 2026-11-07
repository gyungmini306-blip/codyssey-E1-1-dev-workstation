# 사용자 웹 서버 운영 캡처 기록

사용자가 제공한 [PowerShell 캡처](images/06-04-user-web-operations.png)의 명령과 출력을 옮겼습니다. 긴 컨테이너 실행 명령 표시와 시간 열은 생략했으며, 새로운 명령을 실행해 만든 기록이 아닙니다.

## 컨테이너 시작

```text
PS> docker start e1-1-web
e1-1-web
```

## 이미지 목록

```text
PS> docker image ls e1-1-web
IMAGE                  ID             DISK USAGE   CONTENT SIZE   EXTRA
e1-1-web:build-check    8dafd1b2588d   92.8MB       26.1MB
e1-1-web:v1             c96dd896c8f8   92.8MB       26.1MB         U
```

## 실행 상태와 포트 연결（출력 열 발췌）

```text
PS> docker ps --filter "name=^/e1-1-web$"
CONTAINER ID   IMAGE         STATUS                    PORTS                    NAMES
7f5ec2374dfc   e1-1-web:v1   Up 23 minutes (healthy)   127.0.0.1:8080->80/tcp   e1-1-web
```

## 최근 상태 점검 로그

```text
PS> docker logs --tail 3 e1-1-web
127.0.0.1 - - [07/Nov/2026:00:08:10 +0000] "GET /healthz HTTP/1.1" 200 3 "-" "Wget" "-"
127.0.0.1 - - [07/Nov/2026:00:08:20 +0000] "GET /healthz HTTP/1.1" 200 3 "-" "Wget" "-"
127.0.0.1 - - [07/Nov/2026:00:08:30 +0000] "GET /healthz HTTP/1.1" 200 3 "-" "Wget" "-"
```

`Wget`는 Dockerfile의 HEALTHCHECK에서 실행하는 상태 점검 요청입니다. 세 요청 모두 HTTP 200으로 응답했습니다.

## 자원 사용량

```text
PS> docker stats --no-stream e1-1-web
CONTAINER ID   NAME       CPU %   MEM USAGE / LIMIT    MEM %   NET I/O          BLOCK I/O        PIDS
7f5ec2374dfc   e1-1-web   0.00%   11.33MiB / 7.527GiB 0.15%   1.87kB / 126B    5.99MB / 4.1kB   9
```

자원 수치는 캡처 시점의 값이며, 다음 조회에서는 달라질 수 있습니다.
