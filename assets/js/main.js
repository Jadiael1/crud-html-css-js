window.onload = async () => {
    // get fake person
    const btnGenerateFakePerson = document.querySelector("#generateFakePerson");
    btnGenerateFakePerson.addEventListener("click", async evt => {
        evt.preventDefault();
        const cname = document.querySelector("#cname");
        const csurname = document.querySelector("#csurname");
        const cbirthday = document.querySelector("#cbirthday");
        const cemail = document.querySelector("#cemail");
        const cuser = document.querySelector("#cuser");
        const cpassword = document.querySelector("#cpassword");
        try {
            const fakePerson = await getFakePerson();
            cname.value = fakePerson.ADDRESS.Name.split(" ")[0];
            csurname.value = fakePerson.ADDRESS.Name.split(" ")[1];
            cbirthday.value = new Date(fakePerson.BIRTHDAY.Birthday).toISOString().slice(0, 10);
            cemail.value = fakePerson.ONLINE["Email Address"];
            cuser.value = fakePerson.ONLINE.Username;
            cpassword.value = fakePerson.ONLINE.Password;
        } catch (error) {
            alert("Erro ao obter personagem de teste.");
        }
    });

    // create a new user
    const formCreateUser = document.querySelector("#creation-form");
    formCreateUser.addEventListener("submit", async evt => {
        evt.preventDefault();
        const formData = new FormData(formCreateUser);
        const userObj = Array.from(formData.entries()).reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
        try {
            const isCreated = await createUser(userObj.name, userObj.surname, userObj.birthday, userObj.email, userObj.user, userObj.password);
            if (!isCreated.status) alert("Erro ao criar usuario.");
            formCreateUser.reset();

            // add new user in table
            const tableUsers = document.querySelector(".table tbody");
            const newTrEl = document.createElement("tr");
            const newTrRaw = `<tr><td>${userObj.name}</td><td>${userObj.surname}</td><td>${userObj.birthday}</td><td>${userObj.email}</td><td>${userObj.user}</td><td>${userObj.password}</td><td><button id="openModal" location="table">Editar</button><button uid="${isCreated.data._id}" location="table">Deletar</button></td></tr>`;
            newTrEl.innerHTML = newTrRaw;
            tableUsers.appendChild(newTrEl);
            const divTable = document.querySelector(".div-table");
            const newDiv = document.createElement("div");
            newDiv.classList.add("row");
            const divTableRaw = `<div class="card"><div class="title">Name:</div><div class="value">${userObj.name}</div></div><div class="card"><div class="title">Surname:</div><div class="value">${userObj.surname}</div></div><div class="card"><div class="title">Birtdday:</div><div class="value">${userObj.birthday}</div></div><div class="card"><div class="title">E-mail:</div><div class="value">${userObj.email}</div></div><div class="card"><div class="title">User:</div><div class="value">${userObj.user}</div></div><div class="card"><div class="title">Password:</div><div class="value">${userObj.password}</div></div><div class="card"><div class="title">Actions: </div><div class="value"><button id="openModal" location="div-table">Editar</button><button uid="${isCreated.data._id}" location="div-table">Deletar</button></div></div>`;
            newDiv.innerHTML = divTableRaw;
            divTable.appendChild(newDiv);

            // reset event btn delete user
            const btnDeleteUser = document.querySelectorAll(".table tbody tr td:last-child button:last-child");
            const btnDeleteUser2 = document.querySelectorAll(".card .value button:last-child");

            btnDeleteUser.forEach((el) => {
                el.removeEventListener("click", addEvtBtnDeleteUser);
                el.addEventListener("click", addEvtBtnDeleteUser);
            });
            btnDeleteUser2.forEach((el) => {
                el.removeEventListener("click", addEvtBtnDeleteUser);
                el.addEventListener("click", addEvtBtnDeleteUser);
            });

            // reset event btn edit user
            const openModalBtn = document.querySelectorAll('#openModal');
            const openModalBtn2 = document.querySelectorAll(".card .value button:last-child");
            openModalBtn.forEach((el) => {
                el.removeEventListener("click", editBtn);
                el.addEventListener("click", editBtn);
            });

            openModalBtn2.forEach((el) => {
                el.removeEventListener("click", editBtn);
                el.addEventListener("click", editBtn);
            });


            alert(`Usuario criado com sucesso`);
        } catch (error) {
            await detectEndpoint(true);
            alert("Erro ao criar novo usuario.");
        }

    });

    // get users
    const tableUsers = document.querySelector(".table tbody");
    const divTable = document.querySelector(".div-table");
    const endpoint = sessionStorage.getItem("endpoint");
    if (typeof endpoint !== 'undefined' && endpoint !== null && endpoint.length > 0) {
        try {
            const users = await getUsers();
            const tableRaw = users.map(user => `<tr><td>${user.name}</td><td>${user.surname}</td><td>${user.birthday}</td><td>${user.email}</td><td>${user.user}</td><td>${user.password}</td><td><button id="openModal" location="table">Editar</button><button uid="${user._id}" location="table">Deletar</button></td></tr>`).join("");
            tableUsers.innerHTML = `${tableRaw}`;
            const divTableRaw = users.map(user => `<div class="row"><div class="card"><div class="title">Name:</div><div class="value">${user.name}</div></div><div class="card"><div class="title">Surname:</div><div class="value">${user.surname}</div></div><div class="card"><div class="title">Birtdday:</div><div class="value">${user.birthday}</div></div><div class="card"><div class="title">E-mail:</div><div class="value">${user.email}</div></div><div class="card"><div class="title">User:</div><div class="value">${user.user}</div></div><div class="card"><div class="title">Password:</div><div class="value">${user.password}</div></div><div class="card"><div class="title">Actions: </div><div class="value"><button id="openModal" location="div-table">Editar</button><button uid="${user._id}" location="div-table">Deletar</button></div></div></div>`).join("");
            divTable.innerHTML = `${divTableRaw}`;
        } catch (error) {
            alert("Erro ao recuperar dados de usuarios.");
        }
    } else {
        await detectEndpoint(true);
    }

    // delete user by ID
    const btnDeleteUser = document.querySelectorAll(".table tbody tr td:last-child button:last-child");
    const btnDeleteUser2 = document.querySelectorAll(".card .value button:last-child");
    btnDeleteUser.forEach((el) => {
        el.addEventListener("click", addEvtBtnDeleteUser);
    });
    btnDeleteUser2.forEach((el) => {
        el.addEventListener("click", addEvtBtnDeleteUser);
    });
    async function addEvtBtnDeleteUser(evt) {
        evt.preventDefault();
        if (confirm("Aviso de segurança:\nDeseja remover este usuario?")) {
            const uid = evt.target.getAttribute('uid');
            const location = evt.target.getAttribute('location');
            try {
                await deleteUser(uid);
                location == "table" ? evt.target.parentNode.parentNode.style.display = "none" : evt.target.parentNode.parentNode.parentNode.style.display = "none"
                alert("Usuario removido com sucesso.");
            } catch (error) {
                await detectEndpoint(true);
                alert("Erro ao remover usuario.");
            }
        }
    }

    // add modal functionality to the edit user button and a form that auto-populates with the data of the user who was triggered for editing 
    const openModalBtn = document.querySelectorAll('#openModal');
    const modal = document.getElementById('myModal');
    const closeModalBtn = document.querySelector('.close');
    openModalBtn.forEach(el => {
        el.addEventListener("click", editBtn);
    });
    async function editBtn(evt) {
        const uname = document.querySelector("#uname");
        const usurname = document.querySelector("#usurname");
        const ubirthday = document.querySelector("#ubirthday");
        const uemail = document.querySelector("#uemail");
        const uuser = document.querySelector("#uuser");
        const upassword = document.querySelector("#upassword");
        const u_id = document.querySelector("#_id");

        if (evt.target.getAttribute("location") == "table") {
            const person = {
                "name": evt.target.parentNode.parentNode.querySelectorAll("td")[0].textContent,
                "surname": evt.target.parentNode.parentNode.querySelectorAll("td")[1].textContent,
                "birthday": evt.target.parentNode.parentNode.querySelectorAll("td")[2].textContent,
                "email": evt.target.parentNode.parentNode.querySelectorAll("td")[3].textContent,
                "user": evt.target.parentNode.parentNode.querySelectorAll("td")[4].textContent,
                "password": evt.target.parentNode.parentNode.querySelectorAll("td")[5].textContent,
                "_id": evt.target.parentNode.parentNode.querySelectorAll("td")[6].querySelectorAll("button")[1].getAttribute("uid")
            }
            uname.value = person.name;
            usurname.value = person.surname;
            ubirthday.value = person.birthday;
            uemail.value = person.email;
            uuser.value = person.user;
            upassword.value = person.password;
            u_id.value = person._id;
            modal.style.display = 'block';
        } else {
            const person = {
                "name": evt.target.parentNode.parentNode.parentNode.querySelectorAll(".card")[0].querySelector(".value").textContent,
                "surname": evt.target.parentNode.parentNode.parentNode.querySelectorAll(".card")[1].querySelector(".value").textContent,
                "birthday": evt.target.parentNode.parentNode.parentNode.querySelectorAll(".card")[2].querySelector(".value").textContent,
                "email": evt.target.parentNode.parentNode.parentNode.querySelectorAll(".card")[3].querySelector(".value").textContent,
                "user": evt.target.parentNode.parentNode.parentNode.querySelectorAll(".card")[4].querySelector(".value").textContent,
                "password": evt.target.parentNode.parentNode.parentNode.querySelectorAll(".card")[5].querySelector(".value").textContent,
                "_id": evt.target.parentNode.parentNode.parentNode.querySelectorAll(".card button")[1].getAttribute("uid")
            }
            uname.value = person.name;
            usurname.value = person.surname;
            ubirthday.value = person.birthday;
            uemail.value = person.email;
            uuser.value = person.user;
            upassword.value = person.password;
            u_id.value = person._id;
            modal.style.display = 'block';
        }
    }
    closeModalBtn.addEventListener('click', () => {
        const updateForm = document.getElementById('update-form');
        updateForm.reset();
        modal.style.display = 'none';
    });
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            const updateForm = document.getElementById('update-form');
            updateForm.reset();
            modal.style.display = 'none';
        }
    });
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            const updateForm = document.getElementById('update-form');
            updateForm.reset();
            modal.style.display = 'none';
        }
    });

    // edit user by id
    const updateForm = document.getElementById('update-form');
    updateForm.addEventListener("submit", async evt => {
        evt.preventDefault();
        const formData = new FormData(updateForm);
        const userObj = Array.from(formData.entries()).reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
        try {
            const isUpdated = await updateUser(userObj.name, userObj.surname, userObj.birthday, userObj.email, userObj.user, userObj.password, userObj._id);
            if (!isUpdated.status) alert("Erro ao atualizar usuario.");
            updateForm.reset();
            updateForm.parentNode.parentNode.style.display = 'none';
            // refresh in div-table
            document.querySelectorAll(".div-table>.row").forEach(el => {
                if (el.querySelector(".value>button:last-child").getAttribute("uid") == userObj._id) {
                    el.querySelectorAll(".value")[0].textContent = isUpdated.data.name;
                    el.querySelectorAll(".value")[1].textContent = isUpdated.data.surname;
                    el.querySelectorAll(".value")[2].textContent = isUpdated.data.birthday;
                    el.querySelectorAll(".value")[3].textContent = isUpdated.data.email;
                    el.querySelectorAll(".value")[4].textContent = isUpdated.data.user;
                    el.querySelectorAll(".value")[5].textContent = isUpdated.data.password;
                }
            });
            // refresh in table
            document.querySelectorAll(".table tbody tr").forEach(el => {
                if (el.querySelector("td:last-child button:last-child").getAttribute("uid") == userObj._id) {
                    el.querySelectorAll("td")[0].textContent = isUpdated.data.name;
                    el.querySelectorAll("td")[1].textContent = isUpdated.data.surname;
                    el.querySelectorAll("td")[2].textContent = isUpdated.data.birthday;
                    el.querySelectorAll("td")[3].textContent = isUpdated.data.email;
                    el.querySelectorAll("td")[4].textContent = isUpdated.data.user;
                    el.querySelectorAll("td")[5].textContent = isUpdated.data.password;
                }
            });
            alert("Atualizado com sucesso.");
        } catch (error) {
            alert("Erro ao atualizar usuario.");
        }
    });
}