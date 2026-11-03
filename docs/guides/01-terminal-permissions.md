# 1. 파일·폴더·권한 실습

이 문서는 앞으로 사용자가 직접 실행할 가이드다. 아래의 예상 결과는 실제 실행 증거가 아니며, 실행 후 출력이나 캡처를 따로 남겨야 한다. 이 가이드의 각 블록을 실행한 뒤 결과를 채팅에 보내면 실제 로그와 README 정리를 함께 진행한다.

**목표:** 명령으로 파일과 폴더를 만들고, 복사·이동·삭제하며, 파일 1개와 디렉토리 1개의 권한이 바뀐 것을 확인한다.

## 먼저 창을 구분하기

| 입력 줄 | 현재 환경 | 입력할 명령 |
|---|---|---|
| `PS C:\...>` | 내 PC의 Windows PowerShell | `docker`, `git`, 저장소 이동 |
| `root@...:/#` | Ubuntu 컨테이너 안의 Bash | `pwd`, `ls`, `mkdir`, `chmod` 등 |

코드블록 안의 명령만 입력한다. `PS>`나 `root@...#` 같은 표시를 직접 입력하지 않는다. 오류가 발생하면 다음 블록으로 진행하지 말고 오류를 채팅에 보낸다.

## 1-A. 새 Windows PowerShell에서 Ubuntu에 들어가기

```powershell
docker ps --filter name=e1-1-ubuntu
docker exec -it e1-1-ubuntu bash
```

`e1-1-ubuntu`는 앞서 만든 Ubuntu 컨테이너다. 2026-11-03 가이드 작성 시 실행 중인 것을 확인했다. 첫 명령에서 나타나지 않으면 `docker ps -a --filter name=e1-1-ubuntu`로 확인한다. 존재하고 Exited 상태라면 아래 명령으로 시작한 후 exec를 실행한다.

```powershell
docker start e1-1-ubuntu
docker exec -it e1-1-ubuntu bash
```

컨테이너가 아예 없다면 임의로 다른 컨테이너에 들어가지 말고 그 결과를 보낸다. Docker 엔진 연결 오류가 나면 Docker Desktop이 실행 중인지 확인한다.

**성공 기준:** 입력 줄이 `root@...:/#` 같은 형태로 바뀐다. exec는 실행 중인 컨테이너에 새 Bash를 추가로 여는 명령이다.

## 1-B. 현재 위치 확인, 폴더·파일 생성

이제부터 이 절의 명령은 **Ubuntu 안에서** 입력한다.

```bash
pwd
ls -la
mkdir -p /root/e1-1/guided-practice
cd /root/e1-1/guided-practice
pwd
touch empty.txt .hidden-note
echo "E1-1 terminal practice" > memo.txt
ls -la
cat memo.txt
```

| 명령 | 의미 | 관찰할 것 |
|---|---|---|
| `pwd` | 현재 위치 | 이동 후 `/root/e1-1/guided-practice` |
| `ls -la` | 상세 목록과 숨김 항목 | `.hidden-note`, `empty.txt`, `memo.txt` |
| `mkdir -p` | 폴더 생성, 필요한 중간 폴더도 생성 | 실습 폴더 생성 |
| `cd` | 폴더 이동 | 프롬프트와 pwd 결과 변화 |
| `touch` | 없는 파일을 빈 파일로 생성 | empty.txt 크기 0 |
| `echo ... >` | 내용을 파일에 저장 | memo.txt 생성. 같은 이름이면 덮어쓰기 |
| `cat` | 파일 내용 읽기 | `E1-1 terminal practice` |

**남길 증거:** 명령과 목록·현재 경로·파일 내용의 실제 출력. 이 블록 결과부터 채팅에 보내도 된다.

## 1-C. 복사, 이동·이름 변경, 삭제

같은 Ubuntu 창에서 입력한다. 여기서는 방금 만든 복사본만 삭제한다.

```bash
cp memo.txt memo-copy.txt
mkdir -p archive
mv memo-copy.txt archive/memo-renamed.txt
ls -la archive
rm archive/memo-renamed.txt
rmdir archive
ls -la
```

- `cp`: 복사한다. 원본 memo.txt는 남는다.
- `mv`: 복사본을 archive 폴더로 옮기면서 이름도 바꾼다.
- 첫 목록에는 archive 안의 memo-renamed.txt가 보여야 한다.
- `rm`: 지정한 파일 하나를 삭제한다.
- `rmdir`: 비어 있는 archive 폴더를 삭제한다.
- 마지막에는 원본 memo.txt, empty.txt, .hidden-note가 남아야 한다.

**남길 증거:** 이동 후 archive 목록과 삭제 후 현재 폴더 목록. 임의의 다른 폴더나 파일을 삭제하지 않는다.

## 1-D. 절대 경로와 상대 경로 확인

```bash
cat memo.txt
cd ..
pwd
cat /root/e1-1/guided-practice/memo.txt
cd /root/e1-1/guided-practice
pwd
```

처음의 memo.txt는 현재 폴더를 기준으로 찾는 상대 경로다. 이동한 뒤에는 `/`로 시작하는 절대 경로로 같은 파일을 읽는다. 두 cat 결과가 같은지 확인한다.

## 1-E. 파일과 디렉토리 권한 전후 비교

처음 상태를 일부러 600/700으로 맞춘 다음, 644/755로 변경한다. 기본값이 이미 644/755인 상태에서 같은 값을 반복 적용하는 것보다 전후 차이가 분명하다.

**먼저 변경 전 상태 만들기:**

```bash
mkdir -p permissions-dir
chmod 600 memo.txt
chmod 700 permissions-dir
ls -l memo.txt
ls -ld permissions-dir
```

예상하는 권한 부분:

```text
memo.txt         -rw-------  (600)
permissions-dir  drwx------  (700)
```

**그다음 권한 변경하기:**

```bash
chmod 644 memo.txt
chmod 755 permissions-dir
ls -l memo.txt
ls -ld permissions-dir
```

예상하는 권한 부분:

```text
memo.txt         -rw-r--r--  (644)
permissions-dir  drwxr-xr-x  (755)
```

이 표는 전체 ls 출력이 아니다. 실제 출력에는 소유자·크기·시간도 함께 나온다. 파일의 `-`와 폴더의 `d`는 종류 표시이며, 그 뒤 아홉 글자가 소유자·그룹·기타 사용자의 권한이다.

**성공 기준:** 파일과 디렉토리 각각의 실제 전후 권한이 다르다. 두 시점의 출력을 모두 남긴다.

현재 사용자 root는 관리자이므로 많은 권한 검사를 우회할 수 있다. 이번 실습은 권한 비트의 변경을 확인하는 실습이며, 일반 사용자의 접근 거부를 증명하는 실험은 아니다.

## 1-F. Windows로 돌아오기

```bash
exit
```

새로 연 exec의 Bash가 종료되고 `PS C:\...>`로 돌아온다. 그다음 Windows에서 확인한다.

```powershell
docker inspect e1-1-ubuntu --format '{{.State.Running}}'
```

예상 결과는 `true`다. 추가로 연 Bash만 종료했으며 원래 컨테이너의 주 프로세스는 계속 실행 중이기 때문이다.

## 이 절을 마치면

1-B부터 1-F까지의 실제 명령·출력을 채팅에 보내거나, 명령과 출력이 함께 보이도록 캡처해 둔다. 개인정보나 비밀번호는 보내지 않는다. 실제 결과 확인 후 README의 터미널·권한 항목을 갱신한다. 가이드를 읽은 것만으로 체크하지 않는다.

다음: [2. 파일 수정 반영과 데이터 보존](02-mount-volume.md)
