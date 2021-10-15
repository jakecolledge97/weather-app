const weatherApiKey = "cd641e1388cb206c1745095f98eaf34f";
var recentSearch = []
var recentSearchField = $('#search-field').find('.block').last()
var units = 'metric';
var city = $('#search-field').find('input')

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
        })
}

//create recent items
function recentItems(){
    if(city.val()){      
        city.css('box-shadow', 'none') 
        //checks if recent searches has less than 10 searches
        if(recentSearch.length<10){
            //pushes the search input to the recent searches array
            recentSearch.push(city.val())
            localStorage.setItem('recentSearch', JSON.stringify(recentSearch))
            city.val('')
        }else{
            //removes the first on the array if there is already 10
            recentSearch.shift()
            //pushes the new one to the array
            recentSearch.push(city.val())
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
    //creates new buttons
    for(i=0;i<recentSearch.length;i++){
        var newButton = $('<button>').attr('class','button p-3 m-3 is-info is-fullwidth').text(recentSearch[i])
        recentSearchField.children().prepend(newButton)
    }
}