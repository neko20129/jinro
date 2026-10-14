//jinro_game
//jinro_game_matsubara

//UUID
function generateUuid() {
    localStorage.setItem('uuid', crypto.randomUUID());
    return localStorage.getItem('uuid');
}
const uuid = localStorage.getItem('uuid') ?? generateUuid();

//送信
async function sendMessage() {
    const message = messageInputElm.value;
    await handleSend('messages', { message: message, sender_id: uuid});
    alert('メッセージを送信しました');
    messageInputElm.value = '';
    addMessage(message);
}

async function setName() {
    const nameElm = document.getElementById('username');
    const newname = nameElm.value;
    if (newname) {
        localStorage.setItem('username', newname);
        await handleSend('players', { player_id: uuid, player_name: newname});
        alert(`名前を${newname}に設定しました`);
    }
}

//受信
let messageArray = [];
let id_and_name = [];
/* 
messageArray = [[sender, message], [sender, message], ...]
*/
async function receiveData() {
    const messageData = await fetchData('messages');
    const playerData = await fetchData('players');
    if (!messageData) return;
    if (!playerData) return;
    
    id_and_name = playerData.reduce((acc, current) => {
        acc[current.player_id] = current.player_name;
        return acc;
    }, {});

    messageArray = [];
    for (let i = 0; i < messageData.length; i++) {
        messageArray.push([id_and_name[messageData[i].sender_id] , messageData[i].message]);
    }

    console.log(messageArray);
}