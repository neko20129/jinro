//jinro_game
//jinro_game_matsubara
let username = localStorage.getItem('username') ?? prompt('【初期設定】\nユーザー名を15字以内で入力してください','ユーザー名')

function generateUuid() {
    localStorage.setItem('uuid', crypto.randomUUID());
    return localStorage.getItem('uuid');
}
const uuid = localStorage.getItem('uuid') ?? generateUuid();

async function sendMessage() {
    const message = messageInput.value;
    await handleSend('messages', { message: message, sender_id: uuid });
}

async function setUsername() {
    const newname = nameInput.value;
    localStorage.setItem('username', newname);
    username = newname;
    await handleSend('players', { player_name: newname, player_id: uuid });
}

async function fetchMessage() {
    const messages = await fetchData('messages');
    console.log(messages);
}

//ボタンクリック
sendBtn.addEventListener('click', sendMessage);

//ゲームループ
setInterval(() => {
    reloadUI();
}, 100);