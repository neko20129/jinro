//jinro_game
//jinro_game_matsubara
function generateUuid() {
    let value;
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        value = crypto.randomUUID();
    } else if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
        const bytes = crypto.getRandomValues(new Uint8Array(16));
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        const hex = [...bytes].map(byte => byte.toString(16).padStart(2, '0')).join('');
        value = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    } else {
        value = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    }
    setAppStorage('uuid', value);
    return value;
}
const uuid = getAppStorage('uuid') ?? generateUuid();

function generateRoomid() {
    if (typeof crypto === 'undefined' || typeof crypto.getRandomValues !== 'function') {
        return Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    }
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return (array[0] % 1000000).toString().padStart(6, '0');
}

async function nameprompt(str) {
    const userprompt = window.prompt(str);
    if (typeof userprompt !== 'string') return null;
    const trimmedName = userprompt.trim();
    if (!trimmedName) return null;
    if (trimmedName.length > 15) return trimmedName.slice(0, 15);
    await setUsername(trimmedName);
    return trimmedName;
}

let username = getAppStorage('username') ?? '';
let usernamePrompted = false;
if (!username) {
    usernamePrompted = true;
    nameprompt('【初期設定】\nユーザー名を15字以内で入力してください');
}

async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;
    const sent = await handleSend('messages', { message, sender_id: uuid });
    if (sent) {
        messageInput.value = '';
        await reloadData();
    }
}

async function setUsername(newname) {
    if (typeof newname !== 'string') return false;
    username = newname.trim().slice(0, 15);
    if (!username) return false;
    setAppStorage('username', username);
    const storedRoomId = getAppStorage('roomId');
    const roomId = storedRoomId == null || storedRoomId === ''
        ? null
        : String(storedRoomId).padStart(6, '0');
    roomStateRevision++;
    if (roomId !== null) setAppStorage('roomId', roomId);
    const saved = await savePlayerState({ player_name: username, player_id: uuid, room: roomId });
    if (!saved) {
        alert('ユーザー名の保存に失敗しました');
        return false;
    }
    alert(`ユーザー名を${username}に設定しました`);
    return true;
}

async function fetchMessage() {
    const messages = await fetchData('messages');
    await reloadMessage(messages);
}

async function fetchUsername() {
    const roomRevision = roomStateRevision;
    const { player: currentPlayer, error } = await fetchPlayerState(uuid);
    if (error) return;

    if (currentPlayer) {
        username = currentPlayer.player_name ?? null;
        if (username === null) {
            resetStorage('username');
        } else {
            setAppStorage('username', username);
        }
        const playerRoom = currentPlayer.room ?? currentPlayer.room_id;
        if (roomRevision === roomStateRevision && getAppStorage('roomId') == null && playerRoom != null) {
            const roomId = String(playerRoom).padStart(6, '0');
            setAppStorage('roomId', roomId);
        }
    } else {
        username = null;
        usernamePrompted = true;
        resetStorage('username');
    }
}

async function enterRoom(roomId) {
    const roomIdInput = String(roomId ?? '').trim();
    const joinRoomButton = document.getElementById('join-room-btn');
    const joinStatus = document.getElementById('join-status');
    if (!/^\d{1,6}$/.test(roomIdInput)) {
        if (joinStatus) joinStatus.textContent = 'RoomIDは1〜6桁の数字で入力してください';
        return false;
    }

    const normalizedRoomId = roomIdInput.padStart(6, '0');
    if (joinRoomButton) joinRoomButton.disabled = true;
    if (joinStatus) joinStatus.textContent = '部屋に参加しています...';

    try {
        const saved = await savePlayerState({ player_name: username, player_id: uuid, room: normalizedRoomId });
        if (!saved) {
            if (joinStatus) joinStatus.textContent = '参加情報を保存できませんでした。通信状態を確認して再試行してください。';
            return false;
        }

        roomStateRevision++;
        setAppStorage('roomId', normalizedRoomId);
        await showPage('room');
        return true;
    } catch (error) {
        console.error('部屋への参加に失敗しました:', error);
        if (joinStatus) joinStatus.textContent = '通信エラーで参加できませんでした。時間をおいて再試行してください。';
        return false;
    } finally {
        if (joinRoomButton) joinRoomButton.disabled = false;
    }
}

async function idToName(id) {
    const list = await fetchData('players');
    const match = [...list].reverse().find(item => item.player_id === id);
    return match ? match.player_name : undefined;
}

async function reloadMessage(dataList) {
    const sortedData = [...(dataList ?? [])].sort((a, b) => {
        const aTime = new Date(a.time).getTime();
        const bTime = new Date(b.time).getTime();
        return (Number.isFinite(aTime) ? aTime : 0) - (Number.isFinite(bTime) ? bTime : 0);
    });
    const players = await fetchData('players');
    const namesById = new Map(players.map(player => [player.player_id, player.player_name]));

    const escapeHtml = value => String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');

    const displayDataList = sortedData.map(item => ({
        ...item,
        sender_name: namesById.get(item.sender_id),
        message: escapeHtml(item.message),
        sender_name_safe: escapeHtml(namesById.get(item.sender_id))
    }));

    chatcontentsArea.innerHTML = displayDataList.map(item => `
        <div class="message-item">
          <div class="sender">ユーザー名: ${item.sender_name_safe || '不明なユーザー'}</div>
          <div class="text">${item.message}</div>
        </div>
    `).join('');
}

async function reloadData() {
    await Promise.all([
        fetchMessage(),
        fetchUsername()
    ]);
    await renderParticipants(getAppStorage('roomId'));
}

//ボタンクリック
sendBtn.onclick = () => sendMessage();
setnameBtn.onclick = async() => setUsername(nameInput.value);
document.getElementById('join-room-btn').onclick = () => {
    enterRoom(document.getElementById('join-room-id').value);
};

//ゲームループ
setInterval(() => {
    reloadUI();
}, 100);

setInterval(() => {
    reloadData();
}, 10000)

//読み込み時実行
document.addEventListener('DOMContentLoaded', async () => {
    const requestedRoomId = new URLSearchParams(window.location.search).get('room');
    if (requestedRoomId !== null) {
        const entered = await enterRoom(requestedRoomId);
        if (!entered) {
            const savedRoomId = getAppStorage('roomId');
            await showPage(savedRoomId ? 'room' : 'title');
        }
        await reloadData();
        return;
    }

    const savedRoomId = getAppStorage('roomId');
    if (savedRoomId) {
        await showPage('room');
    } else {
        await showPage('title');
    }
    await reloadData();
});