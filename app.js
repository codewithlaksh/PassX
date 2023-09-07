let addBtn = document.getElementById('add');
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
    document.getElementById('userForm').reset();
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
                    <td><a href="${obj.website}">${obj.website}</a></td>
                    <td>
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
            
            Array.from(document.querySelectorAll('button.delete')).forEach(element => {
                element.addEventListener('click', (e) => {
                    const ind = e.target.dataset.ind;
                    deletePassword(ind);
                    getData();
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
    
        if (!d) {
            userObj.push({
                username: username.value,
                password: password.value,
                website: website.value
            })
            localStorage.setItem('passX', JSON.stringify(userObj));
            getData();
            resetFormData();
        } else {
            // alert("This data is already present!")
            if (window.confirm("This user's data already exists! Do you want to update the record ?")) {
                const ind = userObj.findIndex(e => {
                    return e.username === username.value;
                })
                userObj[ind].password = password.value;
                userObj[ind].website = website.value;
                localStorage.setItem('passX', JSON.stringify(userObj));
                getData();
                resetFormData();
            }
        }
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

clearBtn.addEventListener('click', () => {
    localStorage.removeItem('passX');
    getData();
})
