# 12. 사용자 직접 볼륨 영속성 실습

실습일: 2026-11-03 (Asia/Seoul). 사용자가 직접 실행해 제공한 실제 명령과 출력이다. 반복되는 Windows 개인 경로는 생략했다. 보조 도구는 받은 결과를 문서로 정리했다.

## 12-A. 볼륨 생성과 삭제 전 데이터 확인

```powershell
PS> docker volume create e1-1-user-data
e1-1-user-data

PS> $volumeMount = "type=volume,source=e1-1-user-data,target=/data"
PS> docker run -d --name e1-1-volume-before --mount $volumeMount ubuntu:24.04 sleep infinity
77d4a42449559c220892e446f3b117a622b57398cb5ae41cf716ccf6187ad886

PS> docker exec e1-1-volume-before sh -c 'echo E1-1-volume-proof > /data/memo.txt'
PS> docker exec e1-1-volume-before cat /data/memo.txt
E1-1-volume-proof
```

### 관찰

- 이름 있는 볼륨 e1-1-user-data를 만들고 컨테이너의 /data에 연결했다.
- sleep infinity는 주 프로세스를 유지해 이후 exec로 명령을 실행할 수 있게 한다.
- /data/memo.txt에 쓴 문장이 cat에서 동일하게 출력됐다. 이 값이 삭제 후 비교할 기준 데이터다.

## 12-B. 기존 컨테이너 삭제와 볼륨 잔존 확인

사용자가 이어서 실행한 실제 명령과 출력이다.

```powershell
PS> docker stop e1-1-volume-before
e1-1-volume-before
PS> docker rm e1-1-volume-before
e1-1-volume-before
PS> docker ps -a --filter name=e1-1-volume-before
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
PS> docker volume ls --filter name=e1-1-user-data
DRIVER    VOLUME NAME
local     e1-1-user-data
```

컨테이너 목록에는 헤더만 표시되어 기존 before 컨테이너가 제거됐음을 확인했다. 볼륨 목록에는 e1-1-user-data가 남아 있다.

## 12-C. 새 컨테이너에 같은 볼륨 연결 후 읽기

```powershell
PS> $volumeMount = "type=volume,source=e1-1-user-data,target=/data"
PS> docker run -d --name e1-1-volume-after --mount $volumeMount ubuntu:24.04 sleep infinity
91ff958c97f598400a36d7de5c44b38a9b530b320cb4e7e514ea185c151ad9b4
PS> docker exec e1-1-volume-after cat /data/memo.txt
E1-1-volume-proof
```

| 비교 | 컨테이너 | 내용 |
|---|---|---|
| 삭제 전 | e1-1-volume-before / 77d4a4244955… | E1-1-volume-proof |
| 삭제 후 새 연결 | e1-1-volume-after / 91ff958c97f5… | E1-1-volume-proof |

서로 다른 ID와 이름의 컨테이너에서 같은 파일 내용이 읽혔다. after 컨테이너에서는 파일을 새로 작성하지 않았고, 같은 이름의 볼륨을 다시 연결했다. 컨테이너 수명과 볼륨 데이터의 수명이 분리됨을 실제 결과로 확인했다.

## 현재 수행 상태

볼륨 생성·연결·메모 저장과 읽기, 첫 컨테이너 중지·삭제, 볼륨 잔존, 새 컨테이너 재연결·동일 메모 읽기를 모두 사용자 직접 출력으로 확인했다. 볼륨 영속성 검증을 완료했다. 볼륨 자체는 삭제하지 않고 남겨두었다.
