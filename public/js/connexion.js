let form = document.getElementById('form');
let inputEmail = document.getElementById('input-email');
let inputPassword= document.getElementById('input-password');


form.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log("ok");

    let data = {
        email: inputEmail.value,
        password: inputPassword.value
    };

    let response = await fetch('/connexion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    if (response.ok) {
        window.location.replace('/');
    }
});

