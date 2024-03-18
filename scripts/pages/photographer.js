// GET DATA
async function getPhotographers() {
    try {
        const response = await fetch('data/photographers.json');
        const data = await response.json();
        return data.photographers;
    } catch (error) {
        console.error('error fetching data', error);
        return [];
    }
}

async function getMedia() {
    try {
        const response = await fetch('data/photographers.json');
        const data = await response.json();
        return data.media;
    } catch (error) {
        console.error('error fetching media data', error);
        return [];
    }
}

const params = new URLSearchParams(window.location.search);
const photographerId = params.get('id');

// GET PHOTOGRAPHER DATA
async function getPhotographerData() {
    const photographers = await getPhotographers();
    const media = await getMedia();
    const photographer = photographers.find(photographer => photographer.name === photographerId);
    const photographerMedia = media.filter(item => item.photographerId === photographer.id);
    return { photographer, photographerMedia };
}

async function init() {
    let { photographer, photographerMedia } = await getPhotographerData();

    displayHeader(photographer)
    displayData(photographer, photographerMedia);
}

init();