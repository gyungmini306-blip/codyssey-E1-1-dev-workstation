# 05. Docker 엔진 및 hello-world 실습 성공

확인일: 2026-11-02 (Asia/Seoul).

## 사용자가 직접 실행한 결과

아래 명령과 출력은 사용자가 Windows PowerShell에서 실행해 채팅으로 제공한 실제 기록입니다. 개인 홈 경로는 생략했고, hello-world 설명문의 중간 부분은 발췌했습니다.

```powershell
PS> docker run --name e1-1-hello hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
4f55086f7dd0: Pull complete
d5e71e642bf5: Download complete
Digest: sha256:c567b231f65614688711a75f31518a064258a51d442117a3e771a3a8fdba78ef
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.
[이후 안내문 생략]

PS> docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES

PS> docker ps -a
CONTAINER ID   IMAGE         COMMAND    CREATED          STATUS                      PORTS     NAMES
30df56aa1c4b   hello-world   "/hello"   11 seconds ago   Exited (0) 10 seconds ago             e1-1-hello
```

## 추가 실제 점검

다음은 보조 도구로 직접 실행해 교차 확인한 결과입니다.

```powershell
PS> docker info --format 'ServerVersion={{.ServerVersion}} OSType={{.OSType}}'
ServerVersion=29.9.2 OSType=linux

PS> docker images --digests hello-world
REPOSITORY    TAG       DIGEST                                                                    IMAGE ID       CREATED        SIZE
hello-world   latest    sha256:c567b231f65614688711a75f31518a064258a51d442117a3e771a3a8fdba78ef   c567b231f656   7 months ago   25.9kB

PS> docker inspect e1-1-hello --format '{{.Id}} {{.Config.Image}} {{.State.Status}} exit={{.State.ExitCode}}'
30df56aa1c4ba9ddcb044cafdd8542b172a1b4b9a1ffefaf6277678ba2db12d4 hello-world exited exit=0
```

## 관찰 및 해석

- 최초 실행 시 로컬에 이미지가 없어 Docker Hub에서 다운로드했다.
- 이미지로 컨테이너를 생성하고 `/hello` 프로그램을 실행했다.
- 프로그램은 메시지 출력 후 종료했다. `Exited (0)`의 0은 정상 종료 코드다.
- `docker ps`는 실행 중인 컨테이너만 표시하므로 목록이 비어 있다.
- `docker ps -a`는 종료된 컨테이너도 표시하므로 `e1-1-hello`가 남아 있다.
- 컨테이너 종료는 컨테이너 삭제나 이미지 삭제와 다르다.
- 재시작 전 발생했던 엔진 연결 실패는 현재 Server 응답과 실제 컨테이너 실행 성공으로 해결을 확인했다.
