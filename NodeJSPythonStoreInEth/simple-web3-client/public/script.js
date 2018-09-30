$(document).ready(function () {
    getAccounts();
    getData();
    getSCAddress();
    getSCAbi();
    getSCSource();
});

function getAccounts() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var accounts = JSON.parse(this.responseText);
            console.log(accounts);
            var tmp_addr = $('#accountList').val();
            $('#accountList').find('option').remove();
            for (var i = 0; i < accounts.length; i++) {
                var addr = accounts[i].address;
                if (addr != tmp_addr) {
                    $('#accountList').append('<option value="' + addr + '">' + addr + ' (' + accounts[i].balance + ' wei)</option>');
                } else {
                    $('#accountList').append('<option value="' + addr + '" selected="selected">' + addr + ' (' + accounts[i].balance + ' wei)</option>');
                }
            }
        }
    };
    xhttp.open("GET", "get-accounts", true);
    xhttp.send();
}


function getData() {
    $.ajax({
        url: "get-data",
        type: "GET",
        cache: false,
        success: function (data) {
            var hex = JSON.parse(data).data.toString();
            console.log(hex);
            var str = '';
            for (var i = 0; i < hex.length; i += 2) {
                if (parseInt(hex.substr(i, 2), 16) != 0 && !isNaN(parseInt(hex.substr(i, 2), 16))) {
                    console.log(parseInt(hex.substr(i, 2), 16));
                    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
                }
            }
            $('#data').empty().append(JSON.parse(data).data);
            console.log(str);
            $('#data_string').empty().append(str);

        }
    });
    /*
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "get-data", true);
    xhttp.send();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            var hex = JSON.parse(this.responseText).data.toString();
            console.log(hex);
            var str = '';
            for (var i = 0; i < hex.length; i += 2) {
                if (parseInt(hex.substr(i, 2), 16) != 0 && !isNaN(parseInt(hex.substr(i, 2), 16))) {
                    console.log(parseInt(hex.substr(i, 2), 16));
                    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
                }
            }
            $('#data').empty().append(JSON.parse(this.responseText).data);
            console.log(str);
            $('#data_string').empty().append(str);
        }
    };
    */
}

function getSCAddress() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            $('#scAddress').html(JSON.parse(this.responseText).address);
        }
    };
    xhttp.open("GET", "get-sc-address", true);
    xhttp.send();
}

function setData() {
    var xhttp = new XMLHttpRequest();
    console.log($("#input").val());
    var params = "data=" + ($("#input").val()).toString() + "&address=" + $("#accountList").val();
    xhttp.open("POST", "set-data", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            getAccounts();
            console.log(this.reponseText);
            if (JSON.parse(this.responseText).success) {
                $.notify('Data was updated', 'success');
            } else {
                $.notify('Data could not be updated', 'error');
            }
        }
    };
    xhttp.send(params);
}

function getSCAbi() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            $('#scABI').val(this.responseText);
        }
    };
    xhttp.open("GET", "get-sc-abi", true);
    xhttp.send();
}

function getSCSource() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            $('#scSource').val(JSON.parse(this.responseText).source);
        }
    };
    xhttp.open("GET", "get-sc-source", true);
    xhttp.send();
}

$('#registerForm').submit((e) => {
    e.preventDefault();
    console.log(e.currentTarget);
    let arr = [];
    $.each(e.currentTarget, (id, val) => {
        if (val.type !== "submit") {
            arr.push(val.value);
        }
    });

    let xhttp = new XMLHttpRequest();
    let params = "data=" + arr.join(';');
    console.log(params);
    xhttp.open("POST", "register", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.reponseText);
            if (JSON.parse(this.responseText).success) {
                $.notify('Data was updated', 'success');
            } else {
                $.notify('Data could not be updated', 'error');
            }
        }
    };
    xhttp.send(params);
});