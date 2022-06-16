let form = document.getElementById('form');
let inputEmail = document.getElementById('input-email');
let inputPassword = document.getElementById('input-password');
let inputName= document.getElementById('input-name');

console.log("ok");

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    

    let data = {
        email: inputEmail.value,
        password: inputPassword.value,
        name: inputName.value
    };

    let response = await fetch('/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        window.location.replace('/connexion');
    }
});
