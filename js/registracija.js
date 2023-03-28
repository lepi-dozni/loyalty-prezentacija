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