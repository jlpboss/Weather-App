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

let weatherAPI = {
    apiKey: "34673af0c28d949d581b71e45eea6444",
  
    weather: {},
  
    userLon: 0,
  
    userLat: 0,
  
    getWeatherDataFromGPS: async function (whereToMakeCard) {
      let [lat, lon] = await this.getLocation();
      console.log({ lat, lon });
      const apiUrl =
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        this.apiKey;
  
      axios
        .get(apiUrl)
        .then((response) => {
          this.weather = response.data;
          console.log(this.weather);
          weatherCard.makeCard(whereToMakeCard);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    getLocation: async function () {
      // let lat, lon;
      if ("geolocation" in navigator) {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            function (position) {
              console.log(position.coords.latitude);
              console.log(position.coords.longitude);
              //   lat = position.coords.latitude;
              //   lon = position.coords.longitude;
              resolve([position.coords.latitude, position.coords.longitude]);
            },
            function (error) {
              console.error("Error getting location: " + error.message);
              reject("Error getting location: " + error.message);
            }
          );
        });
  
        //   return [lat, lon];
      } else {
        console.error("Geolocation is not available in this browser.");
      }
    }
  };
let weatherCard = {
    makeCard: function (where) {
        renderer.makeTag("div", "weatherCard", where, "card text-center h5 cardStuff border border-success rounded")
        renderer.drawContentBox("weatherCard", "city", "City:", 1, [weatherAPI.weather.name])
        renderer.drawContentBox("weatherCard", "temp", "Temperature:", 2, [(weatherAPI.weather.main.temp - 273.15).toFixed(2) + " Degrees Celsius", ((weatherAPI.weather.main.temp - 273.15) * 9 / 5 + 32).toFixed(2) + " Degrees Fahrenheit"])
        renderer.drawContentBox("weatherCard", "cond", "Condition:", 1, [weatherAPI.weather.weather[0].description])
    },
    makeTestCard: function(id, where){
        renderer.makeTag("div", id, where, "card text-center h5 cardStuff border border-danger rounded")

        renderer.makeTag("div", id + "Body", id, "card-body")
        renderer.makeTag("h5", id + "Title", id + "Body", "card-title")
        renderer.drawText("Card title", id + "Title")

        renderer.makeTag("h6", id + "Subtitle", id + "Body", "card-subtitle mb-2")
        renderer.drawText("Card subtitle", id + "Subtitle")

        renderer.makeTag("p", id + "Text", id + "Body", "card-subtitle mb-2")
        renderer.drawText("Some quick example text to build on the card title and make up the bulk of the card's content.", id + "Text")
    }
}

renderer.makeContainer("main", "div1", "container", "row  d-flex justify-content-center", "col-12 md-col-6")

renderer.makeTag("div", "mainCol2", "mainRow", "col-12 md-col-6")
renderer.makeTag("div", "mainCol3", "mainRow", "col-12 md-col-6")
renderer.makeTag("div", "mainCol4", "mainRow", "col-12 md-col-6")

weatherCard.makeTestCard("testCard1", "mainCol")
weatherCard.makeTestCard("testCard2", "mainCol2")
weatherCard.makeTestCard("testCard3", "mainCol3")
weatherAPI.getWeatherDataFromGPS("mainCol4");

