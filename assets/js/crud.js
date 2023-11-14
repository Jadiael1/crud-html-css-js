const detectEndpoint = async (force = false) => {
    const endpoint = sessionStorage.getItem("endpoint");
    if (!endpoint || force) {
        const myHeaders = new Headers();
        myHeaders.append("accept-language", "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,ru;q=0.6");
        myHeaders.append("cache-control", "no-cache");
        myHeaders.append("pragma", "no-cache");
        myHeaders.append("user-agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36");
        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        try {
            const htmlResponse = await fetch("https://cors-anywhere.herokuapp.com/https://crudcrud.com/", requestOptions).then(response => response.text());
            const tempElement = document.createElement('div');
            tempElement.innerHTML = htmlResponse;
            const newEndpoint = tempElement.querySelector(".endpoint-url").textContent.replaceAll(/\s|https\:\/\/crudcrud\.com\/api\//g, "");
            sessionStorage.setItem("endpoint", newEndpoint);
        } catch (error) {
            sessionStorage.setItem("endpoint", "");
            alert("erro ao obter conexão com a API");
        }
    }
}
detectEndpoint();

const getUsers = async () => {
    const endpoint = sessionStorage.getItem("endpoint");
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    const users = await fetch(`https://crudcrud.com/api/${endpoint}/users`, requestOptions).then(response => response.json());
    return users;
}

const createUser = async (name = "", surname = "", birthday = "", email = "", user = "", password = "") => {
    const endpoint = sessionStorage.getItem("endpoint");
    const someEmptyParam = [name, surname, birthday, email, user, password].some(param => param === "");
    if (someEmptyParam) {
        return { "status": false, "data": {}, "message": { "error": "Some empty parameter", "message": "" } };
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
        "name": name,
        "surname": surname,
        "birthday": birthday,
        "email": email,
        "user": user,
        "password": password
    });
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    const response = await fetch(`https://crudcrud.com/api/${endpoint}/users`, requestOptions).then(response => response.json());
    return { "status": true, "data": response, "message": { "error": "", "message": "user created successfully" } };
}

const deleteUser = async (userId = "") => {
    const endpoint = sessionStorage.getItem("endpoint");
    if (userId === "") {
        return { "status": false, "data": {}, "message": { "error": "Some empty parameter", "message": "" } };
    }
    const requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
    };
    const req = await fetch(`https://crudcrud.com/api/${endpoint}/users/${userId}`, requestOptions);
    if (req.status !== 200) {
        return { "status": false, "data": {}, "message": { "error": "unknown error when deleting user", "message": "" } };
    }
    return { "status": true, "data": {}, "message": { "error": "", "message": "user successfully deleted" } };
}

const updateUser = async (name = "", surname = "", birthday = "", email = "", user = "", password = "", _id = "") => {
    const endpoint = sessionStorage.getItem("endpoint");
    const someEmptyParam = [name, surname, birthday, email, user, password, _id].some(param => param === "");

    if (someEmptyParam) {
        return { "status": false, "data": {}, "message": { "error": "Some empty parameter", "message": "" } };
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
        "name": name,
        "surname": surname,
        "birthday": birthday,
        "email": email,
        "user": user,
        "password": password
    });
    const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    const req = await fetch(`https://crudcrud.com/api/${endpoint}/users/${_id}`, requestOptions);
    if (req.status !== 200) {
        return { "status": false, "data": {}, "message": { "error": "unknown error when deleting user", "message": "" } };
    }
    return { "status": true, "data": {name, surname, birthday, email, user, password, _id}, "message": { "error": "", "message": "user created successfully" } };
}