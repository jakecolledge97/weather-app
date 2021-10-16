const weatherApiKey = "cd641e1388cb206c1745095f98eaf34f";
var recentSearch = []
var recentSearchField = $('#search-field').find('.block').last()
var units = "metric";
var city = $('#search-field').find('input')
var australiaCode = "036"
var usCode = "840"
var unitOfMeasurement;

//on run
getRecentItems()

//function to listen to sumit button
$('#search-field').submit(function searchForCity(event){
    event.preventDefault()
    getAPI()
    recentItems()
})

//gets information from weather API
function getAPI(){ 
    if(!city.val()){
        return
    }
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city.val()}&units=${units}&appid=${weatherApiKey}`
    
    fetch(weatherApiUrl)
        .then(function(response){
            console.log(response)
            return response.json()
        })
        .then(function(data){
            console.log(data)
            showData(data)
        })
}
//get UVI
function getUVI(lon,lat){
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${weatherApiKey}`)
        .then(function(response){
            console.log(response)
            return response.json()
        })
        .then(function(data){
            console.log(data)
            $('#uv').text(data.current.uvi)
            fiveDayForecast(lon,lat)
        })
    
}
//get 5 Day forecast
function fiveDayForecast(lon,lat){
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`)
        .then(function(response){
            console.log(response)
            return response.json()
        })
        .then(function(data){
            console.log(data)
            fiveDayStyling(data)
        })
}

//change details
function showData(data){
    $('#city').text(data.name)
    $('#temp').text(data.main.temp)
    $('#wind').text(data.wind.speed)
    $('#humid').text(data.main.humidity)

    var lon = data.coord.lon
    var lat = data.coord.lat
    getUVI(lon,lat)
}

//five day forecast style
function fiveDayStyling(data){
    for(i=1;i<=5;i++){
        var weatherBox;
        if(i === 1){
            weatherBox = $('#forecast-info div:nth-child('+i+')')
            weatherBox.children('p:nth-child(1)').text(data.list[0].dt_txt)
            weatherBox.children('p:nth-child(2)').text('Temp: ' + data.list[0].main.temp)
            weatherBox.children('p:nth-child(3)').text('wind: ' + data.list[0].wind.speed)
            weatherBox.children('p:nth-child(4)').text('Humidity: ' +data.list[0].main.humidity)
        }else{
            weatherBox = $('#forecast-info div:nth-child('+i+')')
            weatherBox.children('p:nth-child(1)').text(data.list[(i-1)*8].dt_txt)
            weatherBox.children('p:nth-child(2)').text('Temp: ' + data.list[(i-1)*8].main.temp)
            weatherBox.children('p:nth-child(3)').text('wind: ' + data.list[(i-1)*8].wind.speed)
            weatherBox.children('p:nth-child(4)').text('Humidity: ' +data.list[(i-1)*8].main.humidity)
        }
        
    }
}

//create recent items
function recentItems(){
    if(city.val()){ 
        city.css('box-shadow', 'none')
        var search = city.val()
        var searchCap = capitalizeFirstLetter(search)
        //checks if recent searches has less than 10 searches
        if(recentSearch === null){
            recentSearch = []
        }
        var alreadyAdded = 0;
        for(i=0;i<recentSearch.length;i++){
            if(city.val() === recentSearch[i]){
                alreadyAdded++
            }
        }
        if(alreadyAdded===0){
            recentSearch.push(searchCap)
        }else{
            alreadyAdded = 0;
        }
        if(recentSearch.length<10){
            //pushes the search input to the recent searches array
            
            localStorage.setItem('recentSearch', JSON.stringify(recentSearch))
            city.val('')
        }else{
            //removes the first on the array if there is already 10
            recentSearch.shift()
            city.val('')
            //pushes the new one to the array
            localStorage.setItem('recentSearch', JSON.stringify(recentSearch))
        }
        //calls to add new items to recent items list
        getRecentItems()
    }else{
        city.css('box-shadow', '0px 0px 5px 1px red')
    }
}

//this will display a list of buttons with the last 10 searches
function getRecentItems(){
    recentSearch = JSON.parse(localStorage.getItem('recentSearch'))
    //removes previous buttons to make way for new buttons
    if(recentSearch){
        recentSearchField.children().children().remove()
    }
    //creates new button
    if(recentSearch === null){
        return
    }else{
        for(i=0;i<recentSearch.length;i++){
            var newButton = $('<button>').attr('class','button p-3 m-3 is-info is-fullwidth').text(recentSearch[i])
            recentSearchField.children().prepend(newButton)
        }
    }
}

function capitalizeFirstLetter(search){
    var capitalize = search.charAt(0).toUpperCase() + search.slice(1)
    return capitalize
}