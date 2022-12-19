var inputEl = document.querySelector("#searchInput");
var weatherContentEl = document.querySelector(".coming-days");
var weatherEl = document.querySelector(".result");
var todaysResult = document.querySelector("#result-content");
var moreDaysEl = document.querySelector(".more-days");
var subTitleEl = document.querySelector(".sub-title");

var APIKey = 'c192990534f3c3d9e23e97ee314b1367';
var weatherBaseEndpoint = 'https://api.openweathermap.org/data/2.5/forecast?appid=' + APIKey;
const searchHistory=[];

let getWeatherByCityName = function(city){
  let endpoint = weatherBaseEndpoint + '&q=' + city; 
  
  fetch(endpoint)
  .then(function(response){
    return response.json();
  })
  .then(function(data) {
 
    const dates=[];
   
      weatherContentEl.textContent = '';
      for (var i = 0; i < data.list.length; i++) {
        currentDate = getDateString(data.list[i].dt_txt);
         if(!dates.includes(currentDate)){
           dates.push(currentDate);        
          searchHistory.push(getWeatherObject(data.list[i]));
         }
      } 
      if(!searchHistory.length==0){ 
        // localStorage.clear();
        localStorage.setItem(city, JSON.stringify(searchHistory));
       }
      printWeather(searchHistory);
      printHistory();
      searchHistory.splice(0, searchHistory.length);    
    });

function getDateString(dateData) {        
     return dateData.split(' ')[0];           
 }   

    //   $(document).ready(function() {
    //     $('#searchHistory').append('<input type="button" id='+city+' value=' +city+' class="btn"><br>');
    //     $("#"+city).on("click", getWeatherforCity(city));
    // });
      
function getWeatherforCity(cityLocal){
  city = cityLocal.replace("_", " "); 
  printWeather(JSON.parse(localStorage.getItem(city)));  
}

function printHistory(){
  $("#searchHistory").html("");
      if(!searchHistory.length==0){         
        Object.keys(localStorage).forEach((key) => {
          const cityName = key.split(" ");
          var cityId = key.replace(/ /g, "_");          
          $('#searchHistory').append('<input type="button" id='+cityId+' value='+cityId +' class="historyBtn"><br>');
          // $("#"+cityId).on("click", getWeatherforCity(cityName));
          initHistory();
        // console.log(JSON.parse(localStorage.getItem(key)));        
      });
    }
  }

  function initHistory(){
    let buttonList = document.querySelectorAll(".historyBtn");
  for (let i = 0; i <buttonList.length; ++i) {
    buttonList[i].addEventListener("click", function() {
      // alert(this.innerHTML +" is clicked");
      var cityId = this.id;
      getWeatherforCity(cityId);
    });
  }
  }
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
    
      // document.getElementById("searchId").addEventListener("click", function(event) {
      //   event.stopPropagation()
      //   });
  // });

function printWeather(weatherObjList) {
//  console.log(weatherObj);
//var jsonArray = JSON.parse(weatherObj);
var date1,temp1,wind1,humidity1;

for (var i = 0; i < weatherObjList.length; i++) {
 
 date1=weatherObjList[i].date;
 temp1=weatherObjList[i].temp;
 wind1=weatherObjList[i].wind;
 humidity1=weatherObjList[i].humidity;
 icon=weatherObjList[i].icon;

    var weatherCard = document.createElement('div');
    weatherCard.setAttribute('id', 'Card'+i)
    // weatherCard.id = 'Card'+i;
    weatherCard.classList.add('card-columns', 'w-5', 'bg-info', 'text-white', 'mx-3', 'p-3', 'col-lg-2', 'col-md-6','col-sm-9');
    $('#Card'+i).html("");
    //var weatherBody = document.createElement('div');
    //weatherBody.classList.add('card-body');
    //weatherCard.append(weatherBody);

    var citynameEl = document.createElement('h2');
    citynameEl.innerHTML = city;
    var kToF = ((temp1-273.15)*1.8)+32;

    var dateEl = document.createElement('h3');
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
     if(i==0){ 
      var headEl = document.createElement('h3');
      headEl.innerHTML = "5-Day Forecast:";
      $(".sub-title").html("");
      subTitleEl.append(headEl);

      $("#result-content").html("");
      todaysResult.append(dateEl,imgEl,bodyContentEl1,bodyContentEl2,bodyContentEl3 );
      todaysResult.setAttribute('style', 'border: 2px solid black', 'd-flex .justify-content-sm-center' );
      
      // subTitleEl.setAttribute('style',  )
     }else{
      
      weatherCard.append(dateEl,imgEl,bodyContentEl1,bodyContentEl2,bodyContentEl3 )
      weatherContentEl.append(weatherCard);
     }
     // weatherEl.append(weatherCard);
 }
}
};

