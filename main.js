document.querySelectorAll('.title-btn').forEach(e => e.addEventListener('click', () => changeScreen('title-scr')));
document.getElementById('create-btn').addEventListener('click', () => changeScreen('create-scr'));
document.getElementById('join-btn').addEventListener('click', () => changeScreen('join-scr'));
document.getElementById('roles-btn').addEventListener('click', () => changeScreen('roles-scr'));

function changeScreen(scrId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.style.display = 'none');
    const targetScreen = document.getElementById(scrId);
    if (targetScreen) {
        targetScreen.style.display = 'flex';
    }
}
