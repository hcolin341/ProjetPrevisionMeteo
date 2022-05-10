function recuperation_donnees   ()
{
    const VILLE = document.getElementById("ville").value;
    const NOMBRE = document.getElementById("NombreJours").value;
    const APIGEOLOCATE_KEY = "4cc84d243e404697a08e5534056dbde4"
    const APIWEATHER_KEY = "d5feee14cc21f117d2a02f17f9c1e44e"
    let URLG = `https://api.opencagedata.com/geocode/v1/json?q=${VILLE}&key=${APIGEOLOCATE_KEY}&language=fr&pretty=1`
    
    let ladate = new Date;
    let lasemaine = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi","Vendredi", "Samedi"]
    let indexjour = ladate.getDay(); 

    fetch(URLG) 
    .then(response => { 
    if (response.status == 200)
    { 
        return response.json() 
    }
    else console.log(`Erreur lorsqu'on a tenté de récupérer les data`); 
    })
    .then(data => {
    const LAT = data.results[0].geometry.lat; 
    const LON = data.results[0].geometry.lng;
    let URLW = `https://api.openweathermap.org/data/2.5/onecall?lat=${LAT}&lon=${LON}&exclude={current,minutely,hourly,alerts}&appid=${APIWEATHER_KEY}`
    console.log(URLW);
    fetch(URLW)
    .then(reponse => { 
    if (reponse.status == 200) { 
        return reponse.json()  
    }
    else console.log(`Erreur lorsqu'on a tenté de récupérer les data`); 
    })
    .then(donnee => {
    resultats.innerHTML = "";
    var code_meteo;
      for (var i = 0; i < NOMBRE; i++)
    {
        code_meteo = donnee.daily[i].weather[0].id;      
        if(code_meteo == 800)
           imgSrc = "./images/sun.svg";

        if(code_meteo >= 200 && code_meteo <= 531)
            imgSrc = "./images/rain.svg";

        if(code_meteo == "")
            imgSrc =  "./images/cloudy.svg"

        if( code_meteo < 803 && code_meteo > 800)
            imgSrc =  "./images/cloudy.svg"

        if( code_meteo == 803 || code_meteo == 804)
            imgSrc = "./images/clouds.svg"

        lejour = lasemaine[indexjour];

        let d = document.createElement("div");
        d.classList = "resultat";
        let h = document.createElement("H3");
        let t = document.createTextNode(lejour);
        let img = document.createElement("img");
        img.src = imgSrc;

        h.appendChild(t)
        d.appendChild(h);
        d.appendChild(img);

        document.getElementById("resultats").appendChild(d);

        if (indexjour + 1 == 7)
        {  indexjour = 0; }
        else 
            indexjour++;

        const illumi = donnee.current.uvi;
        const DOCU = document.getElementById("tout");
        const CORPS = document.getElementById("corps");
        if (illumi == 0)
        {
            CORPS.style["background-color"] = "";
            CORPS.style["background"] = "linear-gradient(0deg, #003AFF, #010F40)";
            console.log("test");    
        }
        else 
        {
            CORPS.style["background"] = "";
            CORPS.style["background-color"] = "rgba(25, 140, 255, 0.725)"
        }
    }
    })
    })
    .catch(err => console.log(err))
}      