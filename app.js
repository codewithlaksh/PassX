let addBtn = document.getElementById('add');
let updateBtn = document.getElementById('update');
let clearBtn = document.getElementById('clear');
let data = {};
let userObj = [];

const maskPassword = (password) => {
    let str = "";
    for (let i = 0; i < password.length; i++) {
        str += "•";
    }
    return str;
}

const resetFormData = () => {
    document.getElementById('userAddForm').reset();
}

const getData = () => {
    const u = localStorage.getItem('passX');

    if (u == null) {
        userObj = [];
        document.getElementsByClassName('table')[0].style.display = 'none';
        clearBtn.style.display = 'none';
    } else {
        userObj = JSON.parse(u);

        if (userObj.length == 0) {
        userObj = [];
        document.getElementsByClassName('table')[0].style.display = 'none';
        clearBtn.style.display = 'none';
        } else {
            document.getElementsByClassName('table')[0].style.display = '';
            clearBtn.style.display = 'block';
            document.getElementById('tbody').innerHTML = userObj.map((obj, index) => {
                return `<tr>
                    <td>${index+1}</td>
                    <td>${obj.username}</td>
                    <td>${maskPassword(obj.password)}</td>
                    <td><a href="${obj.website}" target="_blank">${obj.website}</a></td>
                    <td>
                        <button class="action--btn edit" data-ind="${index}">Edit</button>
                        <button class="action--btn copy" data-ind="${index}">Copy</button>
                        <button class="action--btn delete" data-ind="${index}">Delete</button>
                    </td>
                </tr>`
            }).join('');
            
            Array.from(document.querySelectorAll('button.copy')).forEach(element => {
                element.addEventListener('click', (e) => {
                    const ind = e.target.dataset.ind;
                    copyPassword(ind);
                    e.target.innerHTML = 'Copied!';
                    
                    setTimeout(() => {
                        e.target.innerHTML = 'Copy';
                    }, 2000);
                })
            })

            Array.from(document.querySelectorAll('button.edit')).forEach(element => {
                element.addEventListener('click', (e) => {
                    const ind = e.target.dataset.ind;
                    const user = userObj[ind];

                    toggleEditModal(ind, user.password, user.website);
                })
            })
            
            Array.from(document.querySelectorAll('button.delete')).forEach(element => {
                element.addEventListener('click', (e) => {
                    const ind = e.target.dataset.ind;
                    if (window.confirm(`Do you want to delete ${userObj[ind].username}'s data ?`)) {
                        deletePassword(ind);
                        getData();
                    }
                })
            })
        }
    }
}

getData();

const addPassword = () => {
    let username = document.getElementById('username');
    let password = document.getElementById('password');
    let website = document.getElementById('website');

    if (username.value === "" || password.value === "" || website.value === "") {
        alert("Please fill up your details!")
    } else {
        const d = userObj.find(e => {
            return e.username === username.value
        });
    
        if (!d || d.website != website.value) {
            userObj.push({
                username: username.value,
                password: password.value,
                website: website.value
            })
            localStorage.setItem('passX', JSON.stringify(userObj));
            getData();
            resetFormData();
        } else {
            alert("This data is already exists!")
        }
    }
}

const updatePassword = () => {
    let userID = document.getElementById('userID');
    let password = document.getElementById('passwordEdit');
    let website = document.getElementById('websiteEdit');

    if (password.value === "" || website.value === "") {
        alert("Please fill up your details!")
    } else {
        userObj[userID.value].password = password.value;
        userObj[userID.value].website = website.value;

        localStorage.setItem('passX', JSON.stringify(userObj));
    }
}

const copyPassword = (ind) => {
    const userPass = userObj[ind]['password'];
    navigator.clipboard.writeText(userPass);
}

const deletePassword = (ind) => {
    userObj.splice(ind, 1);
    localStorage.setItem('passX', JSON.stringify(userObj));
}

addBtn.addEventListener('click', () => {
    addPassword();
})

updateBtn.addEventListener('click', () => {
    updatePassword();
    let userIdEdit = document.getElementById('userID');
    document.getElementById('userEditForm').reset();
    userIdEdit.value = "";

    editModal.style.display = 'none';
    getData();
})

clearBtn.addEventListener('click', () => {
    if (window.confirm('Do you want to clear all users data ?')) {
        localStorage.removeItem('passX');
        getData();
    }
})

// Modal handlers
let editModal = document.getElementById('modal');
let closeBtn = document.getElementById('closeBtn');

const toggleEditModal = (userID, password, website) => {
    let userIdEdit = document.getElementById('userID');
    let websiteEdit = document.getElementById('websiteEdit');

    userIdEdit.value = userID;
    passwordEdit.value = password;
    websiteEdit.value = website;
    editModal.style.display = 'block';
}

closeBtn.addEventListener('click', () => {
    let userIdEdit = document.getElementById('userID');
    document.getElementById('userEditForm').reset();
    userIdEdit.value = "";

    editModal.style.display = 'none';
})
