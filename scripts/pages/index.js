    async function getPhotographers() {
        try {
            const response = await fetch('data/photographers.json');
            const data = await response.json();
            console.log(data);
            return data.photographers;
        } catch (error) {
            console.error('error fetching data', error);
            return [];
        }
    }

    async function displayData(photographers) {
        const photographersSection = document.querySelector(".photographer_section");

        photographers.forEach((photographer) => {
            const photographerModel = photographerTemplate(photographer);
            const userCardDOM = photographerModel.getUserCardDOM();
            photographersSection.appendChild(userCardDOM);
        });
    }

    async function init() {
        const photographers = await getPhotographers();
        displayData(photographers);
    }
    
    init();