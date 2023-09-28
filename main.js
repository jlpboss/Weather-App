let renderer = {
    clearPage: function (div) {
        let page = document.getElementById(div)
        let childNodes = page.childNodes;
        for (let i = childNodes.length - 1; i >= 0; i--) {
            page.removeChild(childNodes[i]);
        }
    },
    makeTag: function (elem, id, where, classAttribute) {
        let cont = document.createElement(elem);
        let out = document.getElementById(where);
        cont.setAttribute("id", id);
        cont.setAttribute("class", classAttribute);
        out.appendChild(cont);
    },
    drawText: function (text, where) {
        let node = document.createTextNode(text);
        let out = document.getElementById(where);
        out.appendChild(node);

    },
    makeEvent: function (listening, event, funct, param = "()") {
        let element = document.getElementById(listening);
        element.addEventListener(event, function () {
            eval(funct + param);
        });
    },
    makeContainer: function (id, where, containerClass = "container", rowClass = "row", colClass = "col") {
        this.makeTag("div", id + "Cont", where, containerClass)
        this.makeTag("div", id + "Row", id + "Cont", rowClass)
        this.makeTag("div", id + "Col", id + "Row", colClass)
    },
    setAtrubute: function (tagId, atrubute, value) {
        let tag = document.getElementById(tagId);
        tag.setAttribute(atrubute, value);
    },
    drawImage: function (imgLink, id, where, classAttribute, altText) {
        renderer.makeTag("img", id, where, classAttribute)
        renderer.setAtrubute(id, "src", imgLink)
        renderer.setAtrubute(id, "alt", altText)
    },
    drawContentBox: function (where, id, headText, numberofSubBoxes, SubBoxTextArray) {
        this.makeContainer(id, where, "container", "row ", "col")
        this.drawText(headText, id + "Col")
        this.makeTag("div", id + "Row2", id + "Cont", "row")
        for (let i = 0; i < numberofSubBoxes; i++) {
            this.makeTag("div", id + "Col" + i, id + "Row2", "col-" + (12 / numberofSubBoxes))
            this.drawText(SubBoxTextArray[i], id + "Col" + i)
        }
    }
};

class WeatherAPI {

    constructor (){
        this.apiKey = "34673af0c28d949d581b71e45eea6444";
        this.weather = {};
        this.getWeatherDataFromGPS();
    }

    async getWeatherDataFromGPS (){
        let x = geolocationClassObj.getLocation();
        console.log("a")
        console.log(x)

        const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + x[0] + '&lon=' + x[1] + '&appid=' + this.apiKey;

        await axios.get(apiUrl)
            .then(response => {
                this.weather = response.data;
                console.log(this.weather);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

}

class geolocationClass {
    constructor (){
        latitude = 0;
        longitude = 0;
        this.getLocation();
    }

    getLocation (){
        if ("geolocation" in navigator) {
            let nav = navigator.geolocation;
            let data = nav.getCurrentPosition(async function (position) {
                // weatherAPI.userLat = position.coords.latitude;
                // weatherAPI.userLon = position.coords.longitude;
                
                console.log(position.coords.latitude);
                console.log(position.coords.longitude);

                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                
                return [position.coords.latitude, position.coords.longitude];

                // console.log(weatherAPI.userLat)
                // console.log(weatherAPI.userLon)
            }, function (error) {
                console.error("Error getting location: " + error.message);
            });
            return data;
        } else {
            console.error("Geolocation is not available in this browser.");
            return null;
        }
    }

}

let weatherCard = {
    makeCard: function (where) {
        renderer.makeTag("div", "weatherCard", where, "card text-center h5 cardStuff")
        renderer.drawContentBox("weatherCard", "city", "City:", 1, [weatherAPI.weather.name])
        renderer.drawContentBox("weatherCard", "temp", "Temperature:", 2, [(weatherAPI.weather.main.temp - 273.15).toFixed(2) + " Degrees Celsius", ((weatherAPI.weather.main.temp - 273.15) * 9 / 5 + 32).toFixed(2) + " Degrees Fahrenheit"])
        renderer.drawContentBox("weatherCard", "cond", "Condition:", 1, [weatherAPI.weather.weather[0].description])
    }
}

let geolocationClassObj = new geolocationClass();

let weatherAPI = new WeatherAPI();
// weatherAPI.getLocation().then()
//weatherAPI.getWeatherDataFromGPS(res)
//async function test() {}
//weatherAPI.getWeatherDataFromGPS();

// setTimeout(() => {
//     weatherCard.makeCard("div1");
// }, "2000");