//入力
const menuBtn = document.getElementById('menubtn');
const messageBtn = document.getElementById('messagebtn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const closeChatBtn = document.getElementById('close-chat-btn');
const loginbtn = document.getElementById('login-btn');
        
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
    closeAll();
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        if (page.id === pageId) {
            page.style.display = 'flex';
        } else {
            page.style.display = 'none';
        }
    });
}
showPage('title');

function addMessage(text) {
    const chatArea = document.getElementById('chat-content');
    const createAdd = document.createElement('p');
    createAdd.textContent = text;
    chatArea.appendChild(createAdd);
    const initialtxt = document.querySelector('.chat-content > p');
    initialtxt.style.display = 'none';
}

//ボタン検知
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


sendBtnElm.addEventListener('click', sendMessage)

closeMenuBtn.addEventListener('click', closeAll);        
closeChatBtn.addEventListener('click', closeAll);
overlay.addEventListener('click', closeAll);