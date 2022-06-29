let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, classLocation, side) => {
    // imdbID
    const config = {
        params: {
            apikey: "a5b1b7fb",
            i: movie.imdbID
        }
    };
    const res = await axios.get(`http://www.omdbapi.com/`, config);
    const movieDetails = res.data;
    movieDetailsTemplate(movieDetails, classLocation)

    if (side === "left") {
        leftMovie = res.data;
    } else {
        rightMovie = res.data;
    }

    if (leftMovie && rightMovie) {
        runStatsComparison()
    }

}

const runStatsComparison = () => {
    const leftSideStats = document.querySelectorAll(".left-target .notification") //es un arraylike
    const rightSideStats = document.querySelectorAll(".right-target .notification")

    leftSideStats.forEach((leftStat, index) => {
        rightStat = rightSideStats[index]

        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);



        if (leftSideValue && rightSideValue) {
            console.log(leftSideValue)
            console.log(rightSideValue)
            if (leftSideValue > rightSideValue) {
                rightStat.classList.remove("is-primary")
                rightStat.classList.add("is-warning")
                // console.log(leftSideValue)
                // console.log("izquierda gana")
            } else {
                leftStat.classList.remove("is-primary")
                leftStat.classList.add("is-warning")
                // console.log(rightSideValue)
                // console.log("derecha gana")
            }
        }



    })


}

const movieDetailsTemplate = (movieDetails, classLocation) => {
    const div = document.querySelector(classLocation);
    const dollars = parseInt(movieDetails.BoxOffice.replace(/\$/g, "").replace(/,/g, ""))
    const metascore = parseInt(movieDetails.Metascore);
    const imdbRating = parseFloat(movieDetails.imdbRating);
    const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ""))

    div.innerHTML = `
    <article class="media">
        <figure class="media-left">
            <p class="image">
            <img src="${movieDetails.Poster}" alt="${movieDetails.Title} movie poster">
            </p>
        </figure>

        <div class="media-content">
            <div class="content">
                <h1>
                    ${movieDetails.Title}
                </h1>
                <h4>
                    ${movieDetails.Genre}
                </h4>
                <p>
                    ${movieDetails.Plot}
                </p>

            </div>
        </div>
    </article>
    <article class="notification is-primary">
        <p class="title">
            ${movieDetails.Awards}
        </p>

        <p class="subtitle">
            Awards 
        </p>
    </article>

    <article data-value=${dollars} class="notification is-primary">
        <p class="title">
            ${movieDetails.BoxOffice}
        </p>

        <p class="subtitle">
            BoxOffice 
        </p>
    </article>

    <article data-value=${metascore} class="notification is-primary">
        <p class="title">
            ${movieDetails.Metascore}
        </p>

        <p class="subtitle">
            Metascore 
        </p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
        <p class="title">
            ${movieDetails.imdbRating}
        </p>

        <p class="subtitle">
            imdbRating 
        </p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
        <p class="title">
            ${movieDetails.imdbVotes}
        </p>

        <p class="subtitle">
            imdbVotes 
        </p>
    </article>
    `;
}

const autocompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster
        return `
        <img src="${imgSrc}">
        ${movie.Title} (${movie.Year})
        `
    },
    inputValue(movie) {
        return movie.Title
    },
    async fetchData(searchFor) {
        const config = {
            params: {
                apikey: "a5b1b7fb",
                s: searchFor
            }
        };
        const res = await axios.get(`http://www.omdbapi.com/`, config);
        if (res.data.Error) {
            return []
        }
        return res.data.Search;

    }

}

createAutocompleteWidget({
    rootLocation: document.querySelector(".left-autocomplete"),
    onOptionSelect(movie) {
        onMovieSelect(movie, ".left-target", "left");
    },
    ...autocompleteConfig
})

createAutocompleteWidget({
    rootLocation: document.querySelector(".right-autocomplete"),
    onOptionSelect(movie) {
        onMovieSelect(movie, ".right-target", "right");
    },
    ...autocompleteConfig
})

