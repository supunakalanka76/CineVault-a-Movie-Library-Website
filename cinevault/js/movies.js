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