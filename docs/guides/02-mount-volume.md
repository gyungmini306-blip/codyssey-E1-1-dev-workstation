# 2. 파일 수정 반영과 데이터 보존

이 문서는 사용자 직접 실습용 가이드이며, 아래 예상 결과는 아직 실행한 로그가 아니다. 첫 실행을 기준으로 작성했다. 이름 충돌·포트 충돌·예상과 다른 내용이 나오면 자동 삭제로 해결하지 말고 결과를 채팅에 보낸다.

**목표 A:** 같은 호스트 HTML 변경이 COPY 컨테이너에는 자동 반영되지 않고, 바인드 마운트 컨테이너에는 반영됨을 확인한다.

**목표 B:** 볼륨에 저장한 글이 컨테이너 삭제 후에도 남는지 새 컨테이너에서 확인한다.

## 2-A. Windows PowerShell에서 저장소로 이동

이 문서의 Docker 명령은 모두 **Windows PowerShell**에서 실행한다. Ubuntu의 `root@...#` 화면이라면 먼저 exit로 Windows로 돌아온다.

현재 PC에 준비한 실제 작업 경로:

```powershell
Set-Location -LiteralPath 'C:\Users\gyung\Documents\Codex\2026-11-02\files-pasted-by-the-user-1\outputs\dev-workstation-lab_Codyssey11'
Get-Location
Get-Content .\Dockerfile
Select-String -LiteralPath .\app\index.html -Pattern 'SIMPLE_PAGE'
```

다른 PC에서 따라 한다면 README대로 저장소를 clone한 폴더로 이동한다. 생성한 원격 저장소 이름과 이 PC의 기존 작업 폴더 이름이 다른 것은 정상이다.

가이드 작성 시 소스에는 `SIMPLE_PAGE_V1`과 `페이지 버전: 1`이 있다. 이미 다른 버전이라면 수정 단계 전에 현재 내용을 알려준다.

## 2-B. 직접 이미지 빌드

```powershell
docker build --progress=plain -t codyssey-workstation:student-1 .
docker images codyssey-workstation
```

Dockerfile은 NGINX를 바탕으로 app 폴더와 nginx.conf를 이미지에 넣는다. 마지막 점은 현재 폴더를 빌드 재료의 기준으로 사용한다는 뜻이다.

**성공 기준:** 빌드가 오류 없이 끝나고 이미지 목록에 student-1 태그가 나타난다. 빌드 명령과 핵심 성공 출력을 남긴다.

## 2-C. 비교할 웹 서버 두 개 실행

기존 8080 서버는 유지한다. 새 실습 서버 이름과 포트를 사용한다. 가이드 작성 당시 8081·8082는 비어 있었지만, 이후 다른 프로그램이 사용할 수도 있다.

**COPY 방식: 8082**

```powershell
docker run -d --name e1-1-copy-guide -p 127.0.0.1:8082:80 codyssey-workstation:student-1
```

**바인드 마운트 방식: 8081**

```powershell
$appPath = (Resolve-Path .\app).Path
docker run -d --name e1-1-bind-guide -p 127.0.0.1:8081:80 --mount "type=bind,source=$appPath,target=/usr/share/nginx/html,readonly" codyssey-workstation:student-1
docker ps --filter name=guide
```

source는 이 PC의 app 폴더 절대 경로이고, target은 컨테이너 안에서 그 폴더를 읽을 위치다. readonly는 컨테이너 쪽에서 호스트 파일을 수정하지 못하도록 한다. PC에서 원본을 편집하는 것은 가능하다.

## 2-D. 수정 전 결과 확인

```powershell
curl.exe -s --max-time 10 http://localhost:8081/ | Select-String 'SIMPLE_PAGE'
curl.exe -s --max-time 10 http://localhost:8082/ | Select-String 'SIMPLE_PAGE'
```

두 응답 모두 `SIMPLE_PAGE_V1`이어야 한다. 실제 출력 전체를 남긴다. 브라우저에서 아래 주소도 각각 열어 본다.

- 바인드: `http://localhost:8081`
- COPY: `http://localhost:8082`

주소창의 포트와 페이지 버전이 함께 보이도록 **수정 전 캡처**를 저장한다. 예: `docs/evidence/11-bind-before.png`.

## 2-E. PC의 HTML을 버전 2로 수정

Windows PowerShell에서 편집할 파일을 연다.

```powershell
code .\app\index.html
```

VS Code에서 아래 줄을 찾는다.

```html
<p class="version" id="mount-marker" data-version="SIMPLE_PAGE_V1">페이지 버전: 1</p>
```

해당 줄만 다음처럼 바꾸고 **Ctrl+S로 저장**한다.

```html
<p class="version" id="mount-marker" data-version="SIMPLE_PAGE_V2">페이지 버전: 2</p>
```

Windows PowerShell에서 호스트 파일이 저장됐는지 확인한다.

```powershell
Select-String -LiteralPath .\app\index.html -Pattern 'SIMPLE_PAGE'
```

## 2-F. 재빌드 없이 수정 후 결과 비교

이 비교가 끝날 때까지 student-1 이미지를 다시 빌드하거나 실습 컨테이너를 재생성하지 않는다. 같은 조건에서 호스트 파일 변경만 비교한다.

```powershell
curl.exe -s --max-time 10 http://localhost:8081/ | Select-String 'SIMPLE_PAGE'
curl.exe -s --max-time 10 http://localhost:8082/ | Select-String 'SIMPLE_PAGE'
```

예상 결과:

| 주소 | 예상 내용 | 이유 |
|---|---|---|
| 8081 · bind | SIMPLE_PAGE_V2 / 페이지 버전 2 | 호스트의 현재 파일을 연결해 읽음 |
| 8082 · COPY | SIMPLE_PAGE_V1 / 페이지 버전 1 | 빌드할 때 이미지에 복사한 내용을 읽음 |

브라우저에서도 두 주소를 **Ctrl+F5로 새로고침**한다. 바인드의 수정 후 화면을 `docs/evidence/11-bind-after.png`, COPY 비교 화면을 `docs/evidence/11-copy-after.png`처럼 저장한다. 주소창을 포함한다.

**남길 증거:** 빌드·실행·마운트 명령, 호스트 수정한 줄, 수정 전후 curl 출력, 주소창 포함 캡처. 8080의 기존 서버는 별도 COPY 이미지이므로 계속 버전 1을 보일 수 있다.

## 2-G. 볼륨을 만들고 메모 저장

계속 같은 Windows PowerShell에서 실행한다.

```powershell
docker volume create e1-1-user-data
docker run -d --name e1-1-volume-before --mount type=volume,source=e1-1-user-data,target=/data ubuntu:24.04 sleep infinity
docker exec e1-1-volume-before sh -c 'echo E1-1-volume-proof > /data/memo.txt'
docker exec e1-1-volume-before cat /data/memo.txt
```

마지막 출력은 `E1-1-volume-proof`가 예상된다. 메모는 컨테이너 안 /data 경로로 쓰지만, 그 위치에는 이름 있는 볼륨이 연결되어 있다. 명령과 실제 출력을 남긴다.

## 2-H. 메모를 쓴 컨테이너 중지·삭제

다음은 이 가이드에서 만든 `e1-1-volume-before`만 대상으로 한다. 볼륨 삭제 명령은 실행하지 않는다.

```powershell
docker stop e1-1-volume-before
docker rm e1-1-volume-before
docker ps -a --filter name=e1-1-volume-before
docker volume ls --filter name=e1-1-user-data
```

예상: 컨테이너 목록에는 before가 사라지고, 볼륨 목록에는 e1-1-user-data가 남는다.

## 2-I. 새 컨테이너에 같은 볼륨을 연결

```powershell
docker run -d --name e1-1-volume-after --mount type=volume,source=e1-1-user-data,target=/data ubuntu:24.04 sleep infinity
docker exec e1-1-volume-after cat /data/memo.txt
docker inspect e1-1-volume-after --format '{{range .Mounts}}{{.Type}} {{.Name}} -> {{.Destination}}{{end}}'
```

예상:

```text
E1-1-volume-proof
volume e1-1-user-data -> /data
```

**성공 기준:** 다른 이름의 새 컨테이너에서도 같은 파일 내용이 읽힌다. 처음과 두 번째 cat 결과를 비교한다. 새 빈 볼륨을 만들면 이 실험의 조건이 달라진다.

**남길 증거:** 볼륨 생성, 첫 연결·작성·읽기, 컨테이너 삭제, 볼륨 잔존, 새 컨테이너 연결·읽기의 실제 명령과 출력. 결과를 채팅에 보내면 README에 실제 증거를 정리한다.

## 실습 리소스는 어떻게 할까?

비교·증거 수집 중에는 이번에 만든 서버와 볼륨을 유지한다. 정리할 때도 이름을 확인하고 이 가이드의 컨테이너만 중지·제거한다. `prune` 같은 전체 정리 명령은 필요 없다. 저장한 볼륨은 검증 자료이므로 당장 삭제하지 않는다.

참고: [Docker 바인드 마운트](https://docs.docker.com/engine/storage/bind-mounts/), [Docker 볼륨](https://docs.docker.com/engine/storage/volumes/).

다음: [3. Docker 운영·GitHub·README 제출](03-record-submit.md)
