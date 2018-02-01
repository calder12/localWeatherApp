//Note: 'days' are in truth either nighttime or daytime.
//For example, if script is loaded Monday @ Noon then the following is true:
//Day 0 : Monday
//Day 1 : Monday Night
//Day 2 : Tuesday
//Day 3 : Tuesday Night
//Etc.



//Declare Global Variables
var api = 'https://api.wunderground.com/api/80363c0eada12400';
var currentDate = new Date();
var month = currentDate.getMonth();
var day = currentDate.getDate();
var year = currentDate.getFullYear();
var html = ""

//Run Functions
$(document).ready(function() {

  // Set default coordinates in case anything goes wrong.
  var coordsLong = '-79.246863'
  var coordsLat = '43.159374'
  var url = api +'/conditions/forecast/q/' + coordsLat + ',' + coordsLong + '.json'


  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(function(position) {
      coordsLong = position.coords.longitude;
      coordsLat = position.coords.latitude;
      $.ajax({
          url: api + '/conditions/forecast/q/' + coordsLat + ',' + coordsLong + '.json',
          method: 'GET'
        })
        .then(getFarData());
    },
    //Set a default locaion if the api fails or someone denies it access.
    function(error) {
      
      $.ajax({
          url: url,
          method: 'GET'
        })
        .done(function(data){
          if(data) {
            getFarData(data)
          } else {
            alert("Sorry we got no response")
          }
        });
    });
  }
});

//Get Farenheit data from fetched API
function getFarData(farData) {
  //Plug date into HTML
  $('#date').html(month + 1 + " | " + day + " | " + year);

  //Declare Local Variables
  var cityName = farData.current_observation.display_location.city;
  var stateName = farData.current_observation.display_location.state;
  var countryName = farData.current_observation.display_location.country;

  //Create HTML from returned data.
  for (var i = 2; i < 8; i++) {
    var iconStr = farData.forecast.txt_forecast.forecastday[i].icon;
    var textStr = farData.forecast.txt_forecast.forecastday[i].fcttext;
    var dayStr = farData.forecast.txt_forecast.forecastday[i].title;
    var icon = 'img\\weather\\' + farData.forecast.txt_forecast.forecastday[i].icon.replace("nt_","") + '.png'


    html += '<div class="card">'
    html += '<div class="card-header bg-primary">'
    html += '<h5>' + dayStr + '</h5><img alt="' + iconStr + '" class="mx-auto img-fluid" src="' + icon + '">'
    html += '</div>'
    html +=  '<div class="card-body bg-secondary">' + textStr + '</div>'
    html += '</div>'

  }
  console.log(html)

  //Plug API data into displayed HTML for Current forecast
  $("#location").html(cityName + ", " + stateName + ", " + countryName);
  $('#weatherIcon').html("<img alt='" + farData.current_observation.icon + "' class='mx-auto img-fluid' src='img\\weather\\" + farData.current_observation.icon + ".png'>");
  $('#weatherDesc').html(farData.current_observation.weather);
  $('#day0TempHi').html("Hi: " + farData.forecast.simpleforecast.forecastday[0].high.fahrenheit + "°F");
  $('#day0TempLo').html("Lo: " + farData.forecast.simpleforecast.forecastday[0].low.fahrenheit + "°F");
  $('#day0TempNow').html("Now: " + Math.round(farData.current_observation.temp_f) + "°F");
  $('#day0Name').html(farData.forecast.txt_forecast.forecastday[0].title);

  // Append generated HTML to the container.
  $(".card-columns").append(html)
}