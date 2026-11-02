# 07. Dockerfile 웹 서버 빌드와 포트 접속

검증일: 2026-11-02 (Asia/Seoul). 아래는 보조 도구가 사용자 PC에서 실제 실행한 명령과 출력이다. 사용자가 직접 실행한 실습과 구분해 기록한다. 명령은 저장소 루트의 PowerShell에서 실행했으며 Docker CLI는 설치된 실행 파일의 절대 경로로 호출했다. 아래에서는 읽기 쉽게 `docker`로 표기한다.

## 이미지 빌드

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

[전체 실제 빌드 출력](web-build.log). 베이스 이미지는 `nginx:stable-alpine`이며 빌드 시 확인한 digest는 `sha256:0e52bd054126cdc040b1276c0af347aeb02a41b9cfe305d6094767ac30e97949`이다. 태그는 갱신될 수 있어 당시 식별 정보를 함께 기록했다.

```powershell
PS> docker image inspect codyssey-workstation:1.0 --format '{{.Id}}'
sha256:47411e29e6415f3247a900b62b65791832a11e1056782e6753264040aadf402c
```

Dockerfile의 `COPY`가 NGINX 이미지에 우리 HTML과 설정을 추가한다. `docker build`는 이 정의대로 이미지를 만들고 `codyssey-workstation:1.0`이라는 태그를 붙인다.

## 컨테이너 실행 및 상태

```powershell
PS> docker run -d --name codyssey-web -p 127.0.0.1:8080:80 codyssey-workstation:1.0
eed7564ae9ed46f40f1881785db85794623b222c3935d314769f93532e5097ef

PS> docker ps --filter name=codyssey-web
CONTAINER ID   IMAGE                      COMMAND                  CREATED          STATUS                    PORTS                    NAMES
eed7564ae9ed   codyssey-workstation:1.0   "/docker-entrypoint.…"   34 seconds ago   Up 33 seconds (healthy)   127.0.0.1:8080->80/tcp   codyssey-web

PS> docker inspect codyssey-web --format '{{.State.Health.Status}}'
healthy
```

`-d`는 터미널을 점유하지 않고 백그라운드에서 실행한다. 호스트의 로컬 8080 포트를 컨테이너의 80 포트에 연결했다. 실행 중인 NGINX가 HTTP 요청을 계속 기다리므로 hello-world처럼 바로 종료되지 않는다.

## HTTP 접속 검증

실제 응답의 헤더와 핵심 본문만 발췌했다.

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

HTTP 200과 프로젝트 HTML 응답을 통해 호스트 포트에서 컨테이너 웹 서버까지 연결됨을 확인했다. 주소창을 포함한 브라우저 캡처는 추가 수집 대상이다.

## 운영 명령

```powershell
PS> docker stats --no-stream codyssey-web
CONTAINER ID   NAME           CPU %     MEM USAGE / LIMIT     MEM %     NET I/O          BLOCK I/O     PIDS
eed7564ae9ed   codyssey-web   0.00%     8.711MiB / 7.527GiB   0.11%     1.95kB / 3.4kB   0B / 8.19kB   9

PS> docker logs --tail 12 codyssey-web
[시작 로그 및 반복 상태 점검 출력 생략]
172.17.0.1 - - [02/Nov/2026:03:59:14 +0000] "GET / HTTP/1.1" 200 2229 "-" "curl/8.21.0" "-"
172.17.0.1 - - [02/Nov/2026:03:59:15 +0000] "GET /healthz HTTP/1.1" 200 3 "-" "curl/8.21.0" "-"
```

이 컨테이너는 브라우저 관찰을 위해 실행 상태로 유지한다. 파일 변경 반영, 볼륨 영속성, 중지·재시작 비교는 후속 실습에서 별도로 검증한다.
