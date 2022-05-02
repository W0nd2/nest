function changeAvatar(event) {
    let token = localStorage.getItem('token')
    const requestURL = 'http://localhost:5000/api/user/avatar/change'
    let target = event.target || event.srcElement || event.currentTarget;
    let avatar = target.files[0];
    return new Promise((resolve, reject) => {
        const FData = new FormData();
        FData.append(`avatar`,avatar);
        let xhr = new XMLHttpRequest();
        xhr.open("PATCH", requestURL);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send(FData);

        xhr.onload = () => {
        }

        xhr.onerror = () => {
            reject(xhr.response)
        }
        
    })
    event.target.value = "";
}

function changePas(){
    let token = location.hash.split("#token=")[1]
    let newPassword = document.getElementById('password-newpas').value
    const requestURL = 'http://localhost:5000/api/user/password'
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("PATCH", requestURL);
        const body={
            password: newPassword
        }
        xhr.responseType = 'json'
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send(JSON.stringify(body));
        xhr.onload = () => {
        }
        xhr.onerror = () => {
            reject(xhr.response)
        }
    })
}