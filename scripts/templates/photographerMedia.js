// CREATE MEDIA
function createMediaElement(item) {
    if (item.image) {
        const img = document.createElement('img');
        img.src = `assets/photographs/${item.image}`;
        img.alt = `${item.title}, closeup view`;
        img.tabIndex = "0";
        img.addEventListener('keydown', async (event) => {
            if (event.key === 'Enter') {
                const { photographer, photographerMedia } = await getPhotographerData();
                openLightbox(photographer, item, photographerMedia.indexOf(item));
            }
        });
        return img;
    } else if (item.video) {
        const video = document.createElement('video');
        video.src = `assets/photographs/${item.video}`;
        video.title = `${item.title}, closeup view`;
        video.autoplay = true;
        video.controls = true;
        video.tabIndex = "0";
        video.addEventListener('keydown', async (event) => {
            if (event.key === 'Enter') {
                const { photographer, photographerMedia } = await getPhotographerData();
                openLightbox(photographer, item, photographerMedia.indexOf(item));
            }
        });
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

document.addEventListener('keydown', async (event) => {
    const lightbox = document.getElementById("lightbox");
    const { photographer, photographerMedia } = await getPhotographerData(photographerId);

    if (lightbox.style.display === "flex") {
        if (event.key === 'ArrowLeft') {
            prevLightboxItem(photographer, photographerMedia, event);
        } else if (event.key === 'ArrowRight') {
            nextLightboxItem(photographer, photographerMedia, event);
        } else if (event.key === 'Escape') {
            closeLightbox();
        }
    }
    document.getElementById('left-arrow-button').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            prevLightboxItem(photographer, photographerMedia, event);
        }
    });
    
    document.getElementById('close-lightbox-button').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            closeLightbox();
        }
    });
    
    document.getElementById('right-arrow-button').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            nextLightboxItem(photographer, photographerMedia, event);
        }
    });
});

function openLightbox(photographer, item, index) {
    const lightbox = document.getElementById("lightbox");
	lightbox.style.display = "flex";
    currentLightboxIndex = index;
    displayLightboxItem(photographer, item);
    
    const firstFocusableElement = lightbox.querySelector('[tabindex="0"]');
    if (firstFocusableElement) {
        firstFocusableElement.focus();
    }
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
    const modal = document.getElementById("contact_modal");
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
    modal.setAttribute('aria-label', `Contact Me ${photographer.name}`);

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
}

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
            mediaElement.style.cursor = "pointer";
            const title = document.createElement('p');
            title.textContent = item.title;
            
            const likes = document.createElement('button');
            likes.innerHTML = `${item.likes} <img id="likes-svg" alt="likes" src="assets/icons/heart.svg">`;

            item.liked = false;

            likes.addEventListener('click', () => {
                if (item.liked) {
                    item.likes -= 1;
                } else {
                    item.likes += 1;
                }
                
                item.liked = !item.liked; 
                likes.innerHTML = `${item.likes} <img id="likes-svg" alt="likes" src="assets/icons/heart.svg">`;

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

    if (options.style.display === 'none' || options.style.display === '') {
        title.style.display = 'none';
        options.style.display = 'block';
    } else {
        title.style.display = 'flex';
        options.style.display = 'none';
    }
  }

  document.addEventListener('keydown', function (event) {
      const options = document.querySelector('.select-options');      
      if (event.key === 'Enter') {
          const computedStyle = window.getComputedStyle(options);
          const isOptionsVisible = computedStyle.display !== 'none';
      
          if (!isOptionsVisible) {
              toggleOptions();
          } else {
              const focusedOption = document.activeElement;
              if (focusedOption && focusedOption.classList.contains('select-options')) {
                  const selectedOption = document.querySelector('.select-options [tabindex="0"]');
                  if (selectedOption) {
                    selectOption(selectedOption.id.split('-')[1]);
                      toggleOptions();
                  }
              }
          }
      } else if (event.key === 'Escape' && options.style.display !== 'none') {
          toggleOptions();
      }
  });

document.querySelectorAll('.select-options [role="listbox"]').forEach(option => {
    option.addEventListener('click', () => selectOption(option.id.split('-')[1]));
    option.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            selectOption(option.id.split('-')[1]);
        }
    });
});

async function selectOption(option) {
    sortOption = option;
    const title = document.querySelector('.select-title');
    const options = document.querySelector('.select-options');
    options.style.display = 'none';
    title.style.display = 'flex';
    const optionTranslations = {
        'popular': 'Popularité',
        'date': 'Date',
        'title': 'Titre'
    };

    title.innerText = optionTranslations[option] || option;

    const arrowDown = document.createElement('img');
    arrowDown.src = 'assets/icons/arrow_down.svg';
    arrowDown.alt = 'icon';
    title.appendChild(arrowDown);

    const { photographer, photographerMedia } = await getPhotographerData(photographerId);
    sortMedia(photographer, photographerMedia).then(sortedMedia => {
        displayData(photographer, sortedMedia);
    });
}