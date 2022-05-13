document.addEventListener("DOMContentLoaded", function() {

monstockage = localStorage;

const bouttonFonction = document.getElementById("soumettre");

bouttonFonction.addEventListener("click", (event) => {
    event.preventDefault();
    recuperation_donnees(monstockage);
})})

function recuperation_donnees(monstockage)
{
    const ville = document.getElementById("ville").value;
    const nombre = document.getElementById("NombreJours").value;
    const apigeolocate_key = "4cc84d243e404697a08e5534056dbde4"
    const apiweather_key = "d5feee14cc21f117d2a02f17f9c1e44e"

     // init du stockage local (non necessaire)

    var lavilledonnee = monstockage.getItem(ville);

    if(lavilledonnee)
    {
        var meteos = JSON.parse(lavilledonnee);
        displayWeather(meteos, nombre);
        console.log("elle y est deja")
    }
    else
    {
        getGeolocateFromApi(ville, apigeolocate_key)
        .then(data => getWeatherFromApi(data.lat, data.lon, nombre, ville, monstockage, apiweather_key))
        .then(donnees => displayWeather(donnees, nombre))
        console.log("elle y etait pas")
    }
    console.log(lavilledonnee)
}

function getGeolocateFromApi(ville, apigeolocate_key)
{
    let UrlGeolocate = `https://api.opencagedata.com/geocode/v1/json?q=${ville}&key=${apigeolocate_key}&language=fr&pretty=1`
    return fetch(UrlGeolocate) 
    .then(response => { 
    if (response.status == 200)
    { 
        return response.json(); 
    }
    else console.log(`Erreur lorsqu'on a tenté de récupérer les data`); 
    })
    .then(data => 
    {   
        const lat = data.results[0].geometry.lat; 
        const lon = data.results[0].geometry.lng;

        const position = {lat, lon};
        return position;
    }
    )
    .catch(err => console.log(err))
}

function getWeatherFromApi(lat, lon, nombre, ville, monstockage, apiweather_key)
{

    let urlWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={current,minutely,hourly,alerts}&appid=${apiweather_key}`
    
    return fetch(urlWeather)
    .then(reponse => { 
    if (reponse.status == 200) { 
        return reponse.json()  
    }
    else console.log(`Erreur lorsqu'on a tenté de récupérer les data`); 
    })
    .then(donnee => {
    
    var meteos = []; 
      for (var i = 0; i < 8; i++)
    {
        meteos[i] = donnee.daily[i].weather[0].id;  // recuperation du code meteo dans le retour du fetch
    }
    meteos[7] = donnee.current.uvi;

    monstockage.setItem(ville, JSON.stringify(meteos)) // Ajoute le tableau Meteos dans la base de donnees locales 

    //const illumi = donnee.current.uvi;
    
    return meteos;
})}

function displayWeather(code_meteo, nombre)
{
    resultats.innerHTML = "";
    
    //var code_meteo = JSON.parse(lavilledonnee);
    //console.log(code_meteo)

    let ladate = new Date;
    let lasemaine = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi","Vendredi", "Samedi"]
    let indexjour = ladate.getDay(); 

    var imagSrc;

    for (var i = 0; i < nombre; i++)
    {
        if(code_meteo[i] == 800)
           imagSrc = "./images/sun.svg";

        if(code_meteo[i] >= 200 && code_meteo[i] <= 531)
            imagSrc = "./images/rain.svg";

        if(code_meteo[i] < 803 && code_meteo[i] > 800)
            imagSrc =  "./images/cloudy.svg"

        if(code_meteo[i] == 803 || code_meteo[i] == 804)
            imagSrc = "./images/clouds.svg"

        lejour = lasemaine[indexjour];

        let d = document.createElement("div");
        d.classList = "resultat";
        let h = document.createElement("H3");
        let t = document.createTextNode(lejour);
        let img = document.createElement("img");
        img.src = imagSrc;

        h.appendChild(t)
        d.appendChild(h);
        d.appendChild(img);

        document.getElementById("resultats").appendChild(d);

        if (indexjour + 1 == 7)
        {  indexjour = 0; }
        else 
            indexjour++;
    }
    const corps = document.getElementById("corps");
    const result = document.getElementById("resultats");

    if (code_meteo[7] == 0)
    {
        corps.style["background-color"] = "";
        corps.style["background"] = "linear-gradient(0deg, #003AFF, #010F40)";
        result.style["color"] = "white";
    }
    else 
    {
        corps.style["background"] = "";
        corps.style["background-color"] = "rgba(25, 140, 255, 0.725)"
        result.style["color"] = "black";
    }
}