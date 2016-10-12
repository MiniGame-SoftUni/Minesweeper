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

    });

    function loginSuccess(data, status) {
        sessionStorage.authtoken = data._kmd.authtoken;
        activeUser = data._kmd.authtoken;
        showHideNavigationLinks();
        showHomeView();
        showInfo("Welcome " + username);
        $('#currentUser').text("Username: " + username );
        listTopFiveResults();
        showHighestResultOfCurrentUser();

    }
}

function showHighestResultOfCurrentUser() {
    let resultsUrl = kinveyServiceBaseUrl + "appdata/" + kinveyAppId + "/results";
    let kinveyAuthHeaders = {'Authorization': "Basic " + btoa(kinveyAppId + ":" + kinveyAppMasterSecret)};

    $.ajax({
        method: "GET",
        url: resultsUrl,
        headers:kinveyAuthHeaders,
        success: showUserResult
    });

    function showUserResult(data) {
        let highestResult;
        for(let user of data){
            if(user.username == username){
                highestResult = user.score;
            }
        }

        $('#results').text("Highest result of current player : " + highestResult);
    }
}

function listTopFiveResults(){
    let resultsUrl = kinveyServiceBaseUrl + "appdata/" + kinveyAppId + "/results";
    let kinveyAuthHeaders = {'Authorization': "Basic " + btoa(kinveyAppId + ":" + kinveyAppMasterSecret)};

    $.ajax({
        method: "GET",
        url: resultsUrl,
        headers:kinveyAuthHeaders,
        success: listTopFive
    });

    function listTopFive(data){

        data.sort(function(a, b) {
            return Number(a.score) - Number(b.score);
        });

        let usersToList = data.slice(0, 5);
        $('#topFiveResults').text("Top 5 results:");

        let html = '<table>\n';
        html += `\t<tr><th>Name</th><th>Score</th></tr>\n`;
        for(let user of usersToList){
            html += `\t<tr><td>${user['username']}</td><td>${user['score']}</td></tr>\n`;
        }
        html += "</table>"

        $('#topFiveResults').append(html);
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
            showLoginView();
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

function sendAjaxResults() {
    let resultsUrl = kinveyServiceBaseUrl + "appdata/" + kinveyAppId + "/results";
    let kinveyAuthHeaders = {'Authorization': "Basic " + btoa(kinveyAppId + ":" + kinveyAppMasterSecret)};
    let resultData = {
        username: username,
        score: userResult
    };

    $.ajax({
        method: "GET",
        url: resultsUrl,
        headers:kinveyAuthHeaders,
        success: successGet
    });

    function successGet(data) {
        for(let result of data){

            let isExistUser = false;
            let userDataPut = {
                id: result._id,
                username: result.username,
                score: userResult
            };
            let userDataPutUrl = kinveyServiceBaseUrl + "appdata/" + kinveyAppId + "/results/" + userDataPut.id;

            if(result.username == username && Number(result.score) > userResult){
                $.ajax({
                    method: "PUT",
                    url: userDataPutUrl,
                    data: userDataPut,
                    ContentType: 'application/json',
                    headers: kinveyAuthHeaders
                });
            }

            if(result.username == username){
                isExistUser = true;
            }

            if(isExistUser == false){
                $.ajax({
                    method: "POST",
                    url: resultsUrl,
                    data: resultData,
                    ContentType: 'application/json',
                    headers: kinveyAuthHeaders

                });
            }
        }
    }

}

$(function () {
    sessionStorage.clear();
    
    $('#linkLogin').click(showLoginView);
    $('#linkRegister').click(showRegisterView);
    $('#linkLogout').click(logout);
});