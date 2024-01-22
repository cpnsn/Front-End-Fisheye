// GET DATA
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

async function getMedia() {
    try {
        const response = await fetch('data/photographers.json');
        const data = await response.json();
        console.log(data);
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

// CREATE MEDIA
function createMediaElement(item) {
    if (item.image) {
        const img = document.createElement('img');
        img.src = `assets/photographs/${item.image}`;
        return img;
    } else if (item.video) {
        const video = document.createElement('video');
        video.src = `assets/photographs/${item.video}`;
        video.autoplay = true;
        video.controls = true;
        return video;
    } else {
        throw new Error('Unsupported media type');
    }
}

// HANDLE LIGHTBOX
let currentLightboxIndex = 0;

function prevLightboxItem(photographer, photographerMedia) {
  currentLightboxIndex = (currentLightboxIndex - 1 + photographerMedia.length) % photographerMedia.length;
  displayLightboxItem(photographer, photographerMedia[currentLightboxIndex]);
}

function nextLightboxItem(photographer, photographerMedia) {
  currentLightboxIndex = (currentLightboxIndex + 1) % photographerMedia.length;
  displayLightboxItem(photographer, photographerMedia[currentLightboxIndex]);
}

function openLightbox(photographer, item, index) {
    const lightbox = document.getElementById("lightbox");
	lightbox.style.display = "flex";
    currentLightboxIndex = index;
    displayLightboxItem(photographer, item);
}

function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    lightbox.style.display = "none";
}

function displayLightboxItem(photographer, item) {
    const container = document.getElementById("lightbox-container");
    container.innerHTML = "";
    const mediaDiv = document.createElement('div');
    mediaDiv.classList.add('photo-lightbox');
    const mediaElem = createMediaElement(item);
    
    const title = document.createElement('p');
    title.textContent = item.title;
    
    mediaDiv.appendChild(mediaElem);
    
    container.appendChild(mediaDiv);
    container.appendChild(title);
}

let sortOption = 'popular'; 

// DISPLAY HEADER
async function displayHeader(photographer) {
    const photographHeader = document.querySelector(".photograph-header");
    const moddalDiv = document.querySelector(".modal-div");
    const infoDiv = document.createElement('div');
    infoDiv.classList.add('info-div');

    const h1 = document.createElement('h1');
    h1.textContent = photographer.name;
    
    const location = document.createElement('p');
    location.textContent = `${photographer.city}, ${photographer.country}`;

    const tagline = document.createElement('p');
    tagline.textContent = `${photographer.tagline}`;
    tagline.classList.add('tagline');

    const photographerPicture = `assets/photographers/${photographer.portrait}`;
    const img = document.createElement( 'img' );
        img.setAttribute("src", photographerPicture)
        img.setAttribute("alt", photographer.name)

    infoDiv.appendChild(h1);
    infoDiv.appendChild(location);
    infoDiv.appendChild(tagline);
    photographHeader.appendChild(img);

    photographHeader.insertBefore(infoDiv, photographHeader.firstChild);

    const modalTitle = document.createElement('h2');
    modalTitle.textContent = `${photographer.name}`;

    moddalDiv.appendChild(modalTitle);
}

// SORT MEDIA
async function sortMedia(photographer, media) {
    const photographerMedia = media.filter(item => item.photographerId === photographer.id);
    
    const sortedMedia = photographerMedia.slice().sort((a, b) => {
        switch (sortOption) {
            case 'popular':
                return b.likes - a.likes;
            case 'date':
                return new Date(b.date) - new Date(a.date);
            case 'title':
                return a.title.localeCompare(b.title);
            default:
                return photographerMedia;
        }
    })
    return sortedMedia;
};

// DISPLAY DATA
async function displayData(photographer, media) {
    const photoGallery = document.querySelector('.photo-gallery');
    const totalLikesContainer = document.querySelector('.likes p')
    let photographerMedia = media.filter(item => item.photographerId === photographer.id);
    photographerMedia = await sortMedia(photographer, photographerMedia);

    let totalLikes = photographerMedia.reduce((sum, item) => sum + item.likes, 0);
    
    if (totalLikesContainer) {
        totalLikesContainer.textContent = totalLikes.toLocaleString();
    }

    photoGallery.innerHTML = '';
    
        photographerMedia.forEach((item, index) => {
            const mediaElement = createMediaElement(item);
            
            const title = document.createElement('p');
            title.textContent = item.title;
            
            const likes = document.createElement('div');
            likes.innerHTML = `${item.likes} <img id="likes-svg" src="assets/icons/heart.svg">`;

            likes.addEventListener('click', () => {
                item.likes += 1;
                likes.innerHTML = `${item.likes} <img id="likes-svg" src="assets/icons/heart.svg">`;
                likes.style.pointerEvents = 'none';

                updateTotalLikes(photographerMedia, totalLikesContainer)
            })
            
            const titleLikes = document.createElement('div');
            titleLikes.classList.add('title-likes');
            titleLikes.append(title);
            titleLikes.append(likes);

            const container = document.createElement('div');
            container.classList.add('photo-container');
          
            container.appendChild(mediaElement);
            container.appendChild(titleLikes);

            mediaElement.addEventListener('click', () => openLightbox(photographer, item, index));
          
            photoGallery.appendChild(container);
          });
}

function updateTotalLikes(photographerMedia, totalLikesContainer) {
    const totalLikes = photographerMedia.reduce((sum, item) => sum + item.likes, 0);

    if (totalLikesContainer) {
        totalLikesContainer.textContent = totalLikes.toLocaleString();
    }
}

function toggleOptions() {
    const title = document.querySelector('.select-title');
    const options = document.querySelector('.select-options');
    options.style.display = options.style.display === 'none' ? 'block' : 'none';
    title.style.display = options.style.display === 'none' ? 'block' : 'none';
  } 

  async function selectOption(option) {
    sortOption = option;

    const title = document.querySelector('.select-title');
    const options = document.querySelector('.select-options');
    options.style.display = 'none';
    title.style.display = 'block';
    const optionTranslations = {
        'popular': 'Popularité',
        'date': 'Date',
        'title': 'Titre'
      };
  
    title.innerText = optionTranslations[option] || option;    
    
    const { photographer, photographerMedia } = await getPhotographerData(photographerId);
    displayData(photographer, photographerMedia);
}

async function init() {
    let { photographer, photographerMedia } = await getPhotographerData(photographerId);
    photographerMedia = await sortMedia(photographer, photographerMedia);

    displayHeader(photographer)
    displayData(photographer, photographerMedia);

    document.getElementById('left-arrow').addEventListener('click', () => prevLightboxItem(photographer, photographerMedia));
    document.getElementById('right-arrow').addEventListener('click', () => nextLightboxItem(photographer, photographerMedia));
    document.getElementById('close-lightbox').addEventListener('click', closeLightbox);
}

init();