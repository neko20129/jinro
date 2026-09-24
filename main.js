//jinro_game
//jinro_game_matsubara

const sendBtnElm = document.getElementById('send-btn');
const messageInputElm = document.getElementById('message-input');
const uuid = localStorage.getItem('uuid') ?? generateUuid();

function generateUuid() {
    localStorage.setItem('uuid', crypto.randomUUID());
    return localStorage.getItem('uuid');
}

async function sendMessage() {
    const message = messageInputElm.value;
    await handleSend('messages', { message: message, uuid: uuid });
}

async function fetchMessage() {
    const messages = await fetchData('messages');
    console.log(messages);
}