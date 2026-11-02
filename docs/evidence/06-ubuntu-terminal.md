# 06. Ubuntu 컨테이너 진입 및 경로 확인

실습일: 2026-11-02 (Asia/Seoul). 사용자가 Windows PowerShell 및 Ubuntu 컨테이너에서 직접 실행해 제공한 기록이다. 개인 홈 경로를 생략했다.

## 명령과 실제 출력

```console
PS> docker run -it --name e1-1-ubuntu ubuntu:24.04 bash
Unable to find image 'ubuntu:24.04' locally
24.04: Pulling from library/ubuntu
7a48b8f0e5c7: Pull complete
98144013299c: Download complete
Digest: sha256:fe81560990fae86dc4743202b2cb4d3df98d0bcf949173cecef15ce1127ef852
Status: Downloaded newer image for ubuntu:24.04

root@9e28c1505a09:/# pwd
/

root@9e28c1505a09:/# ls -la
total 56
drwxr-xr-x   1 root root 4096 Nov  2 03:48 .
drwxr-xr-x   1 root root 4096 Nov  2 03:48 ..
-rwxr-xr-x   1 root root    0 Nov  2 03:48 .dockerenv
lrwxrwxrwx   1 root root    7 Apr 22  2024 bin -> usr/bin
drwxr-xr-x   2 root root 4096 Apr 22  2024 boot
drwxr-xr-x   5 root root  360 Nov  2 03:48 dev
drwxr-xr-x   1 root root 4096 Nov  2 03:48 etc
drwxr-xr-x   3 root root 4096 Oct 24 14:12 home
lrwxrwxrwx   1 root root    7 Apr 22  2024 lib -> usr/lib
lrwxrwxrwx   1 root root    9 Apr 22  2024 lib64 -> usr/lib64
drwxr-xr-x   2 root root 4096 Oct 24 14:05 media
drwxr-xr-x   2 root root 4096 Oct 24 14:05 mnt
drwxr-xr-x   2 root root 4096 Oct 24 14:05 opt
dr-xr-xr-x 223 root root    0 Nov  2 03:48 proc
drwx------   2 root root 4096 Oct 24 14:12 root
drwxr-xr-x   4 root root 4096 Oct 24 14:12 run
lrwxrwxrwx   1 root root    8 Apr 22  2024 sbin -> usr/sbin
drwxr-xr-x   2 root root 4096 Oct 24 14:05 srv
dr-xr-xr-x  13 root root    0 Nov  2 03:48 sys
drwxrwxrwt   2 root root 4096 Oct 24 14:12 tmp
drwxr-xr-x  12 root root 4096 Oct 24 14:05 usr
drwxr-xr-x  11 root root 4096 Oct 24 14:12 var

root@9e28c1505a09:/# cat etc/os-release
PRETTY_NAME="Ubuntu 24.04.5 LTS"
NAME="Ubuntu"
VERSION_ID="24.04"
VERSION="24.04.5 LTS (Noble Numbat)"
VERSION_CODENAME=noble
ID=ubuntu
ID_LIKE=debian
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
UBUNTU_CODENAME=noble
LOGO=ubuntu-logo

root@9e28c1505a09:/# ^C
root@9e28c1505a09:/#
```

## 관찰 및 해석

- `-it`로 Bash에 터미널을 연결해 대화형 입력을 했다.
- 프롬프트의 `root`는 현재 사용자이고, `:/`는 현재 디렉토리가 `/`임을 나타낸다. `/`는 파일시스템 최상위이며 `/root` 디렉토리와는 다르다.
- `cat etc/os-release`는 현재 디렉토리를 기준으로 한 상대 경로다. 현재 위치가 `/`여서 절대 경로 `/etc/os-release`와 같은 파일을 읽었다. 다른 디렉토리에서는 같은 상대 경로가 다른 위치를 가리킨다.
- `ls -la`의 `-a` 덕분에 `.dockerenv` 같은 숨김 항목이 표시된다. `-l`은 권한, 소유자, 크기 등의 상세 정보를 표시한다.
- `Ctrl+C` 뒤에도 Bash 프롬프트가 남아 있다. 이 기록만으로 컨테이너가 종료되었다고 판단하지 않는다.
- 현재는 Ubuntu 컨테이너에 들어가 명령을 실행한 단계다. `attach`/`exec` 및 셸 종료에 따른 컨테이너 상태 비교는 다음 실습에서 검증한다.
