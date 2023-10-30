//Mettre le code JavaScript lié à la page photographer.html

async function getPhotographers() {
    try {
        const response = await fetch('data/photographers.json');
        const data = await response.json();
        console.log(data);
        return data.photographers;
    } catch (error) {
        console.error('error fetching data', error);
        return [];
    };
}

const params = new URLSearchParams(window.location.search);
const photographerId = params.get('id');


async function displayData(photographer) {
    const photographHeader = document.querySelector(".photograph-header");

    const h2 = document.createElement('h2');
    h2.textContent = photographer.name;
    
    const location = document.createElement('p');
    location.textContent = `${photographer.city}, ${photographer.country}`;
    
    photographHeader.appendChild(h2);
    photographHeader.appendChild(location);

    return (photographHeader);
}


async function init() {
    const photographers = await getPhotographers();
    const photographer = photographers.find(photographer => photographer.name === photographerId);
    displayData(photographer);
}

init();

