# 보너스 과제 ① Docker Compose 기초

[compose.yaml](../../compose.yaml)은 웹 서버 한 개를 정의한다. `build: .`은 기존 Dockerfile을 사용하고, `ports`는 PC의 8083번과 컨테이너의 80번을 연결한다.

2026-11-03 보조 실행에서 확인한 명령과 출력이다. 빌드 중간 단계는 생략했다. 서버가 실행 중일 때 브라우저에서 `http://127.0.0.1:8083/`을 열 수 있다.

```text
PS> docker compose version
Docker Compose version v5.6.1
PS> docker compose -p e1-1-bonus up -d --build --wait
Image e1-1-bonus-web Built
Container e1-1-bonus-web-1 Healthy
PS> docker compose -p e1-1-bonus ps
NAME               IMAGE            COMMAND                  SERVICE   CREATED         STATUS                   PORTS
e1-1-bonus-web-1   e1-1-bonus-web   "/docker-entrypoint.…"   web       6 seconds ago   Up 6 seconds (healthy)   127.0.0.1:8083->80/tcp
PS> curl.exe -fsS -i http://127.0.0.1:8083/healthz
HTTP/1.1 200 OK
Server: nginx/1.30.6
Date: Tue, 03 Nov 2026 03:24:48 GMT
Content-Type: text/plain
Content-Length: 3
Connection: keep-alive

ok
PS> docker compose -p e1-1-bonus logs --tail 6 web
web-1  | 2026/11/03 03:24:42 [notice] 1#1: start worker process 33
web-1  | 2026/11/03 03:24:42 [notice] 1#1: start worker process 34
web-1  | 2026/11/03 03:24:42 [notice] 1#1: start worker process 35
web-1  | 2026/11/03 03:24:42 [notice] 1#1: start worker process 36
web-1  | 127.0.0.1 - - [03/Nov/2026:03:24:47 +0000] "GET /healthz HTTP/1.1" 200 3 "-" "Wget" "-"
web-1  | 172.18.0.1 - - [03/Nov/2026:03:24:48 +0000] "GET /healthz HTTP/1.1" 200 3 "-" "curl/8.21.0" "-"
PS> docker compose -p e1-1-bonus down
 Container e1-1-bonus-web-1 Stopping
 Container e1-1-bonus-web-1 Stopped
 Container e1-1-bonus-web-1 Removing
 Container e1-1-bonus-web-1 Removed
 Network e1-1-bonus_default Removing
 Network e1-1-bonus_default Removed
PS> docker compose -p e1-1-bonus ps -a
NAME      IMAGE     COMMAND   SERVICE   CREATED   STATUS    PORTS
```

`ps`에서 8083번 포트와 healthy 상태를 확인했다. `/healthz`는 HTTP 200과 `ok`를 반환했다. `down` 이후 프로젝트의 컨테이너 목록은 비었다.
