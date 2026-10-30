//jinro_game
//jinro_game_matsubara
function generateUuid() {
    localStorage.setItem('uuid', crypto.randomUUID());
    return localStorage.getItem('uuid');
}
const uuid = localStorage.getItem('uuid') ?? generateUuid();

async function nameprompt(str) {
    const userprompt = prompt(str);
    if (!userprompt) return;
    await setUsername(userprompt);
    return userprompt;
}

let username = localStorage.getItem('username') ?? nameprompt('【初期設定】\nユーザー名を15字以内で入力してください','ユーザー名');

async function sendMessage() {
    const message = messageInput.value;
    await handleSend('messages', { message: message, sender_id: uuid });
    messageInput.value = '';
    reloadData();
}

async function setUsername(option) {
    const newname = option ?? nameInput.value;
    localStorage.setItem('username', newname);
    username = newname;
    await handleSend('players', { player_name: newname, player_id: uuid });
}

async function fetchMessage() {
    const messages = await fetchData('messages');
    reloadMessage(messages);
}

async function idToName(id) {
    const list = await fetchData('players');
    const match = list.findLast(item => item.player_id === id);
    return match ? match.player_name : undefined;
}

async function reloadMessage(dataList) {
    const sortedData = [...dataList].sort((a, b) => new Date(a.time) - new Date(b.time));
    chatcontentsArea.innerHTML = sortedData.map(item => `
        <div class="message-item">
          <div class="sender">ID: ${item.sender_id}</div>
          <div class="text">${item.message}</div>
        </div>
    `).join('');
    console.log(sortedData);
}

function reloadUI() {

}

function reloadData() {
    fetchMessage();
}
//ボタンクリック
sendBtn.addEventListener('click', sendMessage);
setnameBtn.addEventListener('click', setUsername);

//ゲームループ
setInterval(() => {
    reloadUI();
}, 100);

setInterval(() => {
    reloadData();
}, 10000)

//読み込み時実行
document.addEventListener('DOMContentLoaded', reloadData);