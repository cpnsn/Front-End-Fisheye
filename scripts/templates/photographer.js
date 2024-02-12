function photographerTemplate(data) {
    const { name, portrait, city, country, tagline, price } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement( 'article' );
        article.setAttribute("aria-label", `${name} details`)

        const a = document.createElement('a');
        a.setAttribute("href", `photographer.html?id=${name}`);

        const img = document.createElement( 'img' );
        img.setAttribute("src", picture)

        const h2 = document.createElement( 'h2' );
        h2.textContent = name;

        a.appendChild(img);
        a.appendChild(h2);

        const p1 = document.createElement( 'p' );
        p1.textContent = city + ', ' + country;
        p1.setAttribute("id", "location");

        const p2 = document.createElement( 'p' );
        p2.textContent = tagline;
        p2.setAttribute("id", "tagline");

        const p3 = document.createElement( 'p' );
        p3.textContent = price + '€/jour';
        p3.setAttribute("id", "price");

        article.appendChild(a);
        article.appendChild(p1);
        article.appendChild(p2);
        article.appendChild(p3);

        return (article);
    }
    return { name, picture, getUserCardDOM }
}