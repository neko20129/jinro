document.querySelectorAll('.title-btn').forEach(e => e.addEventListener('click', () => changeScreen('title-scr')));
document.getElementById('create-btn').addEventListener('click', () => changeScreen('create-scr'));
document.getElementById('join-btn').addEventListener('click', () => changeScreen('join-scr'));
document.getElementById('roles-btn').addEventListener('click', () => changeScreen('roles-scr'));
document.getElementById('setting').addEventListener('click', () => changeScreen('setting-scr'));

document.getElementById('set').addEventListener('click', () => setName());

function changeScreen(scrId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.style.display = 'none');
    const targetScreen = document.getElementById(scrId);
    if (targetScreen) {
        targetScreen.style.display = 'flex';

        if (scrId === 'roles-scr') {
            nameElm.style.display = 'none';
        } else {
            nameElm.style.display = 'flex';
        }

        if (scrId === 'title-scr') {
            document.getElementById('setting').style.display = 'flex';
        } else {
            document.getElementById('setting').style.display = 'none';
        }

        if (scrId === 'create-scr' && username === null) {
            alert('ユーザー名が設定されていません');
            changeScreen('title-scr')
        }
    }
}

function setName() {
    const name = document.getElementById('name-form').value
    if (/\s/.test(name) || !name) return;

    console.log(name)
}
