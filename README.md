# E1-1 · 개발 작업실

다른 사람도 같은 방법으로 웹 서버를 실행할 수 있도록 Docker로 환경을 만들고, 접속·파일 수정·데이터 보존을 직접 확인했습니다.

![브라우저 접속 결과. 기존 서버 8080은 V1, PC 파일을 연결한 서버 8081은 V2](docs/evidence/15-browser-addresses.png)

## 빠른 실행

Windows에서 Docker Desktop을 켜고 CMD에서 실행합니다. 실습 환경은 Docker 29.9.2, Compose 5.6.1, Git 2.52.0입니다.

```cmd
git clone https://github.com/gyungmini306-blip/codyssey-E1-1-dev-workstation.git
cd codyssey-E1-1-dev-workstation
docker compose -p e1-1-bonus up -d --build --wait
curl.exe -i http://127.0.0.1:8083/healthz
```

브라우저에서 `http://localhost:8083/`을 엽니다. 확인을 마치면 `docker compose -p e1-1-bonus down`으로 종료합니다.

## 무엇을 했고 왜 했나

| 실습 | 한 일과 이유 | 확인한 결과 |
|---|---|---|
| 터미널과 권한 | Ubuntu 컨테이너에서 파일 생성·복사·이동·삭제를 연습하고, `chmod`로 접근 권한을 바꿨습니다. | 파일은 `600 → 644`, 폴더는 `700 → 755`로 바뀌었습니다. |
| Docker 점검 | Docker가 실제로 컨테이너를 실행하는지 확인하려고 `hello-world`를 실행하고 상태·로그를 조회했습니다. | `Hello from Docker!`가 출력됐고 종료 코드는 `0`이었습니다. |
| 이미지와 웹 접속 | 누구나 같은 서버를 띄울 수 있도록 Dockerfile에 NGINX와 HTML을 담는 방법을 적었습니다. 내 PC에서 접속하려고 `8080:80`으로 포트를 연결했습니다. | 브라우저에서 `localhost:8080`으로 페이지가 열렸습니다. |
| HTML 수정 반영 | PC 파일을 수정했을 때 바로 반영되는지 보려고, 같은 이미지로 실행한 두 서버의 파일 읽는 방식만 바꿨습니다. | PC 폴더를 연결한 **8081은 V2**, 이미지에 복사한 파일을 쓰는 **8082는 V1**을 반환했습니다. |
| 볼륨 | 서버를 교체해도 메모를 읽을 수 있도록 Docker가 따로 관리하는 저장 공간에 메모를 넣었습니다. | 기존 컨테이너를 삭제하고 같은 볼륨을 새 컨테이너에 연결하니 `E1-1-volume-proof`가 남아 있었습니다. |
| Git과 GitHub | Git으로 HTML 변경을 기록하고, 다른 사람이 확인할 수 있도록 GitHub에 공유했습니다. | 커밋 `d580e49`를 푸시했고 VS Code에서 GitHub 계정 연결을 확인했습니다. |
| 보너스 Compose | 빌드와 포트 옵션을 매번 입력하지 않도록 `compose.yaml`에 기록했습니다. | 웹 서버 하나를 실행해 `8083/healthz`의 HTTP 200을 확인했고, `down` 뒤 프로젝트 컨테이너 목록이 비었습니다. |

## 실제 CMD 결과

![Docker 실행 상태, 8081의 V2와 8082의 V1, 볼륨에 남은 메모](docs/evidence/17-cmd-docker.png)

파일·폴더 권한은 `ls -l`, `ls -ld`로 확인했습니다. 아래는 권한 변경 후 실제 출력입니다.

```console
$ ls -l memo.txt
-rw-r--r-- 1 root root 23 Nov  3 00:05 memo.txt
$ ls -ld permissions-dir
drwxr-xr-x 2 root root 4096 Nov  3 00:12 permissions-dir
```

## 문제 해결

- `ls- la`를 입력했을 때 셸이 `ls-`를 명령으로 읽었습니다. `ls -la`로 고쳐 숨김 파일을 포함한 목록을 확인했습니다.
- `--mount`에 인수가 빠져 컨테이너 실행이 실패했습니다. 마운트 설정과 이미지 이름을 한 줄에 적어 다시 실행했고, `docker ps`와 HTTP 응답으로 확인했습니다.
