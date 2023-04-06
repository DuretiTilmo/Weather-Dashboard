// Variable declaration
var inputEl = document.querySelector("#searchInput");
var weatherContentEl = document.querySelector(".coming-days");
var weatherEl = document.querySelector(".result");
var todaysResult = document.querySelector("#result-content");
var subTitleEl = document.querySelector(".sub-title");

var APIKey = 'c192990534f3c3d9e23e97ee314b1367';
var weatherBaseEndpoint = 'https://api.openweathermap.org/data/2.5/forecast?appid=' + APIKey;
const searchHistory=[];
const eventList = [];
//Send an API request using the built-in browser fetch method
let getWeatherByCityName = function(city){
  let endpoint = weatherBaseEndpoint + '&q=' + city; 
  
  fetch(endpoint)
  .then(function(response){
    return response.json();
  })
  .then(function(data) {
 
    // Loop through the data to get the currentDate weather
    const dates=[];
      weatherContentEl.textContent = '';
      for (var i = 0; i < data.list.length; i++) {
        currentDate = getDateString(data.list[i].dt_txt);
        //The matrices will display forecast weather parameters in 3 hour intervals out for each day. For that;   
         // Conditional statement to only select the data on different dates 
         if(!dates.includes(currentDate)){
           dates.push(currentDate);        
          searchHistory.push(getWeatherObject(data.list[i]));
         }
      } 
      // Stringify and set key in local storage to searchHistory array
      if(!searchHistory.length==0){ 
        localStorage.setItem(city, JSON.stringify(searchHistory));
       }
      printWeather(searchHistory);
      printHistory();
      searchHistory.splice(0, searchHistory.length);    
    });

 // This function gets the dates by splitting dateData string  
function getDateString(dateData) {        
     return dateData.split(' ')[0];           
 }   

// Get stored key/city from local storage 
function getWeatherforCity(cityLocal){
  city = cityLocal.replace("_", " "); 
  printWeather(JSON.parse(localStorage.getItem(city)));  
}

// This function prints previously searched city names, make them a button and calls for initialization function
function printHistory(){
  $("#searchHistory").html("");
      if(!searchHistory.length==0){            
        Object.keys(localStorage).forEach((key) => {
          const cityName = key.split(" ");
          var cityId = key.replace(/ /g, "_");          
          $('#searchHistory').append('<input type="button" id='+cityId+' value='+cityId +' class="historyBtn"><br>');
      });
      initHistory();
    }
  }

// Initializes the history button and when clicked displays the clicked city's weather data
  function initHistory(){
    let buttonList = document.querySelectorAll(".historyBtn");
  for (let i = 0; i <buttonList.length; ++i) {
    if (!eventList.includes(buttonList[i].id)) {
      eventList.push(buttonList[i]);
    
    buttonList[i].addEventListener("click", function() {
      var cityId = this.id;
      getWeatherforCity(cityId);
    
    })};
  }
  }

  // This function has got an object of specified weather data from data list
     function getWeatherObject(weatherObj){
      var weather = document.createElement('div');
        weather = {
          date : weatherObj.dt_txt.split(' ')[0],
          temp : weatherObj.main.temp,
          wind : weatherObj.wind.speed,
          humidity : weatherObj.main.humidity,
          icon : weatherObj.weather[0].icon
        };
        return weather;
      }

  // Prints out all the requested information by dynamically creating the elements to display the data inside of it 
function printWeather(weatherObjList) {
var date1,temp1,wind1,humidity1;

for (var i = 0; i < weatherObjList.length; i++) {
 
 date1=weatherObjList[i].date;
 temp1=weatherObjList[i].temp;
 wind1=weatherObjList[i].wind;
 humidity1=weatherObjList[i].humidity;
 icon=weatherObjList[i].icon;

    var weatherCard = document.createElement('div');
    weatherCard.setAttribute('id', 'Card'+i)
    weatherCard.classList.add('card-columns', 'col-9','w-5', 'bg-info', 'text-white', 'mx-2', 'p-2', 'col-lg-2', 'col-md-9','col-sm-6');
    $('#Card'+i).html("");

    var citynameEl = document.createElement('h2');
    citynameEl.innerHTML = city;
    var kToF = ((temp1-273.15)*1.8)+32;

    var dateEl = document.createElement('h4');
    if(i==0){
      dateEl.innerHTML = city +' (' + date1 + ')<br>';
    }else{
      dateEl.innerHTML =  date1 +  '<br>';
    }
    var imgEl = document.createElement('img');
    imgEl.src ="http://openweathermap.org/img/wn/" +icon+ ".png" ;

    var bodyContentEl1 = document.createElement('p');
    bodyContentEl1.innerHTML =
     'Temp: '  +kToF.toFixed(1) + '\xb0'+ 'F' + '<br>';

     var bodyContentEl2 = document.createElement('p');
     bodyContentEl2.innerHTML =
     'Wind: '+ wind1 + 'MPH';

     var bodyContentEl3 = document.createElement('p');
     bodyContentEl3.innerHTML =
     'Humidity: ' + humidity1 + '%';

     // Conditional to display the first item of the array i.e todays result 
     if(i==0){ 
      var headEl = document.createElement('h3');
      headEl.innerHTML = "5-Day Forecast:";
      $(".sub-title").html("");
      subTitleEl.append(headEl);
      $("#result-content").html("");
      $(".coming-days").html("");
      todaysResult.append(dateEl,imgEl,bodyContentEl1,bodyContentEl2,bodyContentEl3 );
      todaysResult.setAttribute('style', 'border: 2px solid black', 'd-flex .justify-content-sm-center');
    
     }else{
      weatherCard.append(dateEl,imgEl,bodyContentEl1,bodyContentEl2,bodyContentEl3 )
      weatherContentEl.append(weatherCard);
     }
 }
}
};
