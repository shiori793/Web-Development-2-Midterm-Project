function login() {
    const loginInput = document.getElementById('floatingUserId').value;
    if (checkStorage(loginInput)) {
        user_id = loginInput;
        sessionStorage.setItem('loginUserID', user_id);
        window.location.href = './home.html';
    } else {
        alert('Your User ID is not valid. Please try again.');
    };
};

function signin() {
    user_id = localStorage.length + 1;
    sessionStorage.setItem('loginUserID', user_id);
    window.location.href = './home.html';
}

function checkStorage(input) {
    for (let i = 0; localStorage.length; i++) {
        if (localStorage.key[i] == input) {
            return true;
        }
    }
    return false;
}