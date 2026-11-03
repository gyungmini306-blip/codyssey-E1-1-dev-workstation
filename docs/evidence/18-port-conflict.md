# 포트 충돌 진단과 대체 포트로 재실행

2026-11-03 18:11 KST에 기존 Compose 서버가 켜진 상태에서 보조 도구로 재검증했다. Windows PowerShell 출력에서 반복 연결 행과 긴 컨테이너 ID를 생략했다.

## 1. 점유 확인과 충돌 재현

```console
PS> docker ps --filter publish=8083 --format "{{.Names}} {{.Ports}}"
e1-1-bonus-web-1 127.0.0.1:8083->80/tcp
PS> netstat -ano | findstr :8083
  TCP    127.0.0.1:8083         0.0.0.0:0              LISTENING       3076
PS> Get-Process -Id 3076 | Select-Object Id,ProcessName
  Id ProcessName
  -- -----------
3076 com.docker.backend

PS> docker run -d --name e1-1-port-test-181109 -p 127.0.0.1:8083:80 codyssey-workstation:student-1
[오류 끝부분 발췌]
Bind for 127.0.0.1:8083 failed: port is already allocated
Exit code: 125
```

`netstat`의 LISTENING 행은 Docker Desktop 프로세스가 8083을 점유했음을 보여준다. `docker ps`에서 해당 포트를 사용하는 컨테이너를 확인했다.

## 2. 대체 포트 선택과 정리

기존 서버를 계속 사용할 수 있도록 테스트 컨테이너의 호스트 포트만 `18085`로 변경했다. 컨테이너의 NGINX는 계속 `80`번을 사용했다.

```console
PS> netstat -ano | findstr :18085
Exit code: 1
PS> docker run -d --name e1-1-port-test-181109-retry -p 127.0.0.1:18085:80 codyssey-workstation:student-1
[컨테이너 ID 생략]
PS> curl.exe -fsS -i --retry 4 --retry-connrefused http://127.0.0.1:18085/healthz
HTTP/1.1 200 OK
ok

PS> docker rm -f e1-1-port-test-181109
e1-1-port-test-181109
PS> docker rm -f e1-1-port-test-181109-retry
e1-1-port-test-181109-retry
PS> netstat -ano | findstr :18085
  TCP    127.0.0.1:54987        127.0.0.1:18085        TIME_WAIT       0
```

처음 조회에서는 18085와 일치하는 행이 없었다. 재실행 후 HTTP 200과 `ok`를 받았고 테스트 컨테이너를 제거한 뒤에는 18085에 LISTENING 행이 없었다. TIME_WAIT는 종료된 연결의 잔존 상태다. 기존 8083 Compose 서버는 계속 실행했다.
