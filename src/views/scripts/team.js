function teamMembers() {
    let token = localStorage.getItem('token')
    let element = document.getElementById("team");
    let comandId = document.getElementById("comandId").value
    const requestURL = `http://localhost:5000/api/user/teamMembers?comandId=${comandId}`
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', requestURL)
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send()
        xhr.onload = () => {
            let res = JSON.parse(xhr.response)
            if (res.length == 0) {
                const resultHTML = `
                <div class="member" >
                    <span id="member-id">Вы не состоите в команде</span>
                </div>
                `;
                const newDiv = document.createElement("div");
                newDiv.innerHTML = resultHTML;
                element.appendChild(newDiv);
            }
            else {
                for (let index = 0; index < res.team.length; index++) {
                    for (let userIndex = 0; userIndex < res.team[index].users.length; userIndex++) {
                        const resultHTML = `
                            <div class="member" >
                                <span id="member-id">userId: ${res.team[index].users[userIndex].email}</span>
                            </div>
                        `;
                        const newDiv = document.createElement("div");
                        newDiv.innerHTML = resultHTML;
                        element.appendChild(newDiv);
                    }
                }
            }
        }
        xhr.onerror = () => {
            reject(xhr.response)
        }
    })
}