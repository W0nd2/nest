function allMembers() {
    if (!localStorage.token) {
        window.location.pathname = 'api/render/login'
    }
    let token = localStorage.getItem('token')

    const requestURL = 'http://localhost:5000/api/user/allMembers'

    let element = document.getElementById("team");

    return new Promise((resolve, reject) => {

        let element = document.getElementById('comands')

        const xhr = new XMLHttpRequest()

        xhr.open('GET', requestURL)

        xhr.setRequestHeader("Authorization", `Bearer ${token}`);

        xhr.send()

        xhr.onload = () => {
            let res = JSON.parse(xhr.response)
            let firstComand = document.getElementById('firstComand-members');
            let secondComand = document.getElementById('secondComand-members');
            
            for (let index = 0; index < res.teams.length; index++) {
                for (let userIndex = 0; userIndex < res.teams[index].users.length; userIndex++) {
                    let newMember = `
                    
                        <span>${res.teams[index].users[userIndex].email}</span>
                    
                    `
                    if (res.teams[index].comandName == '111') {
                        const member = document.createElement('div')
                        member.innerHTML = newMember
                        firstComand.appendChild(member)
                    }
                    else {
                        const member = document.createElement('div')
                        member.innerHTML = newMember
                        secondComand.appendChild(member)
                    }
                    
                }
                
            }
        }
        xhr.onerror = () => {
            reject(xhr.response)
        }
    })
}


function joinTeam(teamId){
    const requestURL = 'http://localhost:5000/api/user/newTeamMember'

    let token = localStorage.getItem('token')
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open('POST', requestURL)

        xhr.responseType = 'json'

        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);

        const body = {
            comandId: teamId
        }
        xhr.send(JSON.stringify(body))

        xhr.onload = () => {
            if (xhr.response.token != undefined) {
                localStorage.clear()
                localStorage.setItem('token', xhr.response.token)
                window.location.pathname = '/client/index.html'
            }
            const roomName = 'Comands infromation'
            const userRole = localStorage.getItem('role')
            const message = `${userRole} присоеденисля к комнате ${roomName}, ожидает подтверждения на принятие в комaнду c ID: ${teamId}`
            
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
            //     socket.emit("CREATE_OR_JOIN_ROOM", ({roomName, userRole }));
            // });

            // socket.on("JOINED_ROOM", (value)=>{
            //     alert(value)
            // })
        
            // socket.emit("SEND_ROOM_MESSAGE",{roomName, message})
        
            // socket.on("ROOM_MESSAGE",(message)=>{
            //     alert(message)
            // })
        }

        xhr.onerror = () => {
            reject(xhr.response)
        }
    })
}