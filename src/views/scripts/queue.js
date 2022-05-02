const roomName = 'Comands infromation'
const userRole = localStorage.getItem('role')
const message = "Администратор присоеденился к группе"
const socketUrl = "http://localhost:8000"
const socket = io(socketUrl)
socket.on("connect", () => {
    socket.emit("CREATE_OR_JOIN_ROOM", {roomName, userRole });
});

socket.on("JOINED_ROOM", (value)=>{
    alert(value)
})

socket.emit("SEND_ROOM_MESSAGE",{roomName, message})

socket.on("ROOM_MESSAGE",(message)=>{
    alert(message)
})

function getQueue(){
    let element = document.getElementById("body");
    let token = localStorage.getItem('token')
    const requestURL = 'http://localhost:5000/api/admin/queue'
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', requestURL)
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send()
        xhr.onload = () => {
            let data = JSON.parse(xhr.response)
            let queueData = data.queue
            for (let index = 0; index < queueData.length; index++) {
                const resultHTML=`
                <div class="member" id="${queueData[index].userId}">
                    <span id="member-id">userId: ${queueData[index].userId}</span>
                    <span id="member-comand">comandId: ${queueData[index].comandId}</span>
                    <button id="member-registration" onclick="confirmMember(${queueData[index].userId},${queueData[index].comandId})">Подтвердить регистрацию</button>
                    <button id="member-registration" onclick="declineMember(${queueData[index].userId},${queueData[index].comandId})">Отменить регистрацию</button>
                </div>
                `;
                const newDiv =document.createElement("div");
                newDiv.innerHTML = resultHTML;
                element.appendChild(newDiv);
            }
        }
        xhr.onerror = () => {
            reject(xhr.response)
        }
    })
}

function confirmMember(user,comand){
    const requestURL = 'http://localhost:5000/api/admin/confirmMember'
    let token = localStorage.getItem('token')
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', requestURL)
        xhr.responseType = 'json'
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        const body = {
            userId: user,
            comandId: comand
        }
        xhr.send(JSON.stringify(body))
        xhr.onload = () => {
            document.getElementById('body').innerHTML=''
            let roomName = 'Comands infromation'
            let message = `Пользователь с id ${user} был принят в команду ${comand}`
            socket.emit("SEND_ROOM_MESSAGE",{roomName, message})
            getQueue()
        }
        xhr.onerror = () => {
            reject(xhr.response)
        }
    })
}

function declineMember(user,comand) {
    const requestURL = 'http://localhost:5000/api/admin/declineByManager'
    let token = localStorage.getItem('token')
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('DELETE', requestURL)
        xhr.responseType = 'json'
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        const body = {
            userId: user
        }
        xhr.send(JSON.stringify(body))
        xhr.onload = () => {
            document.getElementById('body').innerHTML = ''
            let roomName = 'Comands infromation'
            let message = `Запрос пользователя с id ${user} на вступ в команду ${comand} был отклонен`
            socket.emit("SEND_ROOM_MESSAGE",{roomName, message})
            getQueue()
        }
        xhr.onerror = () => {
            reject(xhr.response)
        }
    })
}