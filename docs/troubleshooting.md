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
