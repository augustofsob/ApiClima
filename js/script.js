// Variáveis e seleção de elementos


const apikey = "fe1dc5a388ec1d626c288dd1a7e6f210";
const apiCountryURL = "https://flagsapi.com/png/";
const pexelsApiKey = "nlUHeqIg56dzf5qypY1ot9Se3NeM4LoXrL1SvDv45T7nKXAqO3GrUwG2";




const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");


const cityElement = document.querySelector("#city")
const tempElement = document.querySelector("#temperature span")
const descElement = document.querySelector("#description")
const weatherIconElement = document.querySelector("#weather-icon")
const countryElement = document.querySelector("#country")
const humidityElement = document.querySelector("#umidity span")
const windElement = document.querySelector("#wind span")


const weatherContainer = document.querySelector("#weather-data")




let map;
let marker;


// Funções


const getWeatheData = async (city) => {
    const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apikey}&lang=pt_br`;


    const res = await fetch(apiWeatherURL);
    const data = await res.json();


    return data;
};


const showWeatherData = async (city) => {
    const data = await getWeatheData(city);
    const images = await getCityImages(city);


    startBackgroundSlideshow(images);


    cityElement.innerText = data.name;
    tempElement.innerText = parseInt(data.main.temp);
    descElement.innerText = data.weather[0].description;
    weatherIconElement.setAttribute("src", `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
    countryElement.setAttribute("src", `https://flagsapi.com/${data.sys.country}/flat/64.png`);
    humidityElement.innerText = `${data.main.humidity}%`;
    windElement.innerText = `${data.wind.speed}km/h`;


    weatherContainer.classList.remove("hide");


    showMap(data.coord.lat, data.coord.lon);
    document.querySelector(".content-container").classList.remove("hide");




};




// Eventos


searchBtn.addEventListener("click", (e) => {
    e.preventDefault();


    const city = cityInput.value;


    showWeatherData(city);
});


cityInput.addEventListener("keyup", (e) => {
    if(e.code === "Enter") {
        const city = e.target.value;


        showWeatherData(city);
    }
})


// -------------- imagens de fundo --------- //


const getCityImages = async (city) => {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${city}&per_page=10`, {
        headers: {
            Authorization: pexelsApiKey
        }
    });


    const data = await response.json();
    return data.photos.map(photo => photo.src.landscape);
};




let slideshowInterval;


const startBackgroundSlideshow = (images) => {
    let index = 0;


    if (slideshowInterval) clearInterval(slideshowInterval);


    if (images.length === 0) return;


    document.body.style.backgroundImage = `url(${images[index]})`;


    slideshowInterval = setInterval(() => {
        index = (index + 1) % images.length;
        document.body.style.backgroundImage = `url(${images[index]})`;
    }, 5000);
};


// --------- mapa --------- //




const showMap = (lat, lon) => {
    const maptilerKey = "ewBJm6ceyFxCNUGqtYlG";


    if (!map) {
        map = L.map('map').setView([lat, lon], 12);


        L.tileLayer(`https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${maptilerKey}`, {
            attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> & contributors',
        }).addTo(map);


        marker = L.marker([lat, lon]).addTo(map);
    } else {
        map.setView([lat, lon], 12);
        marker.setLatLng([lat, lon]);
    }


    document.querySelector("#map").classList.remove("hide");
    document.querySelector("#toggle-map-btn").classList.remove("hide");

};

const toggleMapBtn = document.querySelector("#toggle-map-btn");

toggleMapBtn.addEventListener("click", () => {
  const mapContainer = document.querySelector("#map");

  if (mapContainer.classList.contains("hidden")) {
    mapContainer.classList.remove("hidden");
    toggleMapBtn.textContent = "Minimizar Mapa";
    map.invalidateSize(); // Corrige visualização
  } else {
    mapContainer.classList.add("hidden");
    toggleMapBtn.textContent = "Mostrar Mapa";
  }
});
