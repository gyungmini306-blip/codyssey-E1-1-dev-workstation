"use strict";
const byId = id => document.getElementById(id);
const on = (id, event, handler) => byId(id).addEventListener(event, handler);
const setText = (id, value) => { byId(id).textContent = value; };
document.querySelectorAll('[data-topic]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-topic]').forEach(peer => peer.setAttribute('aria-pressed', String(peer === button)));
    document.querySelectorAll('.lesson').forEach(panel => { panel.hidden = panel.id !== `panel-${button.dataset.topic}`; });
  });
});
// All models below are browser-local. No shell or Docker control is performed.
const flowSteps = [
  ['먼저 실행할 파일과 제작 방법을 준비합니다.', 'app/index.html은 보여줄 페이지, nginx.conf는 서버 설정, Dockerfile은 이미지 제작 방법입니다.', 'FROM nginx:stable-alpine\nCOPY nginx.conf /etc/nginx/conf.d/default.conf\nCOPY app/ /usr/share/nginx/html/'],
  ['Dockerfile을 읽어 이미지를 만듭니다.', 'build가 NGINX 베이스에 우리 파일과 설정을 더해 실행 준비물을 묶습니다. 이 단계에서는 웹 서버가 아직 실행되지 않습니다.', 'docker build -t codyssey-workstation:2.0 .'],
  ['이미지로 컨테이너를 만들어 실행합니다.', 'run이 새 컨테이너를 생성하고 NGINX를 실행합니다. -d는 백그라운드 실행, -p는 PC와 컨테이너의 포트 연결입니다.', 'docker run -d --name codyssey-web -p 127.0.0.1:8080:80 codyssey-workstation:2.0'],
  ['브라우저가 요청하고, NGINX가 HTML을 응답합니다.', 'localhost:8080의 요청이 컨테이너 80번으로 전달됩니다. NGINX가 index.html을 보내면 브라우저가 CSS와 JavaScript도 요청해 화면을 구성합니다.', '브라우저 → http://localhost:8080 → 컨테이너 :80 → NGINX → HTML / CSS / JS 응답']
];
let flowIndex = 0;
function renderFlow() {
  const [title, description, command] = flowSteps[flowIndex];
  setText('flow-count', `STEP ${flowIndex + 1} / 4`);
  setText('flow-step-title', title); setText('flow-description', description); setText('flow-command', command);
  document.querySelectorAll('[data-flow]').forEach((node, index) => { node.classList.toggle('active', index === flowIndex); node.classList.toggle('done', index < flowIndex); });
  byId('flow-prev').disabled = flowIndex === 0; byId('flow-next').disabled = flowIndex === 3;
}
on('flow-prev', 'click', () => { if (flowIndex > 0) flowIndex--; renderFlow(); });
on('flow-next', 'click', () => { if (flowIndex < 3) flowIndex++; renderFlow(); });
renderFlow();
function setPath(isRoot) {
  byId('path-root').setAttribute('aria-pressed', String(isRoot)); byId('path-lab').setAttribute('aria-pressed', String(!isRoot));
  setText('relative-result', isRoot ? '/etc/os-release' : '/root/e1-1/etc/os-release');
}
on('path-root', 'click', () => setPath(true)); on('path-lab', 'click', () => setPath(false));
let permissionTarget = 'memo.txt';
const permissionInputs = [...document.querySelectorAll('[data-owner]')];
function renderPermissions() {
  const sums = [0,0,0]; const letters = [];
  permissionInputs.forEach((input,index) => { if (input.checked) sums[Number(input.dataset.owner)] += Number(input.value); letters.push(input.checked ? ['r','w','x'][index % 3] : '-'); });
  const octal = sums.join('');
  setText('permission-octal', octal); setText('permission-symbolic', letters.join('')); setText('permission-command', `chmod ${octal} ${permissionTarget}`);
}
function presetPermissions(digits, target) {
  permissionTarget = target;
  permissionInputs.forEach(input => { input.checked = Boolean(Number(digits[Number(input.dataset.owner)]) & Number(input.value)); });
  renderPermissions();
}
permissionInputs.forEach(input => input.addEventListener('change', renderPermissions));
on('preset-file','click', () => presetPermissions('644','memo.txt')); on('preset-dir','click', () => presetPermissions('755','practice/'));
renderPermissions();
let imageExists = false; let containerState = 'none';
function renderLifecycle(message, command) {
  setText('image-state', imageExists ? '이미지 있음' : '아직 만들지 않음');
  setText('container-state', {none:'컨테이너 없음',running:'실행 중 · NGINX가 요청을 기다림',stopped:'중지됨 · 컨테이너 파일은 남아 있음'}[containerState]);
  byId('image-state').closest('article').classList.toggle('active', imageExists);
  byId('container-state').closest('article').classList.toggle('active', containerState === 'running');
  byId('life-run').disabled = !imageExists || containerState !== 'none'; byId('life-stop').disabled = containerState !== 'running';
  byId('life-start').disabled = containerState !== 'stopped'; byId('life-remove').disabled = containerState !== 'stopped';
  if (message) setText('life-message',message); if (command) setText('life-command',command);
}
on('life-build','click', () => { imageExists = true; renderLifecycle('이미지가 준비됐습니다. 실행할 컨테이너는 별도로 생성합니다.', 'docker build -t codyssey-workstation:2.0 .'); });
on('life-run','click', () => { containerState = 'running'; renderLifecycle('이미지로 새 컨테이너를 생성해 NGINX를 실행했습니다. 이미지도 그대로 남습니다.', 'docker run -d --name web codyssey-workstation:2.0'); });
on('life-stop','click', () => { containerState = 'stopped'; renderLifecycle('주 프로세스를 종료했습니다. 중지된 컨테이너는 docker ps -a에서 볼 수 있습니다.', 'docker stop web\ndocker ps -a'); });
on('life-start','click', () => { containerState = 'running'; renderLifecycle('중지해 둔 기존 컨테이너를 다시 시작했습니다. 새로 만드는 run과 다릅니다.', 'docker start web'); });
on('life-remove','click', () => { containerState = 'none'; renderLifecycle('컨테이너를 제거했습니다. 이미지가 남아 있으므로 새 컨테이너를 만들 수 있습니다.', 'docker rm web\ndocker images'); });
renderLifecycle();
function renderPorts() {
  const host = byId('host-port').value; const target = byId('target-port').value; const enabled = byId('publish-port').checked;
  setText('browser-address',`localhost:${host}`); setText('port-mapping',enabled ? `${host} → ${target}` : '연결 없음');
  const connected = enabled && target === '80'; byId('port-bridge').classList.toggle('blocked',!connected);
  setText('port-result', !enabled ? '모형의 예상: 호스트에 포트를 연결하지 않아 localhost의 이 포트로 요청이 전달되지 않습니다.' : connected ? '모형의 예상: 서버의 80번에 연결되므로 요청이 도달할 수 있습니다.' : '모형의 예상: 컨테이너 8080번에는 이 NGINX가 대기하지 않아 연결에 실패합니다. 컨테이너 쪽을 80으로 바꿔 보세요.');
  setText('port-command',`docker run -d ${enabled ? `-p 127.0.0.1:${host}:${target} ` : ''}codyssey-workstation:2.0`);
}
['host-port','target-port','publish-port'].forEach(id => on(id,'change',renderPorts));
setText('live-address',`${location.origin}/healthz`);
on('check-server','click',async () => {
  const button = byId('check-server'); button.disabled = true; setText('server-result','실제 서버에 요청 중…');
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(),8000);
  try {
    const response = await fetch('/healthz',{cache:'no-store', signal:controller.signal}); const body = (await response.text()).trim();
    setText('server-result', response.ok && body === 'ok' ? `실제 응답: HTTP ${response.status} · ${body} — 현재 서버가 요청에 응답했습니다.` : `실제 응답: HTTP ${response.status} — 예상한 ok 응답이 아닙니다.`);
  } catch (error) { setText('server-result', error.name === 'AbortError' ? '8초 안에 응답하지 않았습니다. 터미널에서 서버 상태를 확인하세요.' : '요청하지 못했습니다. 컨테이너 상태와 접속 주소를 확인하세요.'); }
  finally { clearTimeout(timeout); button.disabled = false; }
});
renderPorts();
let mountMode = 'copy'; let imageText = '안녕, E1-1!';
function renderMount() {
  byId('mode-copy').setAttribute('aria-pressed',String(mountMode === 'copy')); byId('mode-bind').setAttribute('aria-pressed',String(mountMode === 'bind'));
  setText('rendered-text',mountMode === 'copy' ? imageText : byId('host-text').value || '(빈 문구)');
  setText('mount-explanation',mountMode === 'copy' ? '빌드 시 복사한 내용 · 호스트 문구만 바꿔도 여기는 그대로' : '호스트 파일을 연결한 내용 · 새 요청에서는 수정 내용 확인');
  byId('copy-rebuild').disabled = mountMode !== 'copy';
  setText('mount-command',mountMode === 'copy' ? 'COPY app/ /usr/share/nginx/html/' : 'docker run -d -p 127.0.0.1:8081:80 --mount "type=bind,src=<호스트 app의 절대 경로>,dst=/usr/share/nginx/html,readonly" codyssey-workstation:2.0');
}
on('mode-copy','click', () => { mountMode='copy'; renderMount(); }); on('mode-bind','click', () => { mountMode='bind'; renderMount(); }); on('host-text','input', renderMount);
on('copy-rebuild','click', () => { imageText=byId('host-text').value || '(빈 문구)'; renderMount(); setText('mount-explanation','수정본으로 새 이미지를 빌드하고 컨테이너를 재생성한 상태 (모형)'); });
renderMount();
let volumeContainer = true; let ephemeralData = false; let persistentData = false;
function renderVolume(message) {
  setText('ephemeral-data',!volumeContainer ? '컨테이너와 함께 제거됨' : ephemeralData ? 'hello E1-1' : '비어 있음');
  setText('persistent-data',persistentData ? 'hello E1-1' : '비어 있음'); setText('volume-container-state',volumeContainer ? '컨테이너 존재' : '컨테이너 없음');
  byId('volume-write').disabled=!volumeContainer; byId('volume-delete').disabled=!volumeContainer; byId('volume-recreate').disabled=volumeContainer;
  if(message) setText('volume-result',message);
}
on('volume-write','click', () => { ephemeralData=true; persistentData=true; renderVolume('같은 내용을 양쪽에 썼습니다. 이제 컨테이너를 삭제해 보세요. (모형)'); });
on('volume-delete','click', () => { volumeContainer=false; ephemeralData=false; renderVolume('컨테이너 내부 데이터는 사라졌지만, 별도로 삭제하지 않은 이름 있는 볼륨의 데이터는 남습니다. (모형)'); });
on('volume-recreate','click', () => { volumeContainer=true; renderVolume(persistentData ? '새 컨테이너 내부는 비었고 같은 볼륨에는 hello E1-1이 남았습니다. (모형)' : '새 컨테이너를 만들었습니다. 아직 볼륨에 쓴 데이터가 없습니다. (모형)'); });
renderVolume();
let gitPhase=0;
function renderGit(message) {
  ['git-work','git-stage','git-commit','git-remote'].forEach((id,index) => { byId(id).classList.toggle('active',gitPhase===index+1); byId(id).classList.toggle('done',gitPhase>index+1); });
  byId('git-edit').disabled=gitPhase>0 && gitPhase<4; byId('git-add').disabled=gitPhase!==1; byId('git-save').disabled=gitPhase!==2; byId('git-push').disabled=gitPhase!==3;
  if(message) setText('git-result',message);
}
on('git-edit','click', () => { gitPhase=1; renderGit('작업 파일을 수정했습니다. 아직 이번 변경을 커밋하지 않았습니다. (모형)'); });
on('git-add','click', () => { gitPhase=2; renderGit('git add: 이번 커밋에 넣을 변경을 스테이징했습니다. GitHub에는 아직 전달되지 않았습니다. (모형)'); });
on('git-save','click', () => { gitPhase=3; renderGit('git commit: 내 PC에 변경 이력을 저장했습니다. 원격 업로드는 다음 단계입니다. (모형)'); });
on('git-push','click', () => { gitPhase=4; renderGit('git push: 로컬 커밋을 GitHub 원격 저장소로 전달했습니다. 실제 작업에는 저장소 쓰기 권한과 인증이 필요합니다. (모형)'); });
renderGit();
