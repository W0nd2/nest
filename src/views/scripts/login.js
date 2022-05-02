function loginUser(){
    //мыло, пароль
    let lgEmail = document.getElementById('login-email').value
    let lgPassword = document.getElementById('login-password').value

    //ссылка на бек с логином
    const requestURL = 'http://localhost:5000/api/auth/login'

    //сделать запись токена в локал сторедж или куки
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open('POST', requestURL)

        xhr.responseType = 'json'

        xhr.setRequestHeader("Content-type", "application/json");

        const body = {
            email: lgEmail,
            password: lgPassword
        }
        xhr.send(JSON.stringify(body))

        xhr.onload = () => {
            if (xhr.response.token != undefined) {
                localStorage.clear()
                localStorage.setItem('token', xhr.response.token)
                localStorage.setItem('role', xhr.response.role)
                window.location.pathname = '/src/views/index.html'
            }
        }
        xhr.onerror = () => {
            reject(xhr.response)
        }
    })

}

function resetPass(){
    let reqEmail = document.getElementById('login-email').value
    const requestURL = 'http://localhost:5000/api/user/password/change'

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open('POST', requestURL)

        xhr.responseType = 'json'

        xhr.setRequestHeader("Content-type", "application/json");

        const body = {
            email: reqEmail
        }


        xhr.send(JSON.stringify(body))

        xhr.onload = () => {
        }

        xhr.onerror = () => {
            reject(xhr.response)
        }
    })
}