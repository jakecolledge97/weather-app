function getAPI(){
    const weatherApiKey = "cd641e1388cb206c1745095f98eaf34f";
    const city = "adelaide"
    const units = "metric"
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${weatherApiKey}`

    fetch(weatherApiUrl)
        .then(function(response){
            console.log(response)
            return response.json()
        })
        .then(function(data){
            console.log(data)
        })
}
