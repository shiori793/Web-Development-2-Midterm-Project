const loginButton = document.getElementById('login-button');
const signinButton = document.getElementById('signin-button');

loginButton.addEventListener('click', () => {
    const loginInput = document.getElementById('floatingUserId').value;
    if (checkStorage(loginInput)) {
        user_id = loginInput;
        sessionStorage.setItem('loginUserID', user_id);
        window.location.assign('./home.html');
    } else {
        alert('Your User ID is not valid. Please try again.');
    };
});

signinButton.addEventListener('click', () => {
    user_id = localStorage.length + 1;
    sessionStorage.setItem('loginUserID', user_id);
    window.location.assign('./home.html');
});

function checkStorage(input) {
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) == input) {
            return true;
        }
    }
    return false;
}