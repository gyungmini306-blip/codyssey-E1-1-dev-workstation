# 10. 사용자 직접 터미널·권한 실습

실습일: 2026-11-03 (Asia/Seoul). 사용자가 직접 실행해 채팅으로 제공한 실제 명령과 출력이다. Windows 사용자 홈 경로는 생략했다. 보조 도구는 이 기록을 문서로 정리했다.

## 10-A. 컨테이너 진입, 폴더·파일 생성, 내용 확인

```console
PS> docker exec -it e1-1-ubuntu bash
root@9e28c1505a09:/# mkdir -p /root/e1-1/guided-practice
root@9e28c1505a09:/# cd /root/e1-1/guided-practice
root@9e28c1505a09:~/e1-1/guided-practice# pwd
/root/e1-1/guided-practice
root@9e28c1505a09:~/e1-1/guided-practice# touch empty.txt .hidden-note
root@9e28c1505a09:~/e1-1/guided-practice# echo "E1-1 terminal practice" > memo.txt
root@9e28c1505a09:~/e1-1/guided-practice# ls -la
total 12
drwxr-xr-x 2 root root 4096 Nov  3 00:05 .
drwxr-xr-x 3 root root 4096 Nov  3 00:05 ..
-rw-r--r-- 1 root root    0 Nov  3 00:05 .hidden-note
-rw-r--r-- 1 root root    0 Nov  3 00:05 empty.txt
-rw-r--r-- 1 root root   23 Nov  3 00:05 memo.txt
root@9e28c1505a09:~/e1-1/guided-practice# cat memo.txt
E1-1 terminal practice
```

## 관찰 및 해석

- pwd가 /root/e1-1/guided-practice를 출력해 이동한 위치를 확인했다.
- .hidden-note와 empty.txt는 크기 0인 빈 파일이다. -a 옵션으로 숨김 파일도 목록에 나타났다.
- memo.txt의 크기는 23바이트이고, cat으로 저장한 문장이 읽혔다. echo가 덧붙인 줄바꿈도 파일 내용에 포함된다.
- 프롬프트의 물결표(~)는 현재 사용자인 root의 홈 경로 /root를 줄여 표시한 것이다.

## 현재 수행 상태

- 완료: Ubuntu 컨테이너에 exec로 진입, 실습 폴더 생성·이동, 현재 위치 확인, 빈 파일·숨김 파일 생성, 내용 저장, 숨김 항목 포함 상세 목록, 파일 내용 읽기.
- 아직 이 기록에 없는 항목: 복사·이동/이름 변경·삭제, 위치 이동 후 절대 경로 읽기, 파일·디렉토리 권한 변경 전후 비교, 추가 exec 셸 종료 후 컨테이너 상태 확인.

위 항목은 실제 결과를 받는 순서대로 추가한다. 이 첫 블록만으로 터미널 전체 조작이나 권한 실습을 완료 표시하지 않는다.
