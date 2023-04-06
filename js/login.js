// VALIDACIJA

// Provera da li je dobro unet mejl, vraca true ako je dobro
function checkEmail(email) {
    var user_email = email;

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!$(user_email).val().match(emailPattern)) {
        $(user_email).next().removeClass('hide');
    } else {
        $(user_email).next().addClass('hide')
        return true
    }
}

// Provera da li mejl postoji u bazi
async function checkUserEmail(email) {

    var user_email = email

    console.log(user_email)

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
        
        console.log(objekat)

        if(objekat.total == 0) {
            console.log('NEMA KORISNIKA!')
            $('#zauzet-mejl').removeClass('hide')
            $('.backdrop').addClass('hide')
        } else {
            console.log('POSTOJI MEJL')

            var kontakt = objekat.contacts
            var mautic_id = Object.keys(kontakt)[0]
            console.log(mautic_id)
            checkUserPassword(mautic_id, $('#password').val(), user_email)
        }                                            
                                
    })
    .catch(error => console.log('error', error));

}


// Nakon provere da li mejl postoji u bazi, provera da li se mejl i password podudaraju
async function checkUserPassword(ID, password, email) {
    var user_id = ID
    var user_password = password
    var user_email = email

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

    var query = "https://development.sales-snap.com/api/contacts/" + user_id


    fetch(query, requestOptions)
    .then(response => response.text())
    .then(result => {
        var json_objekat = result
        var objekat = JSON.parse(result);
        console.log(objekat.contact.fields.personal.loyalty_user_password.value)

        if(user_password == objekat.contact.fields.personal.loyalty_user_password.value) {
            // alert('USPESAN LOGIN')

            $('#password').next().addClass('hide')

            $('#login-page').addClass('hide')
            // $('#account-page').removeClass('hide')

            // $('#login-page').addClass('hide')
            // $('#account-page').removeClass('hide')
            $('#home-page').removeClass('hide')

            showUser(user_id, user_email)

        } else {
            console.log('POGRESAN PASSWORD')
            $('#password').next().removeClass('hide')
            $('.backdrop').addClass('hide')
        }
                               
    })
    .catch(error => console.log('error', error));


}


// Prikaz podataka usera
function showUser(ID, email) {
    var user_id = '' + ID
    var user_email = email
    console.log(user_email)

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

    var query = "https://development.sales-snap.com/api/contacts/" + user_id


    fetch(query, requestOptions)
    .then(response => response.text())
    .then(result => {
        var json_objekat = result
        var objekat = JSON.parse(result);
        console.log(objekat)


        // $('#ime').text(objekat.contact.fields.core.firstname.value) 
        // $('#prezime').text(objekat.contact.fields.core.lastname.value) 
        // $('#account-email').text(user_email)
        
        
        console.log('USER ID: ' + user_id)
        var barcode = ''

        switch(user_id.length) {
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
        
        $('#barcode-holder').append('<svg id="barcode"></svg>')
        
        // Dodavanje generisanog barkoda i numerickog barkoda na barcode page
        JsBarcode("#barcode", barcode);
        $('#barcode-number-holder').text(objekat.contact.fields.personal.loyalty_user_barcode.value)

        // Dodavanje loyalty bodova na progress page
        $('#progress-value').html(objekat.contact.fields.personal.loyalty_bodovi.value + '<span class="euro-sign">&#8364;</span>') 
        $('#progress-green').attr('value', objekat.contact.fields.personal.loyalty_bodovi.value)
        $('#progress-single').attr('value', objekat.contact.fields.personal.loyalty_bodovi.value)

        // Dodavanje generisanog barkoda i numerickog barkoda na cashback page
        $('#cashback-page-barcode-holder').append('<svg id="barcode-cashback"></svg>')
        JsBarcode("#barcode-cashback", barcode)
        $('#cashback-page-barcode-number-holder').text(objekat.contact.fields.personal.loyalty_user_barcode.value)
        $('#cashback-num').html(objekat.contact.fields.personal.loyalty_bodovi.value  + '<span class="euro-sign">&#8364;</span>')

        // Dodavanje loyalty bodova na buy product page
        $('#product-price').html(objekat.contact.fields.personal.loyalty_bodovi.value  + '<span class="euro-sign">&#8364;</span>') 
        $('.backdrop').addClass('hide')                
                        
    })
    .catch(error => console.log('error', error));

}
$( document ).ready(function() {
    // main menu 
    $('.close-menu').on('click', function(){
        $('.main-nav').addClass('nav-margin-left')
        $('.close-menu').addClass('close-rotate')
    })
    $('.menu-wrapper').on('click', function(){
        $('.main-nav').removeClass('nav-margin-left')
        $('.close-menu').removeClass('close-rotate')
    })
    // main menu 
    // home links and backhome buttons
    $('#barcode-page .btn-back, #progress-page .btn-back, #plp-page .btn-back, #survey-page .btn-back, #catalogs-page .btn-back').on('click', function(){
        $(this).parents('.main-wrapper').addClass('hide')
        $('#home-page').removeClass('hide')
    })
    $('.main-home-wrapper .home-link').on('click', function(e){
        var pageLink = $(this).attr('data-page')
        $(this).parents('#home-page').addClass('hide')
        $('#' + pageLink).removeClass('hide')
    })
    // home links and backhome buttons
    // benefit and survey 
    
    $('#pdp-page .btn-back').on('click', function(){
        $(this).parents('.main-wrapper').addClass('hide')
        $('#plp-page').removeClass('hide')
    })
    $('#plp-page .benefit-card').on('click', function(e){
        var pageLink = $(this).attr('data-page')
        $(this).parents('#plp-page').addClass('hide')
        $('#' + pageLink).removeClass('hide')
    })
    $('#survey-pdp-page .btn-back').on('click', function(){
        $(this).parents('.main-wrapper').addClass('hide')
        $('#survey-page').removeClass('hide')
    })
    $('#survey-page .benefit-card').on('click', function(e){
        var pageLink = $(this).attr('data-page')
        $(this).parents('#survey-page').addClass('hide')
        $('#' + pageLink).removeClass('hide')
    })
    // benefit and survey 
    // use cashback - buy product 
    $('#cashback-page .btn-back, #buy-product-page .btn-back').on('click', function(){
        $(this).parents('.main-wrapper').addClass('hide')
        $('#progress-page').removeClass('hide')
    })
    $('#progress-page .continue-button').on('click', function(e){
        var pageLink = $(this).attr('data-page')
        $(this).parents('.main-wrapper').addClass('hide')
        $('#' + pageLink).removeClass('hide')
    })
    // use cashback - buy product 
});

