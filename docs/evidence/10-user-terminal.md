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

## 10-B. 복사, 이동·이름 변경, 삭제

같은 Ubuntu 컨테이너에서 사용자가 이어서 실행했다. 아래에서는 반복되는 프롬프트를 `$`로 줄였으며, 명령과 출력은 사용자가 제공한 기록이다. 시작 위치는 /root/e1-1/guided-practice다.

```console
$ cp memo.txt memo-copy.txt
$ ls -la
total 16
drwxr-xr-x 2 root root 4096 Nov  3 00:08 .
drwxr-xr-x 3 root root 4096 Nov  3 00:05 ..
-rw-r--r-- 1 root root    0 Nov  3 00:05 .hidden-note
-rw-r--r-- 1 root root    0 Nov  3 00:05 empty.txt
-rw-r--r-- 1 root root   23 Nov  3 00:08 memo-copy.txt
-rw-r--r-- 1 root root   23 Nov  3 00:05 memo.txt
$ mkdir -p archive
$ ls- la
bash: ls-: command not found
$ ls -la
total 20
drwxr-xr-x 3 root root 4096 Nov  3 00:08 .
drwxr-xr-x 3 root root 4096 Nov  3 00:05 ..
-rw-r--r-- 1 root root    0 Nov  3 00:05 .hidden-note
drwxr-xr-x 2 root root 4096 Nov  3 00:08 archive
-rw-r--r-- 1 root root    0 Nov  3 00:05 empty.txt
-rw-r--r-- 1 root root   23 Nov  3 00:08 memo-copy.txt
-rw-r--r-- 1 root root   23 Nov  3 00:05 memo.txt
$ mv memo-copy.txt archive/memo-renamed.txt
$ ls -la
total 16
drwxr-xr-x 3 root root 4096 Nov  3 00:09 .
drwxr-xr-x 3 root root 4096 Nov  3 00:05 ..
-rw-r--r-- 1 root root    0 Nov  3 00:05 .hidden-note
drwxr-xr-x 2 root root 4096 Nov  3 00:09 archive
-rw-r--r-- 1 root root    0 Nov  3 00:05 empty.txt
-rw-r--r-- 1 root root   23 Nov  3 00:05 memo.txt
$ cd archive
$ ls -la
total 12
drwxr-xr-x 2 root root 4096 Nov  3 00:09 .
drwxr-xr-x 3 root root 4096 Nov  3 00:09 ..
-rw-r--r-- 1 root root   23 Nov  3 00:08 memo-renamed.txt
$ cd ..
$ ls -la archive
total 12
drwxr-xr-x 2 root root 4096 Nov  3 00:09 .
drwxr-xr-x 3 root root 4096 Nov  3 00:09 ..
-rw-r--r-- 1 root root   23 Nov  3 00:08 memo-renamed.txt
$ rm archive/memo-renamed.txt
$ ls -la archive
total 8
drwxr-xr-x 2 root root 4096 Nov  3 00:09 .
drwxr-xr-x 3 root root 4096 Nov  3 00:09 ..
$ rmdir archive
$ ls -la
total 12
drwxr-xr-x 2 root root 4096 Nov  3 00:09 .
drwxr-xr-x 3 root root 4096 Nov  3 00:05 ..
-rw-r--r-- 1 root root    0 Nov  3 00:05 .hidden-note
-rw-r--r-- 1 root root    0 Nov  3 00:05 empty.txt
-rw-r--r-- 1 root root   23 Nov  3 00:05 memo.txt
```

### 관찰

- cp 후 원본과 복사본이 각각 23바이트로 존재했다.
- mv로 복사본을 archive 안으로 옮기고 memo-renamed.txt로 이름을 변경했다. 부모 폴더에서 복사본이 사라지고 archive 안에서 바뀐 이름을 확인했다.
- cd archive와 cd ..로 하위 폴더와 부모 폴더를 상대 경로로 이동했다.
- rm 후 archive 안에는 실제 파일이 남지 않았고, rmdir로 빈 폴더를 삭제했다.
- 마지막 목록에는 원본 memo.txt와 두 빈 파일만 남았다.
- 잘못 입력한 ls- la와 이를 ls -la로 수정한 실제 오류·해결도 보존했다. [문제 해결 기록](../troubleshooting.md#4-ls--la-입력-오류)

## 10-C. 파일과 디렉토리 권한 변경 전후

사용자가 같은 Ubuntu 실습 폴더에서 직접 실행했다. 프롬프트는 `$`로 축약했다.

```console
$ mkdir -p permissions-dir
$ chmod 600 memo.txt
$ chmod 700 permissions-dir
$ ls -l memo.txt
-rw------- 1 root root 23 Nov  3 00:05 memo.txt
$ ls -ld permissions-dir
drwx------ 2 root root 4096 Nov  3 00:12 permissions-dir
$ chmod 644 memo.txt
$ chmod 755 permissions-dir
$ ls -l memo.txt
-rw-r--r-- 1 root root 23 Nov  3 00:05 memo.txt
$ ls -ld permissions-dir
drwxr-xr-x 2 root root 4096 Nov  3 00:12 permissions-dir
```

### 전후 비교

| 대상 | 변경 전 | 변경 후 | 실제 변화 |
|---|---|---|---|
| memo.txt | 600 / rw------- | 644 / rw-r--r-- | 그룹·기타 사용자에게 읽기 추가 |
| permissions-dir | 700 / rwx------ | 755 / rwxr-xr-x | 그룹·기타 사용자에게 읽기·진입 추가 |

파일과 디렉토리 각각에 대해 변경 전후가 실제 출력으로 확인됐다. 현재 root 계정이므로 이 결과는 권한 비트 변경의 증거이며 일반 사용자 접근 거부를 검증한 것은 아니다.

출력 맨 앞의 `-`는 일반 파일, `d`는 디렉토리를 나타낸다. 그 뒤 아홉 글자가 권한이다. `ls -l 디렉토리`는 디렉토리 안의 항목을 상세 조회하고, `ls -ld 디렉토리`는 해당 디렉토리 자체를 상세 조회한다. -d 옵션이 종류 표시 d를 만들어 내는 것은 아니다.

## 10-D. Windows에서 기존 Ubuntu 컨테이너 실행 상태 확인

사용자가 Windows PowerShell에서 직접 확인한 결과다.

```powershell
PS> docker inspect e1-1-ubuntu --format '{{.State.Running}}'
true
```

Windows로 돌아온 뒤에도 원래 Ubuntu 컨테이너가 실행 중임을 확인했다. 사용자 메시지에 exit 입력 행 자체는 포함되지 않았으므로 그 행을 실행 로그에 추가하지 않았다. 주 프로세스에 attach한 뒤 종료하는 경우와의 전체 비교는 후속 실습으로 남겨 둔다.

## 현재 수행 상태

- 완료: 컨테이너 exec 진입, 현재 위치·숨김 목록 확인, 폴더·파일 생성, 파일 내용 저장·읽기, 폴더 이동, 복사, 이동·이름 변경, 파일·빈 폴더 삭제, 파일 600→644와 디렉토리 700→755 권한 전후 비교.
- 아직 이 기록에 없는 항목: 위치 이동 후 절대 경로로 같은 파일 읽기 추가 실험, attach/detach 및 주 프로세스 종료와의 비교.

터미널 기본 조작과 파일·디렉토리 권한 변경의 필수 항목은 실제 출력으로 확인했다. 컨테이너 종료 방식의 전체 비교는 후속 실습에서 별도로 확인한다.
