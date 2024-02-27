function displayModal() {
    const modal = document.getElementById("contact_modal");
	modal.style.display = "flex";

    const firstFocusableElement = modal.querySelector('[tabindex="0"]');
    
    if (firstFocusableElement) {
        firstFocusableElement.focus();
    }
    const sendFormButton = modal.querySelector('.contact_button');
    const closeButton = document.getElementById('close-modal-button');
    sendFormButton.addEventListener("keydown", (event) => {
            if (event.key === "Tab" && !event.shiftKey) {
                    event.preventDefault();
                    closeButton.focus();
                }
            });
    
            closeButton.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    closeModal();
                }
            });
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    closeModal();
                }
            })
}

const contactButton = document.getElementById('contact-button');
contactButton.addEventListener('click', displayModal);

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
}

function logData() {
    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    console.log(firstname, lastname, email, message)
    closeModal();
    
    return false
}

const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', function(e) {
    logData();
    e.preventDefault();
});