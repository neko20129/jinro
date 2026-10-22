//jinro_game
//jinro_game_matsubara
const uuid = localStorage.getItem('uuid') ?? generateUuid();

function generateUuid() {
    localStorage.setItem('uuid', crypto.randomUUID());
    return localStorage.getItem('uuid');
}

async function sendMessage() {
    const message = messageInputElm.value;
    await handleSend('messages', { message: message, sender_id: uuid });
}

async function fetchMessage() {
    const messages = await fetchData('messages');
    console.log(messages);
}