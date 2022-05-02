function getManagers(){
    if (!localStorage.token) {
        window.location.pathname = '/client/login.html'
    }
    //токен с локал стореджа
    let token = localStorage.getItem('token')

    //ссылка на бек с просмотром профайла пользователя
    const requestURL = 'http://localhost:5000/api/admin/allManagers'

    let element = document.getElementById("managers");

    element.innerHTML='';

    return new Promise((resolve, reject) => {

        const xhr = new XMLHttpRequest()

        xhr.open('GET', requestURL)

        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.setRequestHeader("Content-type", "application/json");

        
        xhr.send()

        xhr.onload = () => {
            let res = JSON.parse(xhr.response)
            for (let index = 0; index < res.length; index++) {
                let reresultHTML
                if (!res[index].managerActive) {
                    resultHTML = `
                        <div class="manager" >
                            <span id="manager-id">id: ${res[index].id}</span>
                            <span id="manager-email">email: ${res[index].email}</span>
                            <span id="manager-login">login: ${res[index].login}</span>
                            <input id="manager-reason" placeholder="reason"></input>
                            <button id="manager-confirm" onclick="confirmManager(${res[index].id})">Подтвердить регистрацию</button>
                        </div>
                    `;
                } else {
                    resultHTML = `
                        <div class="manager" >
                            <span id="manager-id">id: ${res[index].id}</span>
                            <span id="manager-email">email: ${res[index].email}</span>
                            <span id="manager-login">login: ${res[index].login}</span>
                        </div>
                    `;
                }
                const newDiv = document.createElement("div");
                newDiv.innerHTML = resultHTML;
                element.appendChild(newDiv);
            }
            const roomName = 'Manager registration'
            const userRole = localStorage.getItem('role')
            const message = "Администратор присоеденился к группе"
            const socketUrl = "http://localhost:8000/chat"
            const socket = io(socketUrl)
            socket.emit("joinRoom", ({roomName}));
            socket.on("joinedRoom", (value)=>{
                console.log(value)
            })
            socket.emit("chatToServer",{roomName, message})
            socket.on("chatToClient",(message)=>{
                console.log(message)
            })
            // socket.on("connect", () => {
            //     socket.emit("CREATE_OR_JOIN_ROOM", {roomName, userRole });
            // });
            // socket.on("JOINED_ROOM", (value)=>{
            //     alert(value)
            // })
            // socket.emit("SEND_ROOM_MESSAGE",{roomName, message})
            // socket.on("ROOM_MESSAGE",(message, roomName)=>{
            //     alert(message)
            // })
        }
        xhr.onerror = () => {
            reject(xhr.response)
        }
    })
}

function managerById(){
    if (!localStorage.token) {
        window.location.pathname = './views/login.html'
    }
    let token = localStorage.getItem('token')
    let userId = document.getElementById('managerId').value;
    const requestURL = `http://localhost:5000/api/admin/managerByID?id=${userId}`
    let element = document.getElementById("managerById");
    element.innerHTML='';
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        const body = {
            id: userId
        }
        xhr.open('GET', requestURL)
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send()
        xhr.onload = () => {
            let res = JSON.parse(xhr.response)
            let reresultHTML
            if (!res.managerActive) {
                resultHTML = `
                        <div class="manager" >
                            <span id="manager-id">id: ${res.id}</span>
                            <span id="manager-email">email: ${res.email}</span>
                            <span id="manager-login">login: ${res.login}</span>
                            <input id="manager-reason" placeholder="reason"></input>
                            <button id="manager-confirm" onclick="confirmManager(${res.id})">Подтвердить регистрацию</button>
                        </div>
                    `;
            } else {
                resultHTML = `
                        <div class="manager" >
                            <span id="manager-id">id: ${res.id}</span>
                            <span id="manager-email">email: ${res.email}</span>
                            <span id="manager-login">login: ${res.login}</span>
                        </div>
                    `;
            }
            const newDiv = document.createElement("div");
            newDiv.innerHTML = resultHTML;
            element.appendChild(newDiv);
        }
        xhr.onerror = () => {
            reject(xhr.response)
        }
    })
}

function confirmManager(managerId){
    let reasonApprove = document.getElementById('manager-reason').value
    let token = localStorage.getItem('token')
    const requestURL = 'http://localhost:5000/api/admin/confirmManager'
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('PATCH', requestURL)
        xhr.responseType = 'json'
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        const body = {
            id: managerId,
            reason: reasonApprove
        }
        xhr.send(JSON.stringify(body))
        xhr.onload = () => {
            getManagers()
        }
        xhr.onerror = () => {
            reject(xhr.response)
        }
    })
}