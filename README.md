# Codyssey E1-1 · 내 컴퓨터에 개발자용 작업실 꾸미기

## 1. 프로젝트 개요

다른 사람도 같은 웹 서버를 실행할 수 있도록 개발 환경을 구성했습니다. 먼저 Ubuntu의 Bash에서 파일과 권한을 다뤘습니다. 그다음 Dockerfile로 NGINX 웹 서버를 만들고, PC에서 접속해 HTML 변경이 반영되는지 확인했습니다. 별도의 Ubuntu 컨테이너에서는 볼륨에 쓴 데이터가 컨테이너 교체 후에도 남는지 확인했습니다. 소스와 실습 기록은 Git으로 관리하고 GitHub에 공유했습니다. 6절의 명령으로 저장소를 내려받아 웹 서버를 실행할 수 있습니다.

## 2. 실행 환경과 저장소 구성

| 항목 | 실제 실습 환경 |
|---|---|
| OS · 터미널 | Windows 11 · Windows Terminal |
| 셸 | Windows PowerShell 5.1, 일부 확인은 CMD, Linux 실습은 Ubuntu 24.04의 Bash |
| Docker | Docker Desktop 4.97.0 · CLI/엔진 29.9.2 · Linux 컨테이너 모드 · Compose v5.6.1 |
| Git · 편집기 | Git 2.52.0.windows.1 · VS Code |

| 경로 | 역할 |
|---|---|
| [app/index.html](app/index.html) | 웹 서버가 제공하는 정적 HTML |
| [Dockerfile](Dockerfile) · [nginx.conf](nginx.conf) | 이미지 구성과 NGINX 수신 포트·응답 설정 |
| [docs/evidence/](docs/evidence/) | 실습 로그와 캡처. 각 항목에서 해당 기록을 연결합니다. |
| [compose.yaml](compose.yaml) | 보너스 과제의 단일 웹 서비스 설정 |

웹 콘텐츠는 `app/`, 실행 설정은 저장소 루트, 검증 기록은 `docs/evidence/`에 두었습니다. HTML을 수정할 위치와 서버 실행 설정, 확인 결과를 구분해 찾기 위한 구성입니다.

Docker Desktop을 켠 뒤 Docker·Git 명령은 PowerShell에서, 4절의 파일·권한 명령은 Ubuntu 컨테이너의 Bash에서 실행합니다. 명령은 한 줄씩 복사하고, 실행 결과는 각 항목의 캡처와 원본 로그에서 확인합니다.

## 3. 수행 체크리스트

- [x] 터미널 조작 · [명령과 출력](docs/evidence/10-user-terminal.md)
- [x] 파일·디렉터리 권한 변경 · [권한 전후 비교](#4-터미널과-권한-실습)
- [x] Docker 엔진 점검과 운영 · [목록·로그·리소스 기록](docs/evidence/13-user-operations.md)
- [x] hello-world와 Ubuntu 실습 · [실행과 셸 종료 결과](#5-docker-점검과-운영)
- [x] 커스텀 이미지 빌드·실행 · [빌드·실행 명령과 사용자 캡처](#6-커스텀-웹-서버-이미지와-포트-매핑)
- [x] 포트 매핑 접속 · [명령과 HTTP 응답](#6-커스텀-웹-서버-이미지와-포트-매핑)
- [x] 바인드 마운트와 볼륨 영속성 · [수정·삭제 전후 비교](#7-바인드-마운트와-볼륨-영속성)
- [x] Git 설정과 GitHub 푸시 · [마스킹한 설정과 푸시 결과](#8-git-설정과-github-연동)
- [x] VS Code GitHub 로그인 · [계정 메뉴 캡처](docs/evidence/14-vscode-github.png)
- [x] VS Code에서 과제 저장소 연결 확인 · [소스 제어와 GitHub 화면](#8-git-설정과-github-연동)

이미지의 핵심 결과는 본문에도 텍스트로 발췌했으며, 전체 명령·출력은 아래 증거 링크에서 확인할 수 있습니다.

| 검증 항목 | 확인한 실제 결과 | 텍스트 증거 |
|---|---|---|
| 파일 생성·복사·이동·삭제 | 복사본 생성·이동 후 삭제, 원본 메모 유지 | [터미널 출력](docs/evidence/10-user-terminal.md) |
| 파일·디렉터리 권한 | 파일과 디렉터리 각각의 변경 전후 권한 확인 | [권한 출력](docs/evidence/10-user-terminal.md#10-c-파일과-디렉토리-권한-변경-전후) |
| 이미지 빌드 | 사용자 빌드 로그의 태그 지정과 `DONE` | [사용자 빌드 출력](docs/evidence/11-user-bind.md#11-b-사용자-직접-이미지-빌드) |
| 포트 접속·서버 운영 | HTTP 200·`ok`, `healthy`, CPU·메모리 조회 | [접속 결과](#6-커스텀-웹-서버-이미지와-포트-매핑) · [운영 출력](docs/evidence/32-user-web-operations.md) |

## 4. 터미널과 권한 실습

Windows에서 Linux 명령과 `chmod` 권한을 실습하기 위해 Ubuntu 컨테이너를 실행했습니다. 이 컨테이너는 파일·권한 연습에 사용했고, 웹 서버는 6절의 별도 NGINX 컨테이너에서 실행했습니다. 원본을 남겨 두기 위해 `cp`로 복사한 뒤, 복사본만 `mv`로 옮기고 `rm`으로 지웠습니다.

### 작업 위치와 파일 목록

![작업 위치, 숨김 파일 목록, 메모 내용 확인](docs/evidence/23-terminal-location-list.png)

`pwd`에 작업 경로가 표시되고, `ls -la`에는 숨김 파일인 `.hidden-note`와 빈 파일인 `empty.txt`가 보입니다. `cat memo.txt`로 저장한 문구를 확인했습니다.

**위 캡처의 실제 출력 발췌.** 목록에서는 파일 세 행만 옮겼습니다.

```text
$ pwd
/root/e1-1/guided-practice
$ ls -la
-rw-r--r-- 1 root root    0 Nov  3 11:41 .hidden-note
-rw-r--r-- 1 root root    0 Nov  3 11:41 empty.txt
-rw-r--r-- 1 root root   23 Nov  3 11:41 memo.txt
$ cat memo.txt
E1-1 terminal practice
```

처음 실행한다면 아래 명령으로 Ubuntu 컨테이너와 Bash를 시작합니다. 이미 실행 중인 컨테이너가 있다면 다음 `exec` 명령을 사용합니다.

```powershell
docker run --rm -it ubuntu:24.04 bash
```

**`-it`를 사용한 이유.** 컨테이너 안의 Bash에 직접 명령을 입력하며 실습하기 위해 `-i`와 `-t`를 함께 사용했습니다.

| 옵션 | 의미 |
|---|---|
| `-i` | 표준 입력을 열어 두어 키보드 입력을 전달할 수 있게 함 |
| `-t` | 셸을 대화형으로 사용할 터미널 환경을 제공함 |

기존 `e1-1-ubuntu` 컨테이너가 실행 중이라면 대신 아래 명령으로 추가 Bash를 엽니다.

```powershell
docker exec -it e1-1-ubuntu bash
```

이후 4절의 명령은 Ubuntu Bash에서 순서대로 실행합니다.

실습 폴더를 만듭니다.

```bash
mkdir -p /root/e1-1/guided-practice
```

만든 폴더로 이동합니다.

```bash
cd /root/e1-1/guided-practice
```

현재 위치를 확인합니다.

```bash
pwd
```

빈 파일과 숨김 파일을 만듭니다.

```bash
touch empty.txt .hidden-note
```

메모를 파일에 저장합니다.

```bash
echo "E1-1 terminal practice" > memo.txt
```

숨김 파일까지 상세 조회합니다.

```bash
ls -la
```

저장한 메모를 읽습니다.

```bash
cat memo.txt
```

### 복사본 이동과 삭제

![메모 복사본을 옮기고 지운 뒤 원본이 남은 화면](docs/evidence/21-terminal-copy-move-delete.png)

`mv` 뒤에는 `archive` 안에 `memo-renamed.txt`가 보입니다. 복사본과 빈 폴더를 지운 뒤 마지막 목록에서 원본 `memo.txt`가 남은 것을 확인했습니다.

**위 캡처의 명령·출력 발췌.** `ls -la`의 반복 행은 줄였습니다. 삭제 직후 `archive`에는 `.`과 `..`만 남았습니다.

```text
$ cp memo.txt memo-copy.txt
$ ls -l memo-copy.txt
-rw-r--r-- 1 root root 23 Nov  3 11:43 memo-copy.txt
$ mkdir -p archive
$ mv memo-copy.txt archive/memo-renamed.txt
$ cd archive
$ ls -la
-rw-r--r-- 1 root root 23 Nov  3 11:43 memo-renamed.txt
$ cd ..
$ rm archive/memo-renamed.txt
$ ls -la archive
total 8
drwxr-xr-x 2 root root 4096 Nov  3 11:43 .
drwxr-xr-x 3 root root 4096 Nov  3 11:43 ..
$ rmdir archive
```

메모를 복사합니다.

```bash
cp memo.txt memo-copy.txt
```

복사본을 둘 폴더를 만듭니다.

```bash
mkdir -p archive
```

복사본을 옮기면서 이름을 바꿉니다.

```bash
mv memo-copy.txt archive/memo-renamed.txt
```

옮긴 파일이 있는지 확인합니다.

```bash
ls -la archive
```

복사본을 삭제합니다.

```bash
rm archive/memo-renamed.txt
```

비어 있는지 확인합니다.

```bash
ls -la archive
```

빈 폴더를 삭제합니다.

```bash
rmdir archive
```

원본이 남았는지 확인합니다.

```bash
ls -la
```

`/root/e1-1/guided-practice`는 루트부터 찾는 절대 경로이고, `archive/memo-renamed.txt`는 현재 폴더를 기준으로 찾는 상대 경로입니다. 목록에서 빈 파일 두 개의 크기가 0이고, 복사본을 지운 뒤 `archive`에 파일이 남지 않은 것을 확인했습니다.

### 파일과 디렉터리 권한 변경 전후

![chmod 전후의 파일과 폴더 권한을 확인한 실제 화면](docs/evidence/23-terminal-permissions.png)

`chmod` 실행 뒤, 파일은 `644 → 600`, 폴더는 `755 → 700`이 되어 그룹과 기타 사용자의 권한이 사라졌습니다.

**위 캡처의 변경 전후.** 캡처에서는 `practice/memo.txt`와 `practice`를 사용했습니다. 아래 실행 안내에서는 같은 권한 변경을 현재 실습 폴더의 `memo.txt`와 `permissions-dir`에 적용합니다.

```text
$ ls -l practice/memo.txt
-rw-r--r-- 1 root root 0 Nov  3 09:59 practice/memo.txt
$ chmod 600 practice/memo.txt
$ ls -l practice/memo.txt
-rw------- 1 root root 0 Nov  3 09:59 practice/memo.txt
```

```text
$ ls -ld practice
drwxr-xr-x 2 root root 4096 Nov  3 09:57 practice
$ chmod 700 practice
$ ls -ld practice
drwx------ 2 root root 4096 Nov  3 09:57 practice
```

파일의 현재 권한을 확인합니다.

```bash
ls -l memo.txt
```

파일을 소유자만 읽고 쓸 수 있도록 바꿉니다.

```bash
chmod 600 memo.txt
```

변경된 파일 권한을 확인합니다.

```bash
ls -l memo.txt
```

권한 실습용 폴더를 만듭니다.

```bash
mkdir -p permissions-dir
```

폴더 자체의 권한을 확인합니다.

```bash
ls -ld permissions-dir
```

폴더를 소유자만 사용할 수 있도록 바꿉니다.

```bash
chmod 700 permissions-dir
```

변경된 폴더 권한을 확인합니다.

```bash
ls -ld permissions-dir
```

`ls -l`로 파일을, `ls -ld`로 디렉터리 자체를 조회했습니다. 각각 권한을 변경한 뒤 다시 조회해 전후를 비교했습니다.

| 권한 | 일반 파일 | 디렉터리 |
|---|---|---|
| `r` = 4 | 내용 읽기 | 이름 목록 읽기 |
| `w` = 2 | 내용 수정 | 항목 생성·삭제·이름 변경에 필요하며 일반적으로 `x`도 필요 |
| `x` = 1 | 프로그램으로 실행 | 디렉터리 진입과 경로 탐색 |

숫자는 소유자·그룹·기타 사용자 순서입니다. `644`는 `rw-r--r--`, `755`는 `rwxr-xr-x`입니다. 위 캡처에서 권한 변경 전후를 확인할 수 있습니다. 과제에서 요구하는 명령·출력 텍스트는 [원본 실습 로그](docs/evidence/10-user-terminal.md)에 보관했습니다.

4절이 끝나면 Ubuntu Bash에서 아래 명령으로 나와 PowerShell로 돌아옵니다. 위의 `--rm`으로 시작한 임시 컨테이너는 이때 삭제되며, 그 안의 실습 파일도 함께 삭제됩니다.

```bash
exit
```

## 5. Docker 점검과 운영

### hello-world 실행 확인

![사용자가 실행한 hello-world 인사말과 컨테이너 정상 종료](docs/evidence/29-user-hello-world.png)

위 캡처에서 `docker run`의 `Hello from Docker!`와 `docker ps -a`의 `Exited (0)`을 확인했습니다. 컨테이너 안의 프로그램이 메시지를 출력한 뒤 정상 종료했습니다.

[hello-world 실행 원본 로그](docs/evidence/05-hello-world.md)

테스트 컨테이너를 실행합니다. 같은 이름의 종료된 컨테이너가 남아 있다면 삭제하거나 다른 이름으로 실행합니다.

```powershell
docker run --name e1-1-hello hello-world
```


테스트 컨테이너의 종료 상태를 확인합니다.

```powershell
docker ps -a --filter "name=e1-1-hello"
```

실행에 사용한 이미지가 PC에 있는지 확인합니다.

```powershell
docker image ls hello-world
```

### Docker 버전과 엔진 연결 확인

![docker --version 명령과 Docker CLI 버전 출력](docs/evidence/35-docker-cli-version.png)

캡처에서 Docker CLI 버전 `29.9.2`를 확인했습니다.

Docker 명령 도구의 버전을 확인합니다.

```powershell
docker --version
```

Docker 엔진 응답을 확인합니다. [(실행결과)](docs/evidence/35-docker-info.md)

```powershell
docker info
```


### Ubuntu의 셸과 컨테이너 수명

![exec로 연 Bash에서 exit한 뒤에도 e1-1-shell-guide가 Up 상태인 사용자 화면](docs/evidence/36-user-exec-running.png)

과제에서 요구한 셸 종료와 컨테이너 유지의 차이를 확인했습니다. `docker exec`로 추가 Bash를 열었다가 `exit`로 나왔지만, `docker ps -a`에서 `e1-1-shell-guide`가 `Up`으로 표시돼 컨테이너는 계속 실행 중임을 확인했습니다.

**이유:** `exec`로 연 추가 Bash만 종료됐고, 컨테이너를 유지하는 원래 Bash는 계속 실행 중이기 때문입니다. [위 캡처의 명령과 실제 출력](docs/evidence/36-user-exec.md)

![attach로 원래 Bash에 연결해 exit한 뒤 e1-1-shell-guide가 Exited 상태인 사용자 화면](docs/evidence/37-user-attach-exited.png)

이번에는 `docker attach`로 원래 Bash에 연결한 뒤 `exit`했습니다. 같은 컨테이너가 `Exited (0)`으로 바뀌어, 주 Bash를 종료하면 컨테이너도 정상 종료됨을 확인했습니다. [위 캡처의 명령과 실제 출력](docs/evidence/37-user-attach.md)

| 연결 방식 | `exit`로 종료한 대상 | 실제 컨테이너 상태 |
|---|---|---|
| `exec` | 추가로 연 Bash | `Up` — 계속 실행 |
| `attach` | 원래 주 프로세스인 Bash | `Exited (0)` — 정상 종료 |

이 비교는 주 프로세스가 Bash인 위 Ubuntu 컨테이너의 결과입니다. 종료하지 않고 연결만 분리한 사례는 [기존 exec·attach 명령과 상태 출력](docs/evidence/13-user-operations.md)에서 확인할 수 있습니다.

## 6. 커스텀 웹 서버 이미지와 포트 매핑

**이미지 빌드 결과.** 사용자가 `build-check` 태그로 빌드한 화면에서 명령과 성공 결과를 잘랐습니다.

![사용자가 입력한 Docker 빌드 명령과 FINISHED 결과](docs/evidence/31-user-build-finished.png)

**캡처의 실행 명령.** 빌드 결과에서 `FINISHED`를 확인했습니다. [실제 명령과 출력](docs/evidence/31-user-build.md)

```powershell
docker build -t e1-1-web:build-check .
```

`-t`는 이미지 이름·태그를 지정하고, 마지막 `.`은 현재 폴더를 빌드 재료로 사용한다는 뜻입니다.

**생성된 이미지 확인.** 목록에 `e1-1-web:build-check`가 표시됐습니다.

![빌드한 이미지의 이름과 ID가 표시된 사용자 조회 결과](docs/evidence/31-user-built-image.png)

```powershell
docker image ls e1-1-web:build-check
```

캡처에서 이미지 ID `8dafd1b2588d`, 디스크 사용량 `92.8MB`, 콘텐츠 크기 `26.1MB`를 확인했습니다. [실제 명령과 출력](docs/evidence/31-user-build.md)

**이미지 구성.** [Dockerfile](Dockerfile)의 `FROM nginx:stable-alpine`로 NGINX가 이미 설치된 이미지를 사용했습니다. 여기에 우리 HTML과 서버 설정을 추가했습니다.

| 설정 | 작성한 이유 |
|---|---|
| `COPY` | HTML과 NGINX 설정을 이미지에 추가 |
| `LABEL` | 이미지 용도 기록 |
| `EXPOSE 80` | 사용 포트 표시 — 실제 수신 포트는 [nginx.conf](nginx.conf)의 `listen 80`에서 설정 |
| `HEALTHCHECK` | `/healthz` 응답으로 서버 상태 점검 |

**Dockerfile과 HTML → `docker build` → 이미지 → `docker run` → 컨테이너 실행** 순서입니다.

Docker Desktop을 켜고 PowerShell에서 저장소를 내려받습니다. 이미 내려받았다면 기존 저장소 폴더로 이동한 뒤 빌드부터 실행합니다.

저장소를 내려받습니다. [(실행결과)](docs/evidence/39-user-clone.md)

```powershell
git clone https://github.com/gyungmini306-blip/codyssey-E1-1-dev-workstation.git e1-1
```

저장소 루트로 이동합니다. [(실행결과)](docs/evidence/39-user-clone.md)

```powershell
cd e1-1
```

NGINX와 HTML을 담은 이미지를 만듭니다. [(실행결과)](docs/evidence/38-user-v1-build.md)

```powershell
docker build -t e1-1-web:v1 .
```

![웹 서버 컨테이너 생성과 PC 8080 포트의 HTTP 200 응답을 확인한 사용자 화면](docs/evidence/40-user-web-run-http.png)

이미지에서 웹 서버를 실행하고 PC의 8080을 컨테이너의 80에 연결합니다. `127.0.0.1`로 지정해 이 PC에서 접속하도록 했습니다.

```powershell
docker run -d --name e1-1-web -p 127.0.0.1:8080:80 e1-1-web:v1
```

PC에서 웹 서버 응답을 확인합니다.

```powershell
curl.exe -i http://127.0.0.1:8080/healthz
```

**접속 결과 · PC 8080 → 컨테이너 80.** 위 캡처에서 컨테이너 생성 ID와 HTTP `200 OK`를 확인했습니다. 브라우저 주소창과 웹페이지는 7절의 수정 전 캡처에서, 명령·응답 텍스트는 [실제 실행 기록](docs/evidence/40-user-web-run-http.md)에서 확인할 수 있습니다.

**포트 매핑이 필요한 이유.** 이번 실습의 컨테이너는 PC와 분리된 네트워크 공간(네트워크 네임스페이스)에서 실행되므로, PC에서 접속할 포트를 연결해야 합니다. `-p 127.0.0.1:8080:80`은 PC의 8080번으로 들어온 요청을 컨테이너 안의 NGINX 80번으로 전달합니다(포트 포워딩). 7절에서는 두 컨테이너가 각각 내부 80번을 사용하고, PC에서는 8080·8081로 구분해 접속합니다.

`v1`은 이미지에 붙인 태그입니다. 브라우저의 페이지 버전은 HTML 안의 문구로 결정됩니다. `8080`이 이미 사용 중이면 실행 명령과 접속 주소에 같은 빈 포트를 지정합니다.

### 실행한 웹 서버의 이미지·로그·자원 확인

![사용자가 실행한 웹 서버 시작, 이미지 목록, 상태, 요청 로그와 자원 조회 결과](docs/evidence/32-user-web-operations.png)

`e1-1-web`은 `e1-1-web:v1` 이미지로 실행돼 `healthy`와 `8080 → 80` 연결이 표시됐으며, `build-check`는 별도 빌드 태그입니다. 자동 상태 점검(`Wget`)의 `/healthz` 응답은 세 번 모두 `200`이었고, 조회 당시 CPU는 `0.00%`, 메모리는 `11.33 MiB`였습니다.

아래 명령은 이 절에서 `e1-1-web`을 만든 뒤 PowerShell에서 실행합니다. 서버의 실행 상태와 정상 응답, 자원 사용량을 확인하기 위해 조회했습니다. [캡처의 명령과 실제 출력](docs/evidence/32-user-web-operations.md)

종료된 웹 서버 컨테이너를 다시 시작할 때 사용합니다.

```powershell
docker start e1-1-web
```

웹 서버 이미지를 조회합니다.

```powershell
docker image ls e1-1-web
```

웹 서버 하나의 실행 상태와 포트 연결을 조회합니다.

```powershell
docker ps --filter "name=^/e1-1-web$"
```

서버가 받은 최근 요청을 조회합니다.

```powershell
docker logs --tail 3 e1-1-web
```

웹 서버의 자원 사용량을 한 번 조회합니다.

```powershell
docker stats --no-stream e1-1-web
```

## 7. 바인드 마운트와 볼륨 영속성

### HTML 수정 반영

**수정 전.** 왼쪽 `8080`과 오른쪽 `8081` 모두 페이지 버전 2를 반환했습니다.

![수정 전 왼쪽 8080과 오른쪽 8081 모두 페이지 버전 2](docs/evidence/24-replay-bind-before-cropped.png)

**수정 후.** 같은 순서로, 왼쪽 `8080`은 버전 2를 유지했고 오른쪽 `8081`에만 버전 3이 표시됐습니다.

![수정 후 왼쪽은 버전 2를 유지하고 오른쪽은 버전 3으로 변경](docs/evidence/24-replay-bind-after.png)

**포트 연결 확인.** 원본 목록에서 두 웹 서버의 `8080 → 80`, `8081 → 80` 행만 잘라 이어 붙였습니다. [명령과 출력](docs/evidence/41-user-web-ports.md)

![docker ps -a 결과에서 두 웹 서버의 포트 연결 행만 발췌](docs/evidence/41-user-web-ports.png)

PC에서 수정한 파일이 어느 서버에 반영되는지 비교했습니다. `8080` 서버를 그대로 둔 상태에서, 저장소 루트의 PowerShell로 **같은 이미지**를 쓰는 두 번째 서버를 실행했습니다. `8081`에만 PC의 `app/` 폴더를 NGINX의 웹 폴더에 읽기 전용으로 연결했습니다.

![PC app 폴더의 바인드 마운트 설정과 8081 웹 서버 생성 명령을 실행한 사용자 화면](docs/evidence/42-user-bind-mount.png)

위 캡처에서 PC 폴더 경로와 연결 설정을 지정한 뒤 컨테이너 생성 ID가 출력됐습니다. [명령과 실제 출력](docs/evidence/42-user-bind-mount.md)

연결할 PC 폴더의 전체 경로를 구합니다.

```powershell
$appPath = (Resolve-Path .\app).Path
```

폴더 연결 설정을 저장합니다.

```powershell
$mountSpec = "type=bind,source=$appPath,target=/usr/share/nginx/html,readonly"
```

같은 이미지로 바인드 마운트 서버를 실행합니다.

```powershell
docker run -d --name e1-1-web-bind -p 127.0.0.1:8081:80 --mount $mountSpec e1-1-web:v1
```

두 페이지가 버전 2인 것을 확인한 뒤, PC의 `app/index.html`을 열고 화면에 표시되는 `페이지 버전: 2` 문구를 `페이지 버전: 3 (바인드 입니다.)`로 바꾼 뒤 저장했습니다. 이미지를 다시 빌드하거나 컨테이너를 다시 시작하지 않고, 두 페이지를 새로고침했습니다.

| 서버 | 읽는 파일 | 수정 전 | 수정 후 |
|---|---|---|---|
| `8080` | 빌드할 때 이미지에 복사해 둔 HTML | 버전 2 | **버전 2 유지** |
| `8081` | 바인드 마운트로 연결한 PC의 HTML | 버전 2 | **버전 3으로 변경** |

### 컨테이너 교체 후 데이터 확인

`-v e1-1-replay-data:/data`는 컨테이너의 `/data`를 볼륨에 연결합니다. 따라서 `/data/memo.txt`에 쓰면 해당 볼륨에 저장되며, 별도로 복사하는 과정은 없습니다. 컨테이너를 삭제한 뒤 새 컨테이너에 같은 볼륨을 연결해 메모가 남는지 확인했습니다.

아래 순서대로 실행하고, 삭제 전후 두 `cat` 명령의 출력이 같은지 비교합니다.

![볼륨 생성과 컨테이너 연결 및 삭제 전 메모 저장을 확인한 사용자 화면](docs/evidence/43-user-volume-before.png)

**저장 결과.** 볼륨을 생성·연결하고 메모를 저장한 뒤, `cat`에서 `E1-1-volume-proof`가 출력됐습니다. [명령과 실제 출력](docs/evidence/43-user-volume.md)

이름 있는 볼륨을 만듭니다.

```powershell
docker volume create e1-1-replay-data
```

첫 컨테이너에 볼륨을 연결합니다.

```powershell
docker run -d --name e1-1-volume-before -v e1-1-replay-data:/data ubuntu:24.04 sleep infinity
```

볼륨에 메모를 저장합니다.

```powershell
docker exec e1-1-volume-before sh -c 'echo E1-1-volume-proof > /data/memo.txt'
```

삭제 전 메모를 읽습니다.

```powershell
docker exec e1-1-volume-before cat /data/memo.txt
```

![기존 컨테이너 삭제 후 볼륨 유지와 새 컨테이너의 동일 메모 출력을 확인한 사용자 화면](docs/evidence/43-user-volume-after.png)

**삭제·재연결 결과.** 기존 컨테이너를 삭제한 뒤에도 볼륨이 목록에 남았고, 새 컨테이너에서는 메모를 다시 쓰지 않고도 같은 내용을 읽었습니다. [사용자가 제공한 볼륨 명령과 실제 출력](docs/evidence/43-user-volume.md)

첫 컨테이너를 멈춥니다.

```powershell
docker stop e1-1-volume-before
```

첫 컨테이너를 삭제합니다.

```powershell
docker rm e1-1-volume-before
```

볼륨 목록에서 `e1-1-replay-data`가 남았는지 확인합니다.

```powershell
docker volume ls
```

새 컨테이너에 같은 볼륨을 연결합니다.

```powershell
docker run -d --name e1-1-volume-after -v e1-1-replay-data:/data ubuntu:24.04 sleep infinity
```

새 컨테이너에서 같은 메모를 읽습니다.

```powershell
docker exec e1-1-volume-after cat /data/memo.txt
```

| 확인 시점 | 실제 메모 출력 |
|---|---|
| 첫 컨테이너에서 삭제 전 조회 | `E1-1-volume-proof` |
| 새 컨테이너에 같은 볼륨 연결 후 조회 | `E1-1-volume-proof` |

## 8. Git 설정과 GitHub 연동

PC에서 변경 이력을 관리하는 Git으로 HTML 수정을 커밋하고, 원격 공유 플랫폼인 GitHub에 푸시했습니다. 작성자 설정·기본 브랜치·현재 브랜치와 푸시 결과는 [사용자 원본 로그](docs/evidence/14-user-git.md)에서 확인할 수 있습니다.

![main 브랜치와 GitHub 원격 저장소 주소를 확인한 사용자 화면](docs/evidence/44-user-git-connection.png)

화면에서 현재 브랜치 `main`과 과제 저장소의 fetch·push 주소를 확인할 수 있습니다. 명령과 해당 출력만 보이도록 원본 캡처를 잘랐습니다.

푸시 출력에서 HTML 수정 커밋이 원격 `main`에 올라간 것을 확인했습니다. VS Code 계정 메뉴에서는 GitHub 로그인 상태를 확인했습니다.

![VS Code에서 확인한 GitHub 로그인](docs/evidence/14-vscode-github.png)

**VS Code 저장소 연결.** 과제 폴더를 열었을 때 소스 제어에 `main` 브랜치와 커밋 이력이 표시됐으며, README의 저장소 주소와 창 제목도 함께 확인했습니다.

![VS Code 소스 제어의 main 브랜치와 과제 커밋 이력](docs/evidence/25-vscode-source-control.png)

GitHub Pull Requests 뷰에서 현재 브랜치의 목록을 확인했으며, “이 범주의 끌어오기 요청 0개”는 해당 범주에 요청이 없다는 뜻입니다. 원격 주소는 위의 사용자 CMD 캡처에서 확인할 수 있습니다.

![과제 폴더에서 열린 VS Code GitHub Pull Requests 뷰](docs/evidence/25-vscode-github-repository.png)

과제 폴더의 PowerShell에서 Git 설정을 확인합니다. 공개할 출력에서는 개인 이메일을 가립니다.

```powershell
git config --local --list
```

<img src="docs/evidence/46-user-git-add-commit.png" alt="사용자가 HTML을 선택하고 커밋한 뒤 결과를 확인한 화면" width="650">

**커밋 결과.** HTML 수정 내용을 선택해 `3e9c201` 커밋으로 기록했습니다. `1 file changed, 1 insertion(+), 1 deletion(-)`으로 파일 한 개의 한 줄 변경을 확인했습니다. 이 화면은 로컬 기록이며, GitHub 업로드 성공은 푸시 결과로 따로 확인합니다. [캡처의 명령과 출력](docs/evidence/46-user-git-add-commit.md)

HTML 수정 내용을 기록할 때 사용한 핵심 명령입니다. 이미 기록한 내용을 다시 커밋할 필요는 없습니다.

수정한 HTML을 커밋 대상으로 고릅니다.

```powershell
git add app/index.html
```

변경 이력을 PC에 기록합니다.

```powershell
git commit -m "Update bind mount practice text"
```

기록된 최근 커밋을 한 줄로 확인합니다.

```powershell
git log -1 --oneline
```

커밋을 GitHub에 올립니다.

```powershell
git push
```

## 9. 트러블슈팅

| 문제 | 원인 가설 | 확인 방법과 결과 | 해결 또는 대안 |
|---|---|---|---|
| Docker 명령은 실행됐지만 엔진에 연결할 수 없음 | Docker Desktop 엔진이 시작되지 않았을 수 있음 | 사용자 화면에서 `docker --version`은 출력됐지만 `docker info`와 `docker ps`는 `dockerDesktopLinuxEngine` 파이프에 연결하지 못했습니다. | Docker Desktop을 시작한 뒤 사용자가 같은 명령을 다시 실행하자 서버 버전과 컨테이너 목록이 출력됐습니다. [사용자 전후 캡처와 출력](docs/evidence/27-docker-engine.md) |
| 새 컨테이너가 호스트 포트 8083을 사용하지 못함 | 기존 서비스가 같은 포트를 점유했을 수 있음 | `docker ps`와 `netstat -ano`에서 점유를 확인했고, 같은 포트에 실행하자 `port is already allocated` 출력 | 빈 포트 18085로 실행해 HTTP 200과 `ok`를 확인함. [기록](docs/evidence/18-port-conflict.md) |

**엔진 연결 실패 화면.** Docker 버전은 조회됐지만 엔진을 사용하는 두 명령은 실패했습니다. 해결 후 엔진 정보는 5절의 ‘Docker 버전과 엔진 연결 확인’에 있는 ‘실행결과’ 링크에서 확인할 수 있습니다.

![Docker Desktop 시작 전 엔진 연결에 실패한 사용자 화면](docs/evidence/27-docker-engine-before.png)

## 10. 보너스 1번 · Docker Compose 기초

![사용자가 촬영한 Compose 상태 확인과 종료 결과](docs/evidence/17-cmd-compose.png)

**Compose는 빌드·실행 설정을 파일로 저장하고 적용하는 도구입니다.** 같은 서버를 반복 실행하고 설정을 공유하기 위해, 명령에 직접 입력했던 빌드 위치와 포트 연결을 `compose.yaml`에 적었습니다.

**같은 저장소 폴더의 Dockerfile과 Compose 파일을 함께 사용합니다.**

| 파일 | 이 실습에서 정한 내용 |
|---|---|
| `Dockerfile` | 이미지에 넣을 NGINX·HTML·서버 설정·상태 점검 |
| `compose.yaml` | 빌드할 폴더, 실행할 서비스, PC와 컨테이너의 포트 연결 |

**① [Dockerfile](Dockerfile) — 이미지를 어떻게 만들지 정합니다.** 아래는 저장소의 실제 파일 내용입니다.

```dockerfile
FROM nginx:stable-alpine

LABEL org.opencontainers.image.title="Codyssey E1-1 Workstation Lab"
LABEL org.opencontainers.image.description="A personal development workstation practice server"

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY app/ /usr/share/nginx/html/

EXPOSE 80
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1/healthz || exit 1
```

`FROM`은 NGINX 기반 이미지를 선택하고, 두 `COPY`는 서버 설정과 HTML을 추가합니다. `HEALTHCHECK`는 응답을 점검하며, PC의 포트 연결은 아래 Compose 파일에서 설정합니다.

**② [compose.yaml](compose.yaml) — 그 이미지로 웹 서버 하나를 실행할 설정을 정합니다.**

```yaml
services:
  web:
    build: .
    ports:
      - "127.0.0.1:8083:80"
```

| 설정 | 의미 |
|---|---|
| `services.web` | web이라는 웹 서버 서비스 한 개 |
| `build: .` | Compose 파일이 있는 폴더를 빌드 대상으로 삼고, 그 안의 Dockerfile 사용 |
| `127.0.0.1:8083:80` | 내 PC의 8083번을 컨테이너의 80번에 연결 |

**③ 아래 `up -d --build --wait` 명령으로 실행합니다.** Compose는 `build: .`에 지정된 폴더의 Dockerfile로 이미지를 빌드한 뒤, `web` 컨테이너를 생성·실행하고 PC의 8083번을 연결하며 상태 점검을 통과할 때까지 기다립니다.

**사용자가 직접 실행해 확인한 결과입니다.**

| 수행한 일 | 실제 확인 결과 |
|---|---|
| Compose 설정으로 빌드·실행 | 이미지 Built, 컨테이너 Healthy |
| PC의 8083으로 상태 확인 요청 | HTTP 200 OK와 ok |
| Compose 프로젝트 종료 | 컨테이너와 네트워크 Removed |

[사용자가 제공한 Compose 명령과 출력](docs/evidence/26-user-compose.md)

Docker Desktop을 켠 뒤 저장소 루트의 PowerShell에서 빌드·실행합니다.

```powershell
docker compose -p e1-1-replay up -d --build --wait
```

PC의 8083으로 상태 확인 요청을 보냅니다.

```powershell
curl.exe -i http://127.0.0.1:8083/healthz
```

같은 프로젝트의 컨테이너와 네트워크를 정리합니다.

```powershell
docker compose -p e1-1-replay down
```

이 캡처는 사용자가 CMD에서 기존 PowerShell 로그를 열어 본 화면입니다. 상태 확인 요청의 200 응답과 컨테이너 제거 결과를 확인할 수 있습니다.

**실행 → 접속 → 정리**를 확인했습니다. `up` 후 상태 점검을 통과하고 `8083`에서 정상 응답을 받았으며, `down` 후 컨테이너와 네트워크가 제거됐습니다. [사용자 실행 로그](docs/evidence/26-user-compose.md)
