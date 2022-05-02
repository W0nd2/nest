function userRegistration(){
    let regEmail = document.getElementById('registration-email').value
    let regPassword = document.getElementById('registration-password').value
    let regLogin = document.getElementById('registration-login').value
    const requestURL = 'http://localhost:5000/api/auth/registration'

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', requestURL)
        xhr.responseType = 'json'
        xhr.setRequestHeader("Content-type", "application/json");
        const body = {
            email: regEmail,
            password: regPassword,
            login: regLogin
        }
        xhr.send(JSON.stringify(body))
        xhr.onload = () => {
            localStorage.clear();
            localStorage.setItem('token', xhr.response.token);
            window.location.pathname = './src/views/login.html';
        }
        xhr.onerror = () => {
            reject(xhr.response);
        }
    })
}

function managerRegistration(){
    let regEmail = document.getElementById('registration-email').value
    let regPassword = document.getElementById('registration-password').value
    let regLogin = document.getElementById('registration-login').value
    const requestURL = 'http://localhost:5000/api/auth/registration'
    //------------------
    const roomName = 'Manager registration'
    const userRole = 'MANAGER'
    const message = "Новый менеджер ожидает подтверждения регистрации"
    const socketUrl = "http://localhost:8000/chat"
    //let socket = {chat:null, alerts:null}
    let socket = io(socketUrl)
    socket.emit("joinRoom", ({roomName}));
    socket.on("joinedRoom", (value)=>{
        console.log(value)
    })
    socket.emit("chatToServer",{roomName, message})
    socket.on("chatToClient",(message)=>{
        console.log(message)
    })
    //------------------
    //console.log('pppp')
    // return new Promise((resolve, reject) => {
    //     const xhr = new XMLHttpRequest()
    //     xhr.open('POST', requestURL)
    //     xhr.responseType = 'json'
    //     xhr.setRequestHeader("Content-type", "application/json");
    //     const body = {
    //         email: regEmail,
    //         password: regPassword,
    //         login: regLogin,
    //         role: 2
    //     }
    //     xhr.send(JSON.stringify(body))
    //     xhr.onload = () => {
    //         localStorage.clear()
    //         localStorage.setItem('token', xhr.response.token)
    //         // const roomName = 'Manager registration'
    //         // const userRole = 'MANAGER'
    //         // const message = "Новый менеджер ожидает подтверждения регистрации"
    //         // const socketUrl = "http://localhost:5000/chat"
    //         // const socket = io(socketUrl)
    //         // socket.on("connect", () => {
    //         //     socket.emit("joinRoom", ({roomName}));
    //         // });
    //         // socket.on("joinedRoom", (value)=>{
    //         //     alert(value)
    //         // })
    //         // socket.emit("chatToServer",{roomName, message})
    //         // socket.on("chatToClient",(message)=>{
    //         //     alert(message)
    //         // })
    //     }
    //     xhr.onerror = () => {
    //         reject(xhr.response)
    //     }
    // })
}