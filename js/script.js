//получение списка городов из псевдосписка
function getCityList () {
    let cityListSelect = document.querySelector('.cityList');

    for (let city of cityList) {
        let option = document.createElement('option');
        option.innerText = city.name;
        option.value = city.id;
        cityListSelect.appendChild(option);
    }
}

//получение выбранного города
function getCity () {
    let currentCity = document.querySelector('.cityList');
    currentCity = {
        "id": currentCity.options[currentCity.selectedIndex].value,
        "name": currentCity.options[currentCity.selectedIndex].innerText,
    };
    return currentCity;
}

//преобразование времени из Unix в "часы : минуты"
function timeConverter (unixTime) {
    let time = new Date(unixTime * 1000);
    let hour = time.getHours();
    let min = time.getMinutes();

    if (min < 10) {
       min = '0' + String(min);
    }

    time = `${hour}:${min}`;
    return time;
}

//запрос текущей погоды
async function getWeather (cityId) {

    let result = '';

    let weather = new Promise((resolve, reject) => {
        fetch(`http://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=&lang=ru`)
            .then(data => {
                resolve(data.json());
            })
    });

    await weather.then(data => {
        result = data;
    });

    return result;
}

//запрос прогноза погоды на 5-6 дней
async function getForecast (cityId) {

    let result = '';

    let weather = new Promise((resolve, reject) => {
        fetch(`http://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=&lang=ru`)
            .then(data => {
                resolve(data.json());
            })
    });

    await weather.then(data => {
        result = data;
    });

    return result;
}

//вывод погоды на страницу
async function showWeather () {

    let weather = '';
    let forecast = '';
    let weatherOutput = '';
    let forecastOutput = '';
    let date = '';
    currentCity = getCity();

    weather =  await getWeather(currentCity.id);
    forecast =  await getForecast(currentCity.id);

    document.querySelector('h1').innerText = `Погода в городе ${currentCity.name}`;
    weatherOutput += `<p class="temp">${Math.round(weather.main.temp - 273.15)} &#8451;</p>`;
    weatherOutput += `<p class="temp-fill">Ощущается как ${Math.round(weather.main.feels_like - 273.15)} &#8451;</p>`;
    weatherOutput += `<div class="icon"><img src="http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png" alt="иконка"></div>`;
    weatherOutput += `<p class="weather-title">${weather.weather[0].description}</p>`;
    weatherOutput += `<p class="humidity">Влажность: ${weather.main.humidity} %</p>`;
    weatherOutput += `<p class="pressure">Давление: ${Math.round(weather.main.pressure * 0.750062)} мм рт. ст.</p>`;
    weatherOutput += `<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12"><p class="sunrise">Рассвет: ${timeConverter(weather.sys.sunrise)}</p></div>`;
    weatherOutput += `<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12"><p class="sunset">Закат: ${timeConverter(weather.sys.sunset)}</p></div>`;

    document.querySelector('.weather-now').innerHTML = weatherOutput;

    for(let item of forecast.list) {
        if(date === item.dt_txt.slice(5,10)) {
            forecastOutput += `<div class="forecast-time">`;
            forecastOutput += `<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">${timeConverter(item.dt)}</div>`;
            forecastOutput += `<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 forecast-icon"><img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png"></div>`;
            forecastOutput += `<div class="col-lg-7 col-md-7 col-sm-7 col-xs-7 forecast-temp">${Math.round(item.main.temp - 273.15)} &#8451; / ${Math.round(item.main.feels_like - 273.15)} &#8451;</div>`;
            forecastOutput += `<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 forecast-title">${item.weather[0].description}</div>`;
            forecastOutput += `<div class="clr"></div>`;
            forecastOutput += `</div>`;
        } else if (date === '') {
            forecastOutput += '<div class="col-lg-2 col-md-2 col-sm-4 col-xs-12 flex-item"><div class="forecast">';
            forecastOutput += `<p class="forecast-date">${item.dt_txt.slice(8,10)}.${item.dt_txt.slice(5,7)}</p>`;
            forecastOutput += `<div class="forecast-time">`;
            forecastOutput += `<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">${timeConverter(item.dt)}</div>`;
            forecastOutput += `<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 forecast-icon"><img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png"></div>`;
            forecastOutput += `<div class="col-lg-7 col-md-7 col-sm-7 col-xs-7 forecast-temp">${Math.round(item.main.temp - 273.15)} &#8451; / ${Math.round(item.main.feels_like - 273.15)} &#8451;</div>`;
            forecastOutput += `<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 forecast-title">${item.weather[0].description}</div>`;
            forecastOutput += `<div class="clr"></div>`;
            forecastOutput += `</div>`;
        } else {
            forecastOutput += '</div></div>';
            forecastOutput += '<div class="col-lg-2 col-md-2 col-sm-4 col-xs-12 flex-item"><div class="forecast">';
            forecastOutput += `<p class="forecast-date">${item.dt_txt.slice(8,10)}.${item.dt_txt.slice(5,7)}</p>`;
            forecastOutput += `<div class="forecast-time">`;
            forecastOutput += `<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">${timeConverter(item.dt)}</div>`;
            forecastOutput += `<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 forecast-icon"><img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png"></div>`;
            forecastOutput += `<div class="col-lg-7 col-md-7 col-sm-7 col-xs-7 forecast-temp">${Math.round(item.main.temp - 273.15)} &#8451; / ${Math.round(item.main.feels_like - 273.15)} &#8451;</div>`;
            forecastOutput += `<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 forecast-title">${item.weather[0].description}</div>`;
            forecastOutput += `<div class="clr"></div>`;
            forecastOutput += `</div>`;
        }

        date = item.dt_txt.slice(5,10);
    }

    forecastOutput += '</div></div>';
    document.querySelector('.forecast-wrap').innerHTML = forecastOutput;
}

//вызов: получение списка городов, показ погоды выбранного города
getCityList();
showWeather();

//событие на смену городов
document.querySelector('.cityList').addEventListener("change", showWeather);
