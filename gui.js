//ボタン
const menuBtn = document.getElementById('menubtn');
const messageBtn = document.getElementById('messagebtn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const closeChatBtn = document.getElementById('close-chat-btn');
const sendBtn = document.getElementById('send-btn');
const setnameBtn = document.getElementById('set-name');
const backbtn = document.getElementById('backbtn');

//ボタン以外の入力
const messageInput = document.getElementById('message-input');
const nameInput = document.getElementById('name-input');

//出力
const chatcontentsArea = document.getElementById('chat-content');
const sideMenu = document.getElementById('side-menu');
const sideChat = document.getElementById('side-chat');
const overlay = document.getElementById('overlay');
const roomIdText = document.getElementById('room-id-text');
const participantList = document.getElementById('participant-list');

async function renderParticipants() {
    if (!participantList) return;

    const players = await fetchData('players');
    const participantNames = [...new Map((players ?? []).map(player => [player.player_id, player.player_name])).values()]
        .filter(Boolean);

    const names = participantNames.length ? participantNames : [username || 'あなた'];
    participantList.innerHTML = names.map(name => `<li>${name}</li>`).join('');

    if (roomIdText) {
        const roomId = localStorage.getItem('roomId') || '000000';
        roomIdText.textContent = roomId;
    }
}

function closeAll() {
    sideMenu.classList.remove('active');
    sideChat.classList.remove('active');
    overlay.classList.remove('active');
}

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        if (page.id === pageId) {
            page.style.display = 'flex';
        } else {
            page.style.display = 'none';
        }
    });
    //初期値設定
    if (pageId === 'title') backbtn.style.display = 'none';
    if (pageId !== 'title') backbtn.style.display = '';
    if (pageId === 'settings') nameInput.value = username;
    if (pageId === 'room') {
        const roomId = localStorage.getItem('roomId') ?? generateRoomid();
        localStorage.setItem('roomId', roomId);
        if (roomIdText) roomIdText.textContent = roomId;
        renderParticipants();
    }
    closeAll();
}
showPage('title');

function reloadUI() {
    if (messageInput.value) {
        sendBtn.disabled = false;
    } else {
        sendBtn.disabled = true;
    }
}

menuBtn.addEventListener('click', () => {
    closeAll();
    sideMenu.classList.add('active');
    overlay.classList.add('active');
});

messageBtn.addEventListener('click', () => {
    closeAll();
    sideChat.classList.add('active');
    overlay.classList.add('active');
});

closeMenuBtn.addEventListener('click', closeAll);        
closeChatBtn.addEventListener('click', closeAll);
overlay.addEventListener('click', closeAll);