google.maps.event.addDomListener(window, "load", initMap);

function init(){
    $.getJSON("sample.json", function(result){
        var data = [],
            dataCollection = [];
        for (var i = 0; i < result.length; i++){
            data.push({
                ip: result[i][0],
                number: result[i][1],
                latitude: '',
                longitude: ''
            })
            if (data.length == 150){
                dataCollection.push(data);
                data = [];
            }
        };
        if (data.length > 0){
            dataCollection.push(data);
        }
        getCoordinates (dataCollection);
    });
}

function getCoordinates (jsondata){
    var counter = 0;
    ipRequest(counter, jsondata);
}

function timeout(counter, jsondata){
    setTimeout(function () {
        ipRequest(counter, jsondata);
    }, 60001);
}

function ipRequest(counter, jsondata){
    for (var i = 0; i < jsondata[counter].length; i++){
        let number = jsondata[counter][i].number;
        let ip = jsondata[counter][i].ip;
        var responses = 0;
        $.getJSON("http://ip-api.com/json/"+jsondata[counter][i].ip, function(data) {
            addMarker(data.lat, data.lon, number, ip);
            responses++;
            if (responses == jsondata[counter].length && counter != jsondata.length-1){
                counter++;
                timeout(counter, jsondata);
            }
        });
    }
}

function initMap() {
    var centerLatLng = new google.maps.LatLng(56.2928515, 43.7866641);
    var mapOptions = {
        center: centerLatLng,
        zoom: 3
    };
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    init();
}

function addMarker(lat, lon, number, ip){
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lon),
        map: map,
        title: "Requests: " + number + ', IP: ' + ip
    });
}