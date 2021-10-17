const weatherApiKey = "cd641e1388cb206c1745095f98eaf34f";
var recentSearch = []
var recentSearchField = $('#search-field').find('.block').last()
var units = "metric";
var unit;
var windSpeed;
var weatherIcon;
var city = $('#search-field').find('#search-input')
var australiaCode = "AU"
var usCode = "US"
var countryCode;
var unitOfMeasurement;

//on run
getRecentItems()

//recent button click
$('#recent-buttons .button').click(function searchWithButton(event){
    var search = $(this)//.textContent
    city.val(search.text())
    getAPI()
})

//function to listen to submit button
$('#search-field').submit(function searchForCity(event){
    event.preventDefault()
    getAPI()
})
//not valid
function cityNotValid(){
    $("<div class='box' id='no-city'>City Not Found</div>").insertAfter($('#search-input'))
    return
}
//check country code
function getCountryCode(){
    if($('#search-field').find('#840').is(':checked')){
        countryCode = usCode
    }else{
        countryCode = australiaCode
    }
    if(countryCode === usCode){
        units = "imperial"
        unit = " °F"
        windSpeed = " MP/H"
    }else{
        units = "metric"
        unit = " °C"
        windSpeed = " KM/H"
    }
    return countryCode, units
}
//gets information from weather API
function getAPI(){ 
    getCountryCode()
    if(!city.val()){
        city.css('box-shadow', '0px 0px 5px 1px red')
        return
    }
    $('#search-field').find('.box').remove()
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city.val()}&units=${units}&appid=${weatherApiKey}`
    
    fetch(weatherApiUrl)
        .then(function(response){
            console.log(response)
            return response.json()
        })
        .then(function(data){
            console.log(data)
            if(data.cod === "404"){
                city.val('')
                cityNotValid()
                return                
            }
            showData(data)
            recentItems()
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
            if(data.current.uvi <= 2){
                $('#uv').css({'background': 'green','color': 'white'})
            }else if(data.current.uvi > 2 && data.current.uvi <= 5){
                $('#uv').css({'background': 'yellow','color': 'black'})
            }else if(data.current.uvi > 5 && data.current.uvi <= 7){
                $('#uv').css('background', 'orange')
            }else if(data.current.uvi > 7 && data.current.uvi <= 10){
                $('#uv').css('background', 'red')
            }else{
                $('#uv').css({'background': 'purple','color':'white'})
            }
            fiveDayForecast(lon,lat)
        })
    
}
//get 5 Day forecast
function fiveDayForecast(lon,lat){
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${weatherApiKey}`)
        .then(function(response){
            console.log(response)
            return response.json()
        })
        .then(function(data){
            console.log(data)
            fiveDayStyling(data)
        })
}

//change main details
function showData(data){
    weatherIcon = data.weather[0].icon
    var date = new Date((data.dt)*1000)
    $('#city').text(data.name+' '+date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear()).append($('<img src="./Assets/images/'+weatherIcon+'@2x.png"></img>'))
    $('#temp').text(data.main.temp + unit)
    $('#wind').text(data.wind.speed + windSpeed)
    $('#humid').text(data.main.humidity + ' %')

    var lon = data.coord.lon
    var lat = data.coord.lat
    getUVI(lon,lat)
}

//five day forecast style
function fiveDayStyling(data){
    for(i=1;i<=5;i++){
        var weatherBox;
        var unixTimestamp;
        if(i === 1){
            unixTimestamp = data.list[0].dt
            weatherIcon= data.list[0].weather[0].icon
            var date = new Date(unixTimestamp*1000)
            var currentDate = date.getDate()+'/'+date.getMonth()+ '/'+date.getFullYear()
            
            weatherBox = $('#forecast-info div:nth-child('+i+')')
            weatherBox.children('p:nth-child(1)').text(currentDate).append('<img src="./Assets/images/'+weatherIcon+'@2x.png"></img>')
            weatherBox.children('p:nth-child(2)').text('Temp: ' + data.list[0].main.temp + unit)
            weatherBox.children('p:nth-child(3)').text('wind: ' + data.list[0].wind.speed + windSpeed)
            weatherBox.children('p:nth-child(4)').text('Humidity: ' +data.list[0].main.humidity + ' %')
        }else{
            unixTimestamp = data.list[(i-1)*8].dt
            weatherIcon= data.list[(i-1)*8].weather[0].icon
            var date = new Date(unixTimestamp*1000)
            var currentDate = date.getDate()+'/'+date.getMonth()+ '/'+date.getFullYear()

            weatherBox = $('#forecast-info div:nth-child('+i+')')
            weatherBox.children('p:nth-child(1)').text(currentDate).append('<img src="./Assets/images/'+weatherIcon+'@2x.png"></img>')
            weatherBox.children('p:nth-child(2)').text('Temp: ' + data.list[(i-1)*8].main.temp + unit)
            weatherBox.children('p:nth-child(3)').text('wind: ' + data.list[(i-1)*8].wind.speed + windSpeed)
            weatherBox.children('p:nth-child(4)').text('Humidity: ' +data.list[(i-1)*8].main.humidity + ' %')
        }
        
    }
    $('#recent-buttons .button').click(function searchWithButton(event){
        var search = $(this)//.textContent
        city.val(search.text())
        getAPI()
    })
}

//create recent items
function recentItems(){
    if(city.val()){ 
        city.css('box-shadow', 'none')
        //capitalizes first letter of search input
        var search = city.val()
        var searchCap = capitalizeFirstLetter(search)
        
        //checks if this is the first time searching
        if(recentSearch === null){
            recentSearch = []
        }

        //checks if city has already been searched
        var alreadyAdded = 0;
        
        for(i=0;i<recentSearch.length;i++){
            if(searchCap === recentSearch[i]){
                alreadyAdded++
            }
        }
        if(alreadyAdded===0){
            recentSearch.push(searchCap)
        }else{
            alreadyAdded = 0;
        }
        //checks if recent searches has less than 10 searches
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