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

## 현재 수행 상태

이름 있는 볼륨 생성, 첫 컨테이너 연결, 메모 저장·읽기까지 확인했다. 아직 컨테이너 삭제와 새 컨테이너 재연결 결과를 받지 않았으므로 영속성 검증 전체를 완료 표시하지 않는다.
