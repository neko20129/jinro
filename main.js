//jinro_game
//jinro_game_matsubara
function generateUuid() {
    localStorage.setItem('uuid', crypto.randomUUID());
    return localStorage.getItem('uuid');
}
const uuid = localStorage.getItem('uuid') ?? generateUuid();

function nameprompt(str) {
    const prompt = prompt(str);
    if (!prompt) return;
    await setUsername(prompt);
    return prompt;
}
let username = localStorage.getItem('username') ?? nameprompt('【初期設定】\nユーザー名を15字以内で入力してください','ユーザー名');

async function sendMessage() {
    const message = messageInput.value;
    await handleSend('messages', { message: message, sender_id: uuid });
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
    const playerData = await fetchData('players');
    const map = new Map(playerData.map(item => [item.id, item]));
    const result = Array.from(map.values())[0].player_name;
    console.log(playerData);
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
}, 3000)