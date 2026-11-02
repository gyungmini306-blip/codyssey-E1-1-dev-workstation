# 02. 설치 결과 및 재시작 대기

> 이 문서는 재시작 전의 설치 기록입니다. 현재 Docker 엔진과 hello-world는 정상 실행되며, 최신 결과는 [05. hello-world 검증](05-hello-world.md)에 기록했습니다. 아래의 미실행 목록과 오류는 당시 상태입니다.

확인일: 2026-11-02 (Asia/Seoul). 실제 출력에서 진행 표시, 라이선스 안내, 개인 PC 이름/경로를 생략한 발췌입니다.

## WSL

일반 권한으로 처음 실행한 설치는 관리자 권한 부족으로 실패했습니다.

```powershell
PS> winget install --id Microsoft.WSL --exact --accept-source-agreements --accept-package-agreements --disable-interactivity
찾음 Linux용 Windows 하위 시스템 [Microsoft.WSL] 버전 2.7.14
설치 관리자가 종료 코드로 인해 실패함: 0x80073d28 : The package installation failed because administrator privileges are required. Please contact an administrator to install this package.
```

같은 설치 명령을 관리자 PowerShell에서 실행하고 Ubuntu 설치 명령을 이어서 실행했습니다. 관리자 PowerShell 실행에는 `Start-Process ... -Verb RunAs`를 사용했습니다.

```powershell
PS (Administrator)> winget install --id Microsoft.WSL --exact --accept-source-agreements --accept-package-agreements --disable-interactivity
찾음 Linux용 Windows 하위 시스템 [Microsoft.WSL] 버전 2.7.14
설치 성공

PS (Administrator)> wsl --install -d Ubuntu --no-launch
WSL이 업그레이드 마무리 중...
Windows 선택적 구성 요소 설치 중: VirtualMachinePlatform
작업을 완료했습니다.
요청한 작업이 잘 실행되었습니다. 시스템을 다시 시작하면 변경 사항이 적용됩니다.

PS> Get-AppxPackage '*WindowsSubsystemForLinux*' | Select-Object Name,Version
Name                                            Version
----                                            -------
MicrosoftCorporationII.WindowsSubsystemForLinux 2.7.14.0

PS> Test-Path 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Component Based Servicing\RebootPending'
True
```

이 시점에 배포판 목록을 별도로 확인한 결과는 다음과 같습니다.

```powershell
PS> & 'C:\Program Files\WSL\wsl.exe' --list --verbose
Linux용 Windows 하위 시스템 설치된 배포가 없습니다.
```

WSL 패키지와 Windows 가상화 기능 준비를 완료했지만 Ubuntu 배포판 생성까지 완료한 것은 아닙니다. 재시작 후 `wsl --install -d Ubuntu --no-launch`를 다시 실행하고 `wsl --list --verbose`에서 Ubuntu와 VERSION 2를 확인해야 합니다.

## Docker Desktop 및 CLI

```powershell
PS> winget install --id Docker.DockerDesktop --exact --accept-source-agreements --accept-package-agreements --disable-interactivity
찾음 Docker Desktop [Docker.DockerDesktop] 버전 4.97.0
설치 관리자 해시를 확인했습니다.
설치 성공

PS> & 'C:\Program Files\Docker\Docker\resources\bin\docker.exe' --version
Docker version 29.9.2, build a82e528

PS> & 'C:\Program Files\Docker\Docker\resources\bin\docker.exe' info
Client:
 Version:    29.9.2
 Context:    default
 Debug Mode: false
[중간 CLI 플러그인 목록 생략]
Server:
failed to connect to the docker API at npipe:////./pipe/docker_engine; check if the path is correct and if the daemon is running: open //./pipe/docker_engine: The system cannot find the file specified.
```

현재 PowerShell은 설치 전 PATH를 물려받았으므로 새 터미널을 열기 전까지 설치된 Docker CLI의 절대 경로를 사용했습니다. CLI 버전 확인과 Docker 엔진 동작 확인은 별개입니다. 엔진은 아직 연결되지 않았고 컨테이너 실행 성공 증거도 수집하지 않았습니다.

## 다음 검증 순서 (아직 실행하지 않음)

1. Windows 재시작
2. Ubuntu 배포판 설치 및 WSL 2 확인
3. Docker Desktop 시작과 Ubuntu WSL Integration 설정 확인
4. `docker info`의 Server 정보 및 `docker run hello-world` 확인
5. 터미널·권한 실습, Dockerfile 빌드, 포트/마운트/볼륨 실습 진행
