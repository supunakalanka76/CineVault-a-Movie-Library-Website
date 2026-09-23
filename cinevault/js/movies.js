"use strict";

// CineVault - Movie search and Favorite functionality

const API_URL = "https://api.tvmaze.com/search/shows";

const FALLBACK_IMAGE = "assets/images/placeholder-movie.svg";

const searchInput = document.querySelector("#movie-search");

const searchResults = document.querySelector("#search-results");

const movieGrid = document.querySelector("#movie-grid");


// states
let debounceTimer = null;
let currentRequest = null;
let currentResults = [];
let activeResultIndex = -1;


// Helpers
function stripHtml(html = "") {
    const temporaryElement =
        document.createElement("div");

    temporaryElement.innerHTML = html;

    return (
        temporaryElement.textContent ||
        temporaryElement.innerText || 
        ""
    ).trim();
}

function truncateText(text, maxLength = 150) {
    if (!text) {
        return "No description is currently available.";
    }

    if (text.length <= maxLength) {
        return text;
    }

    return `${text.slice(0, maxLength).trim()}...`;
}

function getShowImage(show) {
    return (
        show.image?.medium ||
        show.image?.original ||
        FALLBACK_IMAGE
    )
}

function getShowYear(show) {
    if (!show.premiered) {
        return "Year unavailable";
    }

    return show.premiered.slice(0, 4);
}

// Search Result Visibility
function openSearchResults() {
    searchResults.hidden = false;

    searchInput.setAttribute(
        "aria-expanded", 
        "true"
    );
}

function closeSearchResults() {
    searchResults.hidden = true;

    searchInput.setAttribute(
        "aria-expanded", 
        "false"
    );

    activeResultIndex = -1;
}

// Search Messages
function showSearchMessage(message) {
    searchResults.innerHTML = "";

    const paragraph = document.createElement("p");

    paragraph.className = "search-results__message";

    paragraph.textContent = message;

    searchResults.appendChild(paragraph);

    openSearchResults();
}

// Render Search Results
function renderSearchResults(results) {
    searchResults.innerHTML = "";

    currentResults = results;
    activeResultIndex = -1;

    if (!results.length) {
        showSearchMessage("No results found.");
        return;
    }

    results.slice(0, 6).forEach((result, index) => {
        const show = result.show;

        const button = document.createElement("button");

        button.type = "button";

        button.className = "search-result";

        button.setAttribute(
            "role",
            "option"
        );

        button.dataset.index = index;

        // Image
        const image = document.createElement("img");

        image.className = "search-result__image";

        image.src = getShowImage(show);
        image.alt = "";

        // Content
        const content = document.createElement("span");

        content.className = "search-result__content";

        const title = document.createElement("span");

        title.className = "search-result__title";

        title.textContent = show.name || "Untitled";


        const meta = document.createElement("span");

        meta.className = "search-result__meta";

        const genres = show.genres?.length
            ? show.genres
                .slice(0, 2)
                .join(", ") 
            : "Genre unavailable"
        ;

        meta.textContent = `${getShowYear(show)} • ${genres}`;


        content.append(title, meta);

        button.append(image, content);


        // Search Result
        button.addEventListener("click", () => {
            addMovie(show);
        });

        searchResults.appendChild(button);
    });

    openSearchResults();
}

// TVmaze API Search
async function searchShows(query) {

    if (currentRequest) {
        currentRequest.abort();
    }

    currentRequest = new AbortController();

    showSearchMessage("Searching...");

    try {

        const response = await fetch (
            `${API_URL}?q=${encodeURIComponent(query)}`,
            {
                signal: currentRequest.signal
            }
        );

        if (!response.ok) {
            throw new Error(
                `Request failed with status ${response.status}`
            )
        }

        const data = await response.json();

        renderSearchResults(data);
    } catch (error) {

        if (error.name === "AbortError") {
            return;
        }

        console.error("Movie search failed:", error);

        showSearchMessage("Unable to load results. Please try again later.");
    } finally {

        currentRequest = null;

    }
}


// Search Input
searchInput.addEventListener("input", () => {

    const query = searchInput.value.trim();

    clearTimeout(debounceTimer);

    if (query.length < 2) {

        if (currentRequest) {
            currentRequest.abort();
        }

        currentResults = [];

        closeSearchResults();

        return;
    }

    debounceTimer = setTimeout(() => {
        searchShows(query);
    },
    400
    );
});


// Add Movie
function addMovie(show) {

    const movieId = String(show.id);

    const duplicate = movieGrid.querySelector(
        `[data-movie-id="${movieId}"]`
    );

    if (duplicate) {
        closeSearchResults();

        searchInput.value = "";

        duplicate.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        return;
    }

    const card = document.createElement("article");

    card.className = "movie-card movie-card--added";

    card.dataset.movieId = movieId;

    // Image Wrapper
    const imageWrapper = document.createElement("div");

    imageWrapper.className = "movie-card__image-wrapper";

    const image = document.createElement("img");

    image.className = "movie-card__image";

    image.src = getShowImage(show);

    image.alt = show.name || "Movie poster";

    // Remove Button
    const removeButton = document.createElement("button");

    removeButton.type = "button";

    removeButton.className = "movie-card__remove";

    removeButton.setAttribute(
        "aria-label",
        `Remove ${show.name} from favorites`
    );

    removeButton.innerHTML = "&times;";

    imageWrapper.append(image, removeButton);

    // Card Content
    const content = document.createElement("div");

    content.className = "movie-card__content";

    const title = document.createElement("h3");

    title.className = "movie-card__title";

    title.textContent = show.name || "Untitled";

    const description = document.createElement("p");

    description.className = "movie-card__description";

    const cleanSummary = stripHtml(show.summary);

    description.textContent = truncateText(cleanSummary);

    content.append(title, description);

    card.append(imageWrapper, content);

    movieGrid.appendChild(card);

    // Reset search
    searchInput.value = "";
    currentResults = [];
    closeSearchResults();

    // Focus back on search
    searchInput.focus();
}

// Remove Movie
movieGrid.addEventListener("click", (event) => {

    const removeButton = event.target.closest(".movie-card__remove");

    if (!removeButton) {
        return;
    }

    const card = removeButton.closest(".movie-card");

    if (card) {
        card.remove();
    }
});

// Keyboard Navigation
searchInput.addEventListener("keydown", (event) => {

    const resultButtons = searchResults.querySelectorAll(".search-result");

    if (!resultButtons.length) {
        return;
    }

    if (event.key === "ArrowDown") {

        event.preventDefault();

        activeResultIndex = Math.min(
            activeResultIndex + 1,
            resultButtons.length - 1
        );

        updateActiveResult(resultButtons);
    }

    if (event.key === "ArrowUp") {

        event.preventDefault();

        activeResultIndex = Math.max(
            activeResultIndex - 1,
            0
        );

        updateActiveResult(resultButtons);
    }

    if (event.key === "Enter" && activeResultIndex >= 0) {

        event.preventDefault();

        resultButtons[activeResultIndex].click();
    }

    if (event.key === "Escape") {
        closeSearchResults();
    }
});

function updateActiveResult(resultButtons) {
    
    resultButtons.forEach((button, index) => {

        button.classList.toggle(
            "is-active",
            index === activeResultIndex
        );
    });

    resultButtons[activeResultIndex]?.scrollIntoView({
        block: "nearest",
    });
}

// Close Seach when Clicking Outside
document.addEventListener("click", (event) => {

    const movieSearch = event.target.closest(
        ".movie-search"
    );

    if (!movieSearch) {
        closeSearchResults();
    }
});