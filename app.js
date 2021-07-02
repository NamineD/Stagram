
// Link
const lnkPost = document.querySelector('#lnkPost')
const lnkLogOut = document.querySelector('#lnkLogOut')
const lnkLogIn = document.querySelector('#lnkLogIn')
const lnkSignUp = document.querySelector('#lnkSignUp')

// Sections
const sectionLogIn = document.querySelector('#login')
const sectionSignUp = document.querySelector('#signup')
const sectionPost = document.querySelector('#post')

// Buttons
let btnLogIn = document.querySelector('#btnLogIn')
let btnSignUp = document.querySelector('#btnSignUp')
let btnPostSelfie = document.querySelector('#btnPostSelfie')

// Selector de archivos
let selectedFile;
const fileSelector = document.querySelector('input[type=file')
//console.log(fileSelector);
let selfie = document.querySelector('#selfie')
let selfieImage = document.querySelector('#selfieImage')
let filter = document.querySelector('#filter')
filter.addEventListener('change', ()=>{
    selfieImage.style.filter = filter.value
})

fileSelector.addEventListener('change', ()=>{
    let reader = new FileReader();
    reader.addEventListener('load', (e)=>{
        selfie.style.display = 'block'
        selfieImage.src = e.target.result
    })
    reader.readAsDataURL(fileSelector.files[0]);
    selectedFile = fileSelector.files[0];
})

const clearSecctions = () => {
    let sections = document.querySelectorAll('main>section')
    for(let section of sections){
        section.style.display = 'none'
    }
    let timeline = document.querySelector('#timeline')
    timeline.style.display = 'block'
}

const activateLoggedIn = () =>{
    document.querySelector('#loggedIn').style.display = 'block';
    document.querySelector('#loggedOut').style.display = 'none';
    updateTimeLine()
}

const activateLoggedOut = () =>{
    document.querySelector('#loggedIn').style.display = 'none';
    document.querySelector('#loggedOut').style.display = 'block';
}

let user = firebase.auth().currentUser
if(user){
    activateLoggedIn()
} else {
    activateLoggedOut()
}

lnkPost.addEventListener('click', () => {
    //console.log(lnkPost)
    clearSecctions();
    sectionPost.style.display = 'block';
})

lnkLogOut.addEventListener('click', () => {
    //console.log(lnkLogOut)
    firebase.auth().signOut()
    activateLoggedOut();
})

lnkLogIn.addEventListener('click', () => {
    //console.log(lnkLogIn)
    clearSecctions();
    sectionLogIn.style.display = 'block';
})

lnkSignUp.addEventListener('click', () => {
    //console.log(lnkSignUp)
    clearSecctions();
    sectionSignUp.style.display = 'block';
})


btnLogIn.addEventListener('click', () => {
    // codigo de logueo
    //console.log('Login');
    let email = document.querySelector('#emailLogin').value
    let pass = document.querySelector('#passLogin').value
    if(email.length<6 || pass.length<6){
        swal('Login invalido')
    } else {
        firebase.auth().signInWithEmailAndPassword(email, pass)
            .then(()=> {
                console.log("ingreso");
                activateLoggedIn();
                clearSecctions();
            })
            .catch( err => console.log(err))
    }
})

btnSignUp.addEventListener('click', () => {
    // codigo de registro
    //console.log('Registrar');
    let name = document.querySelector('#name').value 
    let email = document.querySelector('#email').value
    let pass = document.querySelector('#pass').value 
    let pass2 = document.querySelector('#pass2').value 
    if(name.length < 3 || email.length < 6 || pass.length < 6){
        swal("Los campos no cumplen los requisitos")
    } else {
        if(pass != pass2){
            swal("Las contrasenias no coinciden")
        } else {
            // Registrarse
            firebase.auth().createUserWithEmailAndPassword(email, pass)
                .then( ()=> {
                    swal("Usuario Registrado")
                    clearSecctions()
                    activateLoggedIn()
                    let user = firebase.auth().currentUser
                    user.updateProfile({
                        displayName: name
                    })
                })
                .catch( err => console.log(err));
        }
    }
})

btnPostSelfie.addEventListener('click', () => {
    // codigo de logueo
    //console.log('Posteo selfie');
    let ref = firebase.storage().ref()
    let fileName = Math.random().toString(36).substring(2);

    var imageRef = ref.child(`photos/${fileName}.jpg`)
    imageRef.put(selectedFile)
        .then(()=>{
            let filterValue = document.querySelector('#filter').value 
            let db = firebase.database().ref('pwastagram')
            let object = db.push()
            object.set({
                path: `photos/${fileName}.jpg`,
                user: firebase.auth().currentUser.displayName,
                filter: filterValue
            })
            swal('Posted selfie')
            clearSecctions()
            
        })
        .catch(err = console.log(err))
})

function updateTimeLine(){
    let ul = document.querySelector('#timeline ul')
    ul.innerHTML = '';

    let db = firebase.database().ref('pwastagram')
    let list = db.limitToLast(100)
    list.on('child_added', (child) =>{
        let photo = child.val()

        let storageRef = firebase.storage().ref()
        let imgRef = storageRef.child(photo.path)
        imgRef.getDownloadURL()
            .then( (url) =>{
                let li = `
                    <li>
                        <figure>
                            <img src='${url}' width='100%' alt='MyPicture' style='filter: ${photo.filter}' >
                            <figcaption> De ${photo.user} </figcaption>
                        </figure>
                    </li>
                `
                ul.innerHTML += li
            })
    })
}


