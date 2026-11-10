//jinro_game
//jinro_game_matsubara
function generateUuid() {
    localStorage.setItem('uuid', crypto.randomUUID());
    return localStorage.getItem('uuid');
}
const uuid = localStorage.getItem('uuid') ?? generateUuid();

function generateRoomid() {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return (array[0] % 1000000).toString().padStart(6, '0');
}

async function nameprompt(str) {
    const userprompt = prompt(str);
    if (!userprompt) return;
    await setUsername(userprompt);
    return userprompt;
}

var username = localStorage.getItem('username') ?? nameprompt('【初期設定】\nユーザー名を15字以内で入力してください','ユーザー名');

async function sendMessage() {
    const message = messageInput.value;
    await handleSend('messages', { message: message, sender_id: uuid });
    messageInput.value = '';
    reloadData();
}

async function setUsername(newname) {
    username = await newname;
    localStorage.setItem('username', username);
    await handleSend('players', { player_name: username, player_id: uuid });
    alert(`ユーザー名を${username}に設定しました`);
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

    const displayDataList = await Promise.all(
        sortedData.map(async (item) => {
            const name = await idToName(item.sender_id);
            return { ...item, sender_name: name };
        })
    );

    chatcontentsArea.innerHTML = displayDataList.map(item => `
        <div class="message-item">
          <div class="sender">ユーザー名: ${item.sender_name}</div>
          <div class="text">${item.message}</div>
        </div>
    `).join('');
}


function reloadUI() {

}

function reloadData() {
    fetchMessage();
}

//ボタンクリック
sendBtn.onclick = () => sendMessage();
setnameBtn.onclick = async() => setUsername(nameInput.value);

//ゲームループ
setInterval(() => {
    reloadUI();
}, 100);

setInterval(() => {
    reloadData();
}, 10000)

//読み込み時実行
document.addEventListener('DOMContentLoaded', reloadData);