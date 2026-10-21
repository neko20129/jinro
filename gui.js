//ボタン
const menuBtn = document.getElementById('menubtn');
const messageBtn = document.getElementById('messagebtn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const closeChatBtn = document.getElementById('close-chat-btn');

//出力
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
    closeAll()
}
showPage('title');

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