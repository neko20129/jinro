//ボタン
const menuBtn = document.getElementById('menubtn');
const messageBtn = document.getElementById('messagebtn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const closeChatBtn = document.getElementById('close-chat-btn');
const sendBtn = document.getElementById('send-btn');
const setnameBtn = document.getElementById('set-name');

//ボタン以外の入力
const messageInput = document.getElementById('message-input');
const nameInput = document.getElementById('name-input');

//出力
const chatcontentsArea = document.getElementById('chat-content');
const sideMenu = document.getElementById('side-menu');
const sideChat = document.getElementById('side-chat');
const overlay = document.getElementById('overlay');

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
    if (typeof username) nameInput.value = typeof username;
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