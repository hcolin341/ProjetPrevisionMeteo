const APIGEOLOCATE_KEY = "4cc84d243e404697a08e5534056dbde4"
const APIWEATHER_KEY = "d5feee14cc21f117d2a02f17f9c1e44e"

/*function changeLogo(type, logo)
{
    if(type == "broken clouds")

}*/

function recuperation()
{
    const VILLE = document.getElementById("ville").value;
    console.log(VILLE);

    let URLG = `https://api.opencagedata.com/geocode/v1/json?q=${VILLE}&key=${APIGEOLOCATE_KEY}&language=fr&pretty=1`

    console.log(URLG);

    fetch(URLG) 
    .then(response => { 
    if (response.status == 200) { // on vérifier que l'appel à l'API a fonctionné
        return response.json()  // ne pas oublier le return du callback
    }
    else console.log(`Erreur lorsqu'on a tenté de récupérer les data`); 
    })
    .then(data => {
    console.log(data.results[0].geometry);
    const LAT = data.results[0].geometry.lat; 
    const LON = data.results[0].geometry.lng;
   
    let URLW = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}3&lon=${LON}&appid=${APIWEATHER_KEY}`

    console.log(URLW);

    fetch(URLW)
    .then(reponse => { 
    if (reponse.status == 200) { // on vérifier que l'appel à l'API a fonctionné
        return reponse.json()  // ne pas oublier le return du callback
    }
    else console.log(`Erreur lorsqu'on a tenté de récupérer les data`); 
    })
    .then(donnee => {

    /*console.log(donnee);
    console.log(donnee.main.temp);*/
    console.log(donnee.weather[0].id);

    const typetemp = donnee.weather[0].id;

    const temperaturee = (donnee.main.temp - 278); 
    console.log(temperaturee);
    temperature.innerHTML=temperaturee + " °C";
  

    var monlogo = document.getElementById('logot');
    
    if(typetemp == 800)
        monlogo.src = "sun.svg";

    if(typetemp >= 200 && typetemp <= 531)
        monlogo.src = "rain.svg";

    if(typetemp == "")
        monlogo.src =  "cloudy.svg"

    if( 803 > typetemp > 800)
        monlogo.src =  "cloudy.svg"

    if( typetemp == 803 || typetemp == 804)
        monlogo.src = "clouds.svg"
    
    })

    })
    .catch(err => console.log(err))
}      