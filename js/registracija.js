// VALIDACIJA - ako je unos dobar, vraca boolean true
// Email
function checkEmail(id) {
    var user_email = id;

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!$(user_email).val().match(emailPattern)) {
        $(user_email).next().removeClass('hide');
    } else {
        $(user_email).next().addClass('hide')
        return true
    }
}

// Ime
function checkName(id) {
    var user_name = id;
    if (!$(user_name).val().length > 0) {
        $(user_name).next().removeClass('hide');
    } else {
        $(user_name).next().addClass('hide')
        return true
    }
}

// Prezime
function checkSurname(id) {
    var user_lastname = id;
    if (!$(user_lastname).val().length > 0) {
        $(user_lastname).next().removeClass('hide');
    } else {
        $(user_lastname).next().addClass('hide')
        return true
    }
}

// Lozinka - proverava da li je unos dobar i da li se lozinke poklapaju
function checkPassword() {

    if (
        ($('#password').val().match(/[a-z]/) || $('#password').val().match(/[A-Z]/)) &&
        $('#password').val().match(/([0-9])/) &&
        $('#password').val().length > 5

    ) {

        $('#password').next().addClass('hide');

        if ($('#password').val() !== $('#confirm-password').val()) {
            $('#confirm-password').next().removeClass('hide');
        } else {
            $('#confirm-password').next().addClass('hide')
            return true
        }

    } else {
        $('#password').next().removeClass('hide');
    }
}

// Rodjendan
function checkBirthday() {
    var counter = 0
    var selektovi = document.querySelectorAll('.rodjendan select')
    selektovi.forEach(selekt => {
        if (selekt.value == '') counter++

    })
    console.log(counter)
    if (counter == 0) {
        $('.rodjendan .error-poruka').addClass('hide');
        return true
    } else {
        $('.rodjendan .error-poruka').removeClass('hide');
    }

}

// Pol
function checkGender() {
    if (document.querySelectorAll('.pol input:checked').length == 0) {
        $('.pol .error-poruka').removeClass('hide');
    } else {
        $('.pol .error-poruka').addClass('hide');
        return true
    }
}

// Saglasnost
function checkTerms() {
    if (document.querySelectorAll('.saglasnosti input[name="uslovi"]:checked').length == 0) {
        $('.saglasnosti .error-poruka').removeClass('hide');
    } else {
        $('.saglasnosti .error-poruka').addClass('hide');
        return true
    }
}

// API KOMUNIKACIJA SA BAZOM
// Proverava da li mejl vec postoji u bazi
async function proveriMejl(mejl, password) {
    var user_email = mejl
    var user_password = password
   
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", "Basic dGVzdHVzZXI6ZGFkYXN1cHJlbWU=");
    
    var urlencoded = new URLSearchParams();
    
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        //   mode: 'no-cors',
        // body: urlencoded,
        redirect: 'follow'
    };
    
    var request = 'https://development.sales-snap.com/api/contacts?search=' + user_email
    
    fetch(request, requestOptions)
    .then(response => response.text())
    .then(result => {
        var json_objekat = result
        var objekat = JSON.parse(result);
                
        if(objekat.total > 0) {
            console.log('Ovaj mejl je zauzet!')
            $('#zauzet-mejl').removeClass('hide')
            $('.backdrop').addClass('hide')
        } else {
            console.log('NEMA KORISNIKA!')
            $('#zauzet-mejl').addClass('hide')
            
            console.log('Ime: ' + $('#ime').val())
            console.log('Prezime: ' + $('#prezime').val())
            console.log('Email: ' + user_email)
            console.log('Password: ' + user_password)
            console.log('Rodjendan: ' + $('#rodjendan_dan').val() + '-' + $('#rodjendan_mesec').val() + '-' + $('#rodjendan_godina').val())
            console.log('Pol: ' + $('.pol input:checked').val())
            console.log('Saglasnost Uslovi: ' + $('.saglasnosti [name="uslovi"]').is(':checked'))
            console.log('Saglasnost Promo poruke: ' + $('.saglasnosti [name="promo"]').is(':checked'))
            console.log('Saglasnost Personalizovana ponuda: ' + $('.saglasnosti [name="personalizovana_ponuda"]').is(':checked'))

            upisiNovogKorisnika(
                                $('#ime').val(),
                                $('#prezime').val(),
                                user_email, 
                                user_password,
                                $('#rodjendan_dan').val() + '-' + $('#rodjendan_mesec').val() + '-' + $('#rodjendan_godina').val(),
                                $('.pol input:checked').val(),
                                $('.saglasnosti [name="uslovi"]').is(':checked'),
                                $('.saglasnosti [name="promo"]').is(':checked'),
                                $('.saglasnosti [name="personalizovana_ponuda"]').is(':checked')
                                )
        }


    })
    .catch(error => console.log('error', error));
    
}


// Upisivanje novog korisnika u bazu (uslovi: ime, prezime, email, lozinka, datum rodjenja, pol, saglasnosti)
async function upisiNovogKorisnika(name, surname, email, password, rodjendan, pol, saglasnost_uslovi, saglasnost_promo, saglasnost_ponuda) {

    var user_name = name
    var user_surname = surname
    var email_korisnika = email
    var contact_ip = ''
    var password_korisnika = password
    var rodjendan_korisnika = rodjendan
    var pol_korisnika = pol
    var saglasnost_uslovi = saglasnost_uslovi
    var saglasnost_promo = saglasnost_promo
    var saglasnost_ponuda = saglasnost_ponuda


    var myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", "Basic dGVzdHVzZXI6ZGFkYXN1cHJlbWU=");

    var urlencoded = new URLSearchParams();




    // IP FETCHER
    fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {

        contact_ip = data.ip
        
        urlencoded.append("ipAddress", contact_ip);
        urlencoded.append('firstname', user_name)
        urlencoded.append('lastname', user_surname)
        urlencoded.append('email', email_korisnika)
        urlencoded.append('loyalty_user_password', password_korisnika)
        urlencoded.append('loyalty_user_birthday', rodjendan_korisnika)
        urlencoded.append('loyalty_user_gender', pol_korisnika)
        urlencoded.append('email_prep', 'nesto@gmail.com')

        if(saglasnost_uslovi == true) urlencoded.append('loyalty_terms', 'da')
        else urlencoded.append('loyalty_terms', 'ne')

        if(saglasnost_promo == true) urlencoded.append('loyalty_promo_messages', 'da')
        else urlencoded.append('loyalty_promo_messages', 'ne')

        if(saglasnost_ponuda == true) urlencoded.append('loyalty_custom_offer', 'da')
        else urlencoded.append('loyalty_custom_offer', 'ne')

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };
    
        var query = "https://development.sales-snap.com/api/contacts/new"
    
    
        fetch(query, requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result)
    
            var json_objekat = result
            var objekat = JSON.parse(result);
    
            var mautic_id = objekat.contact.id
            console.log(mautic_id)

            upisiBarcode(mautic_id)
    
        })
        .catch(error => console.log('error', error));

    })

}

async function barcodeGenerator(ID) {
    var user_id = '' + ID
    var barcode = ''

    switch (user_id.length) {
        case 1:
            barcode = '000000000' + user_id
            break;

        case 2:
            barcode = '00000000' + user_id
            break;

        case 3:
            barcode = '0000000' + user_id
            break;

        case 4:
            barcode = '000000' + user_id
            break;

        case 5:
            barcode = '00000' + user_id
            break;

        case 6:
            barcode = '0000' + user_id
            break;

        case 7:
            barcode = '000' + user_id
            break;

        case 8:
            barcode = '00' + user_id
            break;

        case 9:
            barcode = '0' + user_id
            break;

        case 10:
            barcode = user_id
            break;
    }

    // $('body').append('<svg id="barcode"></svg>')
    // JsBarcode("#barcode", barcode);

    return barcode
}

async function upisiBarcode(ID) {


    var user_id = '' + ID
    console.log('USER ID: ' + user_id)
    var barcode = ''

    switch (user_id.length) {
        case 1:
            barcode = '000000000' + user_id
            break;

        case 2:
            barcode = '00000000' + user_id
            break;

        case 3:
            barcode = '0000000' + user_id
            break;

        case 4:
            barcode = '000000' + user_id
            break;

        case 5:
            barcode = '00000' + user_id
            break;

        case 6:
            barcode = '0000' + user_id
            break;

        case 7:
            barcode = '000' + user_id
            break;

        case 8:
            barcode = '00' + user_id
            break;

        case 9:
            barcode = '0' + user_id
            break;

        case 10:
            barcode = user_id
            break;
    }



    var myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", "Basic dGVzdHVzZXI6ZGFkYXN1cHJlbWU=");

    var urlencoded = new URLSearchParams();

    urlencoded.append('loyalty_user_barcode', barcode)

    var requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    var query = "https://development.sales-snap.com/api/contacts/" + user_id + "/edit"

    fetch(query, requestOptions)
        .then(response => response.text())
        //   .then(text => console.log(text))
        .then(result => console.log(result))
        .then(() => {
            $('.backdrop').removeClass('hide')
            $('.backdrop_sucess').removeClass('hide')
            // alert('USPESNA REGISTRACIJA!')
            // var lokacija = window.location.href.replace('registracija', 'login')
            // window.location.href = lokacija

            // $('body').append('<svg id="barcode"></svg>')
            // JsBarcode("#barcode", barcode);
        })
        .catch(error => console.log('error', error));
}
