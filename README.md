# E1-1 · Dev Workstation Lab

제출 저장소: [gyungmini306-blip/codyssey-E1-1-dev-workstation](https://github.com/gyungmini306-blip/codyssey-E1-1-dev-workstation)

터미널, Docker, Git/GitHub를 사용해 재현 가능한 개발 작업 환경을 구성하는 실습 프로젝트입니다. 명령의 의미를 이해하고 실제 출력으로 결과를 검증합니다.

## 실습의 목적과 판단 근거

같은 소스와 실행 설정을 받은 사람이 내 PC 밖에서도 웹 서버를 재현할 수 있도록 Dockerfile과 실행 절차를 작성했다. HTML의 버전 문구는 파일 수정이 어느 서버에 반영됐는지 구별하는 표시로 사용했다. 아래 기록에는 각 판단에 사용한 명령과 실제 출력이 있다.

| 왜 했나 | 무엇을 했나 | 관찰 결과와 근거 |
|---|---|---|
| 터미널에서 파일의 위치와 상태를 확인하며 다루기 위해 | Ubuntu에서 폴더와 파일을 만들고, 복사본을 옮겨 이름을 바꾼 뒤 삭제했다. | `ls -la`에서 복사본 생성, 이동한 위치, 삭제 후 원본이 남아 있음을 확인했다. [파일 생성·복사·이동·삭제 로그](docs/evidence/10-user-terminal.md#10-b-복사-이동이름-변경-삭제) |
| 파일과 폴더의 권한 설정을 읽을 수 있는지 확인하기 위해 | `chmod` 전후의 파일과 디렉토리 자체를 각각 `ls -l`, `ls -ld`로 조회했다. | 파일은 `-rw-------`에서 `-rw-r--r--`로, 디렉토리는 `drwx------`에서 `drwxr-xr-x`로 바뀌었다. [권한 변경 전후 로그](docs/evidence/10-user-terminal.md#10-c-파일과-디렉토리-권한-변경-전후) |
| Docker가 이미지를 실행하고 컨테이너 상태를 보여주는지 확인하기 위해 | `hello-world`를 실행하고 `docker ps -a`로 상태를 조회했다. | `Hello from Docker!`가 출력됐고 컨테이너는 `Exited (0)`으로 기록됐다. [실행과 종료 상태](docs/evidence/05-hello-world.md) |
| 다른 PC에서도 같은 구성의 웹 서버를 실행할 수 있도록 | Dockerfile에 NGINX 베이스, 웹 파일과 설정 복사, 상태 점검을 정의했다. 컨테이너의 80번을 PC의 8080번에 연결했다. | 빌드와 실행이 성공했고 브라우저에서 포트가 포함된 주소와 페이지를 함께 확인했다. [빌드·접속 로그](docs/evidence/07-web-server.md) · [브라우저 화면](docs/evidence/15-browser.md) |
| HTML 수정 후 재빌드가 필요한 조건을 구별하기 위해 | 같은 이미지에서 COPY 서버와 바인드 서버를 띄웠다. 두 서버의 V1 응답을 확인한 뒤 호스트 HTML만 V2로 바꿨다. | 바인드 서버 `8081`은 V2, COPY 서버 `8082`는 V1을 반환했다. [수정 전후 응답 비교](docs/evidence/11-user-bind.md) |
| 컨테이너를 교체해도 메모를 다시 읽을 수 있는지 확인하기 위해 | 이름 있는 볼륨에 메모를 썼다. 기존 컨테이너를 삭제하고 같은 볼륨을 새 컨테이너에 연결했다. | 삭제 전후의 컨테이너 ID는 달랐고, 두 컨테이너에서 읽은 값은 모두 `E1-1-volume-proof`였다. [삭제 및 재연결 로그](docs/evidence/12-user-volume.md) |
| 변경 이력을 남기고 평가자가 소스와 증거를 확인할 수 있도록 | HTML 수정분을 Git으로 커밋·푸시하고 VS Code에서 GitHub 계정을 연결했다. | 푸시 출력에 커밋 `d580e49`가 원격 `main`에 반영됐고 VS Code 계정 메뉴에 `gyungmini306-blip (GitHub)`이 표시됐다. [푸시 출력과 계정 화면](docs/evidence/14-user-git.md) |
| 서버 실행 옵션을 한 파일에 저장해 다시 쓰기 위해 | 보너스 과제로 Compose 설정에 빌드 위치와 포트를 정의했다. 보조 실행으로 시작·상태·로그·종료를 확인했다. | `8083/healthz`가 HTTP 200과 `ok`를 반환했고, `down` 후 해당 프로젝트의 컨테이너 목록이 비었다. [Compose 명령과 출력](docs/evidence/16-compose-bonus.md) |

권한 실습은 Ubuntu 컨테이너의 root 셸에서 권한 비트가 바뀐 결과를 확인했다. 다른 사용자로 접근이 거부되는지는 별도 실험이 필요하다. 웹 접속은 로컬 주소에서 검증했다. 상세 설명 페이지의 버튼은 원리를 익히는 모형이며, 실습 결과는 위 터미널 출력과 캡처를 근거로 삼았다.

## 직접 실습 가이드

아래 문서는 앞으로 사용자가 직접 실행할 단계별 가이드입니다. 예상 결과는 실제 수행 로그가 아니며, 실행 후 실제 출력과 캡처로 체크리스트를 갱신합니다.

1. [파일·폴더·권한 실습](docs/guides/01-terminal-permissions.md)
2. [파일 수정 반영·볼륨 데이터 보존](docs/guides/02-mount-volume.md)
3. [Docker 운영·VS Code 연동·README·GitHub 제출](docs/guides/03-record-submit.md)

터미널·Docker 실습, HTML 수정본 커밋·푸시, 브라우저 접속, VS Code GitHub 연동의 실제 증거를 정리했습니다.

## 실행 환경

| 항목 | 실제 확인 결과 |
|---|---|
| 확인일 | 2026-11-02 초기 점검 / 2026-11-03 사용자 직접 재검증 (Asia/Seoul) |
| 호스트 | Windows, NT 10.0.26200.0 초기 점검 / 사용자 CMD 출력 10.0.26200.9711 |
| 현재 셸 | 사용자 직접 실습: Windows PowerShell 5.1.26100.9711 및 CMD / 보조 도구: PowerShell 7.6.5 |
| 리눅스 환경 | WSL 2.7.14.0, docker-desktop VERSION 2 / ubuntu:24.04 컨테이너의 Ubuntu 24.04.5 LTS 및 Bash 실행 확인 |
| Git | 2.52.0.windows.1 |
| Docker Desktop | 4.97.0 설치 성공 |
| Docker CLI / 엔진 | CLI 29.9.2, build a82e528 / Server 29.9.2, OSType=linux |
| VS Code | GitHub Pull Requests 확장 v0.174.0 설치, `gyungmini306-blip` 계정 연결 확인 |

실제 명령과 출력: [최초 환경 확인](docs/evidence/01-environment.md), [설치 및 재시작 대기 상태](docs/evidence/02-installation.md), [최초 Git 인증 확인](docs/evidence/03-git.md), [최종 E1-1 저장소 업로드 성공](docs/evidence/04-repository.md).

최근 실습 결과: [Docker 엔진 및 hello-world 성공](docs/evidence/05-hello-world.md), [Ubuntu 컨테이너 진입 및 경로 확인](docs/evidence/06-ubuntu-terminal.md), [웹 서버 빌드·포트·로그·리소스 검증](docs/evidence/07-web-server.md).

최신 페이지와 실제 빌드 검증: [E1-1 원리 학습 페이지 V2](docs/evidence/08-learning-page.md).

현재 첫 화면: [간단한 실습 페이지 V3](docs/evidence/09-simple-page.md).

사용자 직접 추가 실습: [터미널·권한 실습 기록](docs/evidence/10-user-terminal.md). 2026-11-03 파일·폴더 조작 및 파일 600→644, 디렉토리 700→755의 권한 전후 비교를 완료했습니다.

사용자 직접 웹 실습: [student-1 빌드 및 파일 수정 반영 실습 기록](docs/evidence/11-user-bind.md). 호스트 HTML을 수정한 뒤 바인드 8081은 V2, COPY 8082는 V1을 응답해 변경 반영 차이를 확인했습니다. [주소창 포함 브라우저 캡처](docs/evidence/15-browser.md)에서는 기존 COPY 서버 8080의 버전 1과 바인드 서버 8081의 버전 2를 확인했습니다.

사용자 직접 저장 공간 실습: [볼륨 검증 기록](docs/evidence/12-user-volume.md). 기존 컨테이너를 삭제하고 새 컨테이너에 같은 볼륨을 연결한 뒤 동일한 메모가 읽히는 것을 확인했습니다.

사용자 직접 운영 실습: [Docker 운영·셸 종료 방식 기록](docs/evidence/13-user-operations.md). exec 추가 Bash 종료 후 true, attach 연결 분리 후 true, 주 Bash 종료 후 exited를 실제 결과로 비교했습니다.

사용자가 Git 설정·브랜치·원격을 확인하고 HTML 수정본을 d580e49로 커밋·푸시했습니다. VS Code 계정 메뉴에 `gyungmini306-blip (GitHub)`이 표시됩니다. [Git 실습과 VS Code 연동 증거](docs/evidence/14-user-git.md)

문제 해결 과정: [트러블슈팅](docs/troubleshooting.md).

## 수행 체크리스트

- [x] 터미널 기본 조작: 현재 위치, 숨김 파일, 이동, 생성, 복사, 이름 변경, 삭제, 내용 확인, 빈 파일
- [x] 파일과 디렉토리 각각의 리눅스 권한 변경 전후 비교
- [x] Docker 버전 및 데몬 점검
- [x] 이미지 다운로드와 목록, 컨테이너 실행·중지·목록·로그·리소스 확인
- [x] hello-world 실행
- [x] Ubuntu 컨테이너에서 명령 실행 및 attach/exec/종료 차이 관찰
- [x] Dockerfile 커스텀 이미지 빌드 및 실행
- [x] 포트 매핑 HTTP 접속 검증
- [x] 주소창을 포함한 브라우저 증거
- [x] 바인드 마운트의 호스트 파일 변경 전후 비교
- [x] 컨테이너 삭제 전후 Docker 볼륨 데이터 보존 확인
- [x] Git 사용자 정보·기본 브랜치 및 로컬 커밋 확인
- [x] GitHub 업로드 및 원격 커밋 일치 검증
- [x] VS Code GitHub 연동 증거
- [x] 실제 문제의 원인 가설·확인·해결을 기록한 트러블슈팅 2건

선택 과제로 Docker Compose에서 웹 서버 한 개를 빌드·실행하고 상태·로그·종료를 확인했습니다. [Compose 실행 방법과 실제 출력](docs/evidence/16-compose-bonus.md)

## 소스 구성과 커스텀 목적

```text
app/index.html          제목·소개·버전이 있는 간단한 실습 페이지
app/principles.html     선택 자료: E1-1 원리 설명 및 실습 증거 안내
app/styles.css          원리 설명 화면 스타일
app/app.js              원리 설명용 모형 및 실제 HTTP 응답 확인
Dockerfile              NGINX 기반 이미지 빌드 정의
nginx.conf              웹 루트와 /healthz 상태 점검 경로
docs/evidence/          실제 명령·출력 및 캡처
```

베이스는 Docker Official Image인 `nginx:stable-alpine`입니다. 이 태그는 시간이 지나면 갱신될 수 있으므로 [빌드 검증 기록](docs/evidence/07-web-server.md)에 당시 베이스 digest와 커스텀 이미지 ID를 남겼습니다.

| 커스텀 항목 | 목적 |
|---|---|
| `COPY app/` | 기본 환영 화면을 프로젝트 소개 페이지로 교체 |
| `COPY nginx.conf` | 문서 루트와 상태 점검 경로를 명시 |
| `LABEL` | 이미지의 프로젝트 이름과 용도를 기록 |
| `HEALTHCHECK` | 컨테이너 프로세스 실행 여부와 별개로 HTTP 응답 점검 |

## 페이지와 과제의 관계

첫 화면은 과제의 커스텀 웹 서버가 제공하는 간단한 콘텐츠입니다. 이 화면의 문구와 버전을 수정하며 변경 반영을 실습합니다. 선택 링크의 원리 설명 자료는 아래 내용을 다룹니다. 설명 모형을 조작하는 것만으로 실제 실습이나 제출 증거 수집이 완료되지는 않습니다.

| 학습 영역 | 페이지에서 살펴볼 원리 | 별도로 필요한 실제 증거 |
|---|---|---|
| 전체 흐름 | Dockerfile → 이미지 → 컨테이너 → 브라우저 | 빌드·실행·HTTP 응답 |
| 경로·권한 | 절대/상대 경로, r/w/x와 644·755 계산 | 터미널 조작과 파일·디렉토리 권한 전후 |
| 이미지·컨테이너 | 빌드, 실행, 중지, 시작, 삭제와 이미지 유지 | 운영 명령 및 attach/exec 관찰 |
| 포트 연결 | 호스트 포트와 컨테이너의 80번 연결 | 실행 명령·응답·주소창 포함 캡처 |
| 마운트·볼륨 | COPY/바인드의 변경 반영, 볼륨의 별도 수명 | 실제 파일 변경 및 삭제 전후 데이터 |
| Git·제출물 | 작업 → add → commit → push | Git 설정·업로드·VS Code 연동·README |

페이지의 ‘현재 서버 응답 확인’ 버튼은 실제 `/healthz`에 HTTP GET 요청을 보냅니다. 그 외 버튼은 브라우저 안에서 설명용 상태만 바꾸며 Docker·파일·Git을 실제로 조작하지 않습니다. 모형의 결과는 실습 완료 체크에 반영하지 않습니다.

## 웹 서버 실행 방법

Docker 엔진을 실행한 상태에서 아래처럼 저장소를 가져옵니다. 이미 파일이 있다면 해당 저장소 루트로 이동합니다.

```powershell
git clone https://github.com/gyungmini306-blip/codyssey-E1-1-dev-workstation.git
cd codyssey-E1-1-dev-workstation
```

아래는 PowerShell 재현 명령이며, 실제 성공 출력은 [웹 서버 검증 기록](docs/evidence/07-web-server.md)에 있습니다. 동일 이름의 컨테이너가 이미 있으면 기존 서버에 접속하거나 별도 이름과 포트를 선택합니다.

```powershell
docker build -t codyssey-workstation:3.0 .
docker run -d --name codyssey-web -p 127.0.0.1:8080:80 codyssey-workstation:3.0
curl.exe -i http://localhost:8080/
curl.exe -i http://localhost:8080/healthz
docker logs codyssey-web
docker stats --no-stream codyssey-web
```

관찰을 마친 뒤 아래 명령으로 이 프로젝트의 웹 컨테이너를 중지하고 제거할 수 있습니다. 현재는 브라우저 확인을 위해 실행 중입니다.

```powershell
docker stop codyssey-web
docker rm codyssey-web
```

브라우저 주소는 `http://localhost:8080`입니다. `127.0.0.1:8080:80`은 PC의 로컬 접속용 8080번 포트를 컨테이너 안 NGINX의 80번 포트에 연결합니다. `EXPOSE 80`만으로는 호스트 포트가 열리지 않습니다. 이름이나 포트가 이미 사용 중이면 기존 리소스를 임의로 지우지 말고 다른 이름/호스트 포트를 선택합니다.

권한 실습은 Ubuntu 컨테이너 내부의 리눅스 파일시스템에서 수행했습니다. 바인드 마운트는 호스트의 `app` 폴더를 별도 실습 컨테이너에 연결해 변경 반영을 검증했습니다. Windows 파일의 권한 동작을 일반 리눅스 권한과 혼동하지 않습니다.

## 핵심 개념

- **절대/상대 경로:** `/home/learner/lab`은 루트부터의 절대 경로, `./app`은 현재 위치를 기준으로 한 상대 경로입니다.
- **권한:** `r=4`, `w=2`, `x=1`을 더합니다. `755`는 소유자 `rwx`, 그룹 `r-x`, 기타 `r-x`이며, `644`는 소유자 `rw-`, 그룹·기타 `r--`입니다. 디렉토리의 `x`는 그 안으로 진입하고 경로를 탐색할 권한입니다.
- **이미지/컨테이너:** 이미지는 실행에 필요한 파일과 설정의 묶음이며, 컨테이너는 그 이미지를 바탕으로 만든 실행 인스턴스입니다.
- **포트 매핑:** 호스트와 컨테이너가 분리된 네트워크 공간을 사용하므로 접속할 포트를 연결합니다.
- **바인드 마운트/볼륨:** 바인드 마운트는 지정한 호스트 경로를 연결하고, 볼륨은 Docker가 관리하는 저장 공간을 연결합니다. 볼륨을 별도로 삭제하지 않으면 이를 사용한 컨테이너를 삭제해도 데이터가 남습니다.
- **Git/GitHub:** Git은 로컬 변경 기록을 관리하는 도구이고, GitHub는 원격 저장소와 협업 기능을 제공하는 서비스입니다.

## 증거와 개인정보

예정된 명령과 실제 실행 로그를 구별합니다. 토큰, 비밀번호, 개인키, 인증 코드는 저장하지 않습니다. Git 설정 출력은 인증 관련 값과 개인 정보를 확인한 뒤 필요한 항목만 기록합니다. 설치 원본 로그에는 PC 이름과 개인 경로가 포함될 수 있어 그대로 공개하지 않습니다.
