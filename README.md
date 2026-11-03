# E1-1 · 개발 작업실

Docker로 웹 서버를 띄우고, 다른 사람도 같은 절차로 실행할 수 있도록 구성과 실습 결과를 기록했습니다.

## 발표에서 보여줄 세 가지

| 실습 | 왜 했나 | 확인한 결과 |
|---|---|---|
| 웹 서버와 포트 | PC에서 컨테이너의 웹 서버에 접속하기 위해 | NGINX의 80번을 PC의 8080번에 연결해 페이지를 열었습니다. |
| HTML 수정 | PC에서 수정한 파일이 언제 서버에 반영되는지 확인하기 위해 | 같은 이미지로 실행한 두 서버 중 바인드 방식인 **8081은 V2**, COPY 방식인 **8082는 V1**을 반환했습니다. |
| 볼륨 | 컨테이너를 교체해도 데이터를 다시 읽을 수 있는지 확인하기 위해 | 기존 컨테이너를 삭제하고 같은 볼륨을 연결한 새 컨테이너에서 `E1-1-volume-proof`를 읽었습니다. |

![실제 브라우저 화면. 왼쪽은 기존 COPY 서버 8080의 V1, 오른쪽은 바인드 서버 8081의 V2](docs/evidence/15-browser-addresses.png)

*캡처는 기존 8080 서버와 8081 서버를 나란히 보여줍니다. 같은 이미지로 비교한 8081/8082의 결과는 [실제 응답 로그](docs/evidence/11-user-bind.md)에 있습니다.*

## 실행해 보기

Docker가 실행 중인 상태에서 저장소 루트의 CMD를 열어 아래 명령을 실행합니다. Compose 설정은 Dockerfile과 포트 연결을 한 파일에 기록한 보너스 과제입니다.

```cmd
docker compose -p e1-1-bonus up -d --build --wait
curl.exe -i http://127.0.0.1:8083/healthz
docker compose -p e1-1-bonus down
```

실행 중에는 브라우저에서 `http://127.0.0.1:8083/`을 열 수 있습니다. 실습에서 `/healthz`의 HTTP 200 응답과 종료 후 컨테이너 목록이 비어 있음을 확인했습니다. [Compose 실행 기록](docs/evidence/16-compose-bonus.md)

## 실습 기록

- **터미널·권한** — 파일 생성·복사·이동·삭제, `chmod` 전후 비교. [실제 명령과 출력](docs/evidence/10-user-terminal.md)
- **Docker** — 이미지 빌드와 웹 접속, 바인드 마운트 비교, 볼륨 데이터 보존. [빌드·접속](docs/evidence/07-web-server.md) · [바인드 마운트](docs/evidence/11-user-bind.md) · [볼륨](docs/evidence/12-user-volume.md)
- **Git·GitHub** — 사용자 커밋 `d580e49` 푸시와 VS Code GitHub 로그인 확인. [커밋·푸시 출력과 계정 캡처](docs/evidence/14-user-git.md)

[실행 환경·전체 체크리스트·CMD 재확인 출력](README-details.md) · [트러블슈팅](docs/troubleshooting.md)
