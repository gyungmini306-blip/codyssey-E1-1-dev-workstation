# 트러블슈팅

## 1. WSL 패키지 설치가 관리자 권한 오류로 실패

- **문제:** `winget install --id Microsoft.WSL --exact ...`가 `0x80073d28`로 실패했다.
- **원인 가설:** 명령 실행 권한과 Windows 관리자 권한은 별개이므로, 현재 프로세스가 관리자 권한을 받지 못했을 수 있다.
- **확인:** `WindowsPrincipal.IsInRole(Administrator)` 결과가 `False`였고 설치 오류에도 `administrator privileges are required`가 표시되었다.
- **해결:** `Start-Process -Verb RunAs`로 관리자 PowerShell을 실행해 동일한 공식 패키지 설치 명령을 재실행했다.
- **결과:** `설치 성공`, `Get-AppxPackage`에서 WSL `2.7.14.0`을 확인했다. 이어서 켠 `VirtualMachinePlatform`은 재시작을 요구하므로 Ubuntu 실행은 별도로 검증해야 한다.
- **증거:** [설치 로그](evidence/02-installation.md).

## 2. Docker 명령을 찾지 못함

- **문제:** 최초 `docker --version`이 `The term 'docker' is not recognized`로 실패했다.
- **원인 가설:** Docker Desktop이 설치되지 않았거나 실행 파일 경로가 현재 PATH에 없을 수 있다.
- **확인:** `Get-Command docker`에서 실행 파일을 찾지 못했고, `Test-Path 'C:\Program Files\Docker\Docker\Docker Desktop.exe'`도 `False`였다.
- **해결:** 공식 `Docker.DockerDesktop` 패키지를 winget으로 설치했다. 설치 전부터 열려 있던 셸에서는 설치 경로의 `docker.exe`를 직접 실행했다. 일반 사용 시에는 새 터미널을 연다.
- **결과:** `Docker version 29.9.2, build a82e528`로 CLI 실행을 확인했다. 이것만으로 엔진이 정상이라는 의미는 아니다.
- **증거:** [최초 환경](evidence/01-environment.md), [설치 로그](evidence/02-installation.md).

## 3. Docker CLI는 실행되지만 엔진 연결 실패 (해결)

- **문제:** `docker info`의 Server 부분이 `docker_engine` 파이프를 찾지 못했다.
- **원인 가설:** Docker Desktop 엔진이 실행되지 않았고, WSL의 필수 가상화 기능도 재시작 전이다.
- **확인:** CLI 버전은 출력되지만 Server 연결은 실패했다. Windows의 `RebootPending`도 `True`다.
- **해결 계획:** Windows 재시작 후 Docker Desktop을 시작하고, WSL 2 및 Ubuntu 통합 상태를 확인한다.
- **결과:** 사용자의 Windows 재시작 이후 `docker info`에서 ServerVersion `29.9.2`, OSType `linux`를 확인했다. 사용자가 직접 실행한 hello-world도 `Exited (0)`로 정상 종료했다. [검증 결과](evidence/05-hello-world.md).

## 4. ls- la 입력 오류

- **문제:** 사용자 직접 실습에서 `ls- la` 입력 후 `bash: ls-: command not found`가 발생했다.
- **원인 가설:** 명령과 옵션 사이 공백이 잘못되어 Bash가 ls 대신 ls-라는 프로그램을 찾았을 수 있다.
- **확인:** 실제 입력의 첫 단어가 ls-였고, 오류에도 ls-를 찾지 못했다고 표시되었다. 명령 ls와 옵션 -la는 공백으로 구분해야 한다.
- **해결:** `ls -la`로 고쳐 입력했다.
- **결과:** archive와 memo-copy.txt 등을 포함한 상세 목록이 정상 출력되었다. 이후 이동·삭제 명령도 수행했다.
- **증거:** [사용자 직접 터미널 로그](evidence/10-user-terminal.md#10-b-복사-이동이름-변경-삭제).

## 5. --mount 오타·인자 누락·명령 분리

- **문제:** ==mount로 입력해 invalid reference format, --mount만 입력해 flag needs an argument, 나머지 문자열과 이미지를 별도 입력해 PowerShell ParserError가 발생했다.
- **원인 가설:** 옵션 철자가 다르고 필수 값과 이미지가 하나의 docker run 명령에 전달되지 않았을 수 있다.
- **확인:** 사용자 입력과 오류에 해당 옵션·인자 누락 및 독립적인 문자열 식이 표시되었다.
- **해결:** --mount 뒤에 연결 설정 문자열을 넣고 마지막에 이미지 이름까지 포함한 전체 명령을 한 번에 실행했다.
- **결과:** 컨테이너 ID가 출력되고 e1-1-bind-guide가 healthy / 8081→80으로 나타났다.
- **증거:** [실제 실패·성공 로그](evidence/11-user-bind.md#11-c-copybind-컨테이너-생성과-입력-오류-해결).

## 6. curl 파이프라인의 한글 깨짐 (해결)

- **문제:** 사용자 Windows PowerShell에서 curl을 Select-String으로 넘기자 페이지 버전의 한글이 깨졌다. SIMPLE_PAGE_V1 식별자는 정상 출력되었다.
- **원인 가설:** UTF-8 웹 응답과 터미널의 외부 명령 출력 해석이 일치하지 않을 수 있다.
- **확인:** 보조 도구가 8081·8082의 HTTP 바이트를 UTF-8로 해석하고 호스트 파일과 비교해 일치를 확인했다. HTML 원본 손상은 관찰되지 않았다.
- **해결:** `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8`을 현재 세션에 적용했다. 사용자가 처음 UTF8code로 붙여 입력해 null 값 설정 예외가 발생했으나, UTF8 설정 명령과 code 편집 명령을 별도 줄로 나눠 실행해 고쳤다.
- **결과:** 사용자 재실행에서 8081은 SIMPLE_PAGE_V2 / 페이지 버전: 2, 8082는 SIMPLE_PAGE_V1 / 페이지 버전: 1을 한글 깨짐 없이 출력했다. 보조 도구뿐 아니라 사용자의 현재 세션에서도 해결을 확인했다.
- **증거:** [사용자 원본 출력과 보조 검증](evidence/11-user-bind.md#11-d-수정-전-응답과-한글-표시-문제).
- **참고:** [PowerShell 문자 인코딩](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_character_encoding?view=powershell-5.1).

## 7. Git 출력의 less 화면에서 셸 명령 입력 (해결)

- **문제:** Git 설정 조회 뒤 SUMMARY OF LESS COMMANDS와 log file 입력 화면이 반복되어 다음 셸 명령의 결과가 나오지 않았다.
- **원인 가설:** 긴 출력을 보여주는 less를 종료하지 않아 셸 명령의 문자가 less의 조작 키로 처리됐을 수 있다. 당시 셸은 CMD였으므로 PowerShell 전용 버전 조회도 구분해야 했다.
- **확인:** 사용자 첨부 출력에 less 도움말과 파일 이름 입력이 나타났고, 작업 폴더의 tatus --short 파일도 실제 less 도움말 로그로 확인했다. 이 로그는 삭제하지 않고 제외 폴더 work에 보관했다.
- **해결 안내:** 파일 이름 입력은 Ctrl+C로 취소, q로 보기 화면 종료, PowerShell로 전환, Git 조회에는 --no-pager 사용.
- **결과:** 사용자 재조회에서 현재 main, 올바른 origin, M app/index.html과 PowerShell 5.1.26100.9711이 정상 출력됐다.
- **증거:** [Git 조회 복구 및 실제 결과](evidence/14-user-git.md#14-c-powershell에서-현재-브랜치원격작업-상태-확인).
