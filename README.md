# E1-1 · 개발 작업실

Windows에서 Docker와 Git으로 웹 서버 실행 환경을 구성했습니다. 다른 사람도 같은 소스와 명령으로 실행할 수 있도록 Dockerfile, Compose 설정과 검증 결과를 남겼습니다.

![기존 COPY 서버 8080의 V1과 바인드 서버 8081의 V2가 열린 브라우저](docs/evidence/15-browser-addresses.png)

## 빠른 실행

Docker Desktop을 켜고 CMD에서 실행합니다.

```cmd
git clone https://github.com/gyungmini306-blip/codyssey-E1-1-dev-workstation.git
cd codyssey-E1-1-dev-workstation
docker compose -p e1-1-bonus up -d --build --wait
curl.exe -i http://127.0.0.1:8083/healthz
```

브라우저에서 `http://localhost:8083/`을 열 수 있습니다. 확인이 끝나면 `docker compose -p e1-1-bonus down`으로 종료합니다. [Dockerfile을 직접 빌드하는 명령과 결과](docs/evidence/07-web-server.md)

## 1. 실행 환경과 구성

| 항목 | 실습 환경 |
|---|---|
| OS·셸 | Windows · PowerShell/CMD · Ubuntu 컨테이너의 Bash |
| Docker | Desktop 4.97.0 · Docker CLI/엔진 29.9.2 · Compose v5.6.1 |
| Git | 2.52.0.windows.1 · GitHub · VS Code |

권한 실습은 Ubuntu 컨테이너 안에서 했습니다. 웹 서버는 NGINX 베이스 이미지를 사용하고, Dockerfile에서 HTML과 NGINX 설정을 복사했습니다. Compose에는 같은 Dockerfile의 빌드 위치와 포트 연결을 적어 한 명령으로 실행할 수 있게 했습니다.

## 2. 핵심 실습과 결과

### 파일과 권한

파일과 폴더를 터미널에서 다루고 권한 표기를 확인했습니다. `chmod` 전후에 파일은 `600 → 644`, 폴더는 `700 → 755`로 바뀌었습니다. 아래 출력은 변경 후 조회 결과입니다.

```console
$ ls -l memo.txt
-rw-r--r-- 1 root root 23 Nov  3 00:05 memo.txt
$ ls -ld permissions-dir
drwxr-xr-x 2 root root 4096 Nov  3 00:12 permissions-dir
```

[파일 생성·복사·이동·삭제 및 chmod 전후 로그](docs/evidence/10-user-terminal.md) · [CMD 캡처](docs/evidence/17-cmd-terminal.png)

### Docker 웹 서버와 데이터

PC에서 접속할 수 있도록 컨테이너의 80번 포트를 연결했습니다. 같은 이미지에서 띄운 두 서버가 처음에는 V1을 반환했고, PC의 HTML만 수정한 뒤 바인드 서버 **8081은 V2**, COPY 서버 **8082는 V1**을 반환했습니다. 기존 컨테이너를 삭제한 뒤 같은 볼륨을 연결한 새 컨테이너에서도 **`E1-1-volume-proof`**를 읽었습니다.

![Docker 컨테이너 상태, 두 포트의 HTML 버전과 새 컨테이너에서 읽은 볼륨 메모](docs/evidence/17-cmd-docker.png)

[이미지 빌드·포트 접속](docs/evidence/07-web-server.md) · [수정 전후 응답](docs/evidence/11-user-bind.md) · [볼륨 삭제 전후 비교](docs/evidence/12-user-volume.md)

### Git·GitHub와 Compose 보너스

- **Git·GitHub** — HTML 변경 이력을 남기고 공유하기 위해 커밋 `d580e49`를 푸시했습니다. VS Code에서도 GitHub 계정을 확인했습니다. [푸시 로그와 로그인 캡처](docs/evidence/14-user-git.md) · [CMD 캡처](docs/evidence/17-cmd-git.png)
- **Compose 단일 서비스** — 실행 옵션을 설정 파일에 담았습니다. `8083/healthz`의 **HTTP 200** 응답을 확인했고, `down` 뒤에는 해당 프로젝트의 컨테이너 목록이 비었습니다. [실행 로그](docs/evidence/16-compose-bonus.md) · [CMD에서 열어 본 이전 PowerShell 로그](docs/evidence/17-cmd-compose.png)

## 3. 문제 해결과 전체 증거

바인드 실행 중 `--mount`에 인수가 빠져 오류가 났습니다. 마운트 옵션과 이미지 이름까지 한 줄에 넣어 실행한 뒤, `docker ps`와 HTTP 응답으로 확인했습니다. [문제 해결 기록](docs/troubleshooting.md)

[전체 체크리스트·실습별 판단 근거](README-details.md)
