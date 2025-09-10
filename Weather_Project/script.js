const btn = document.getElementById("searchBtn");
const inputCity = document.getElementById("cityInput");


//location
let locDiv = document.createElement("div");
let locImg = document.createElement("img");
locImg.src = "location.svg";

//Weather
let weaDiv = document.createElement("div");
let weaImg = document.createElement("img");
weaImg.src = "weather.svg";


//temp
let tempDiv = document.createElement("div");
let tempImg = document.createElement("img");
tempImg.src = "temp.svg";


//time
let timeDiv = document.createElement("div");
let timeImg = document.createElement("img");
timeImg.src = "clock.svg";


async function getData(city)
{
    const promise = await fetch(`https://api.weatherapi.com/v1/current.json?key=247360087c384ca6a0092354250109&q=${city}&aqi=yes`);
    return await promise.json();
}

btn.addEventListener("click" , async()=>{
    const city = inputCity.value;
    const result  = await getData(city);
    

    // Getting Elements by class Name :-
    //1. Location
    locDiv.innerText = result.location.name;
    let loc = document.getElementsByClassName("location")[0];
    loc.appendChild(locImg);
    loc.appendChild(locDiv);
    //2. Weather
    weaDiv.innerText = result.current.condition.text;
    let wea = document.getElementsByClassName("weather")[0];
    wea.appendChild(weaImg);
    wea.appendChild(weaDiv);
    //3. temp
    tempDiv.innerText = result.current.temp_c;
    let temp = document.getElementsByClassName("temp")[0];
    temp.appendChild(tempImg);
    temp.appendChild(tempDiv);
    //4. time
    timeDiv.innerText = result.location.localtime;
    let  time = document.getElementsByClassName("time")[0];
    time.appendChild(timeImg);
    time.appendChild(timeDiv);
    
})