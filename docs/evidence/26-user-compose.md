# 사용자 Docker Compose 실행 결과

사용자가 채팅에 제공한 실제 명령과 출력에서 빌드 진행률과 HTTP 부가 헤더를 생략했습니다. 시작 위치는 저장소 루트이고, 셸은 Windows PowerShell입니다.

```console
PS> docker compose -p e1-1-replay up -d --build --wait
 ✔ Image e1-1-replay-web       Built                             4.7s
 ✔ Network e1-1-replay_default Created                           0.1s
 ✔ Container e1-1-replay-web-1 Healthy                           5.6s
PS> curl.exe -i http://127.0.0.1:8083/healthz
HTTP/1.1 200 OK
Server: nginx/1.30.6
Date: Wed, 04 Nov 2026 13:08:22 GMT
Content-Type: text/plain
Content-Length: 3
Connection: keep-alive

ok
PS> docker compose -p e1-1-replay down
 ✔ Container e1-1-replay-web-1 Removed                           0.7s
 ✔ Network e1-1-replay_default Removed                           0.3s
```

`compose.yaml`의 설정으로 이미지가 빌드되고 웹 서비스가 상태 점검을 통과했습니다. PC의 8083번으로 보낸 요청에 HTTP 200과 ok가 응답됐고, down 명령으로 해당 프로젝트의 컨테이너와 네트워크를 정리했습니다.
