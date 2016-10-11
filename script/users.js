const kinveyAppId = 'kid_B1cWIZ5A';
const kinveyAppSecret = '43eba47fd4e84497ae48bfcb67c11fb5';
const kinveyAppMasterSecret = 'd42dffe7ca9f4d1a8a2d9f270f32776a';
const kinveyServiceBaseUrl = "https://baas.kinvey.com/";


function showView(viewId) {
    $('main > section').hide();

    $("#" + viewId).show();
}


function showHideNavigationLinks() {
    let loggedIn = sessionStorage.authtoken != null;
    if (loggedIn){
        $("#linkRegister").hide();
        $("#viewRegister").hide();
        $("#linkLogin").hide();
        $("#viewLogin").hide();
        $("#linkLogout").show();
    } else {
        $("#linkRegister").show();
        $("#viewRegister").show();
        $("#linkLogin").show();
        $("#viewLogin").show();
        $("#linkLogout").hide();
    }
}

function showHomeView() {
    showView('viewHome');
}

let username;
let userEmail;
let activeUser;
function login() {
    let loginUrl = kinveyServiceBaseUrl + "user/" + kinveyAppId + "/login";
    let kinveyAuthHeaders = {'Authorization': "Basic " + btoa(kinveyAppId + ":" + kinveyAppSecret)};
    let loginData = {
        username: $("#loginUserName").val(),
        password: $("#loginPassword").val()
    };
    username = $("#loginUserName").val();
    $.ajax({
        method: "POST",
        url: loginUrl,
        data: loginData,
        headers: kinveyAuthHeaders,
        success: loginSuccess
        //error: showError("Something wrong!")
    });

    function loginSuccess(data, status) {
        sessionStorage.authtoken = data._kmd.authtoken;
        activeUser = data._kmd.authtoken;
        showHideNavigationLinks();
        showHomeView();
        showInfo("Welcome " + username);
        $('#currentUser').html("<h3>Username: " + username + "</h3>");
    }
}

function register() {

    let registerUrl = kinveyServiceBaseUrl + "user/" + kinveyAppId + "/";
    let kinveyAuthHeaders = {'Authorization': "Basic " + btoa(kinveyAppId + ":" + kinveyAppSecret)};

    let registerData = {
        username: $("#registerUserName").val(),
        password: $("#registerPassword").val(),
        last_name: $("#registerFullName").val(),
        email: $("#registerEmailAdress").val()
    };

    username = $("#registerUserName").val();
    let password = $("#registerPassword").val();
    let confirmPassword = $("#registerConfirmPassword").val();
    userEmail = $("#registerEmailAdress").val();

    if( password == confirmPassword && password.length >= 6){
        $.ajax({
            method: "POST",
            url: registerUrl,
            data: registerData,
            headers: kinveyAuthHeaders,
            success: registerSuccess

        });
        function registerSuccess(data) {
            sessionStorage.authtoken = data._kmd.authtoken;
            showHideNavigationLinks();
            showHomeView();
            showInfo("Register successful, dear " + username);
        }
    } else{
        showError("Password and confirm password is not match or is too short! Must be minimum 6 symbol length!");
    }

}

function showRegisterView() {
    $('#viewRegister').show();
    $('#linkRegister').hide();
    $('#linkLogin').show();
    $('#viewLogin').hide();
    $("#registerForm").unbind('submit').bind('submit',function(event) {
        event.preventDefault();
        register();
    });

}

function showLoginView() {
    $('#viewLogin').show();
    $('#viewRegister').hide();
    $('#linkLogin').hide();
    $("#loginForm").unbind('submit').bind('submit',function(event) {
        event.preventDefault();
        login();
    });
}

function showInfo(infoMsg) {
    $('#showInfoMsg').text(infoMsg).show().delay(3000).fadeOut();
}

function showError(errorMsg) {
    $('#showErrorMsg').text(errorMsg).show().delay(3000).fadeOut();
}

function logout() {
    sessionStorage.clear();
    showHideNavigationLinks();
    location.reload(true);
}

$(function () {
    sessionStorage.clear();
    
    $('#linkLogin').click(showLoginView);
    $('#linkRegister').click(showRegisterView);
    $('#linkLogout').click(logout);
});