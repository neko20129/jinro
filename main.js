//jinro_game
//jinro_game_matsubara
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
    reloadMessage(messages);
}

function reloadMessage(dataList) {
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