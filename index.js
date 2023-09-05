"use strict"
const searchedMovies = document.getElementById("movie-list")
const watchlistMovies = document.getElementById("watchlist-btn")
const searchBtn = document.getElementById("search-btn")
const searchInput = document.getElementById("search-input")
const littleEmpty = document.getElementById("little-empty")
let imdbIDArray = []
let moviesById = []

// if statement only to avoid error after clicking "my watchlist"
if (searchBtn) {
  searchBtn.addEventListener("click", getSearchedMovies)
}

// renders searched movies from API
function getSearchedMovies(e) {
  e.preventDefault()
  fetch(`http://www.omdbapi.com/?apikey=8e62b52d&s=${searchInput.value}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.Search) {
        for (let i = 0; i < data.Search.length; i++) {
          imdbIDArray.push(data.Search[i].imdbID)
        }
      } else {
        searchedMovies.innerHTML = `
              <p class="movie-not-found">
              Unable to find what you’re looking for. Please try another search.
            </p>`
      }
    })
    .then(() => {
      for (let i = 0; i < imdbIDArray.length; i++) {
        fetch(`http://www.omdbapi.com/?apikey=8e62b52d&i=${imdbIDArray[i]}`)
          .then((res) => res.json())
          .then((data) => {
            imdbIDArray = []

            if (data.Rated != "N/A" && data.Runtime != "N/A") {
              searchedMovies.innerHTML += `<div class="flex-container-movie">
            <img src="${data.Poster}" />
            <div class="flex-container">
              <div class="cont title-rating">
                <p class="movie-title">${data.Title}</p>
                <p class="rating">
                  <i class="fa-solid fa-star" style="color: #fec654"></i> ${data.imdbRating}
                </p>
              </div>
              <div class="cont time-genre">
                <p class="movie-time">${data.Runtime}</p>
                <p class="genre">${data.Genre}</p>
                <button onclick="addToWatchlist(this.id)" id="${data.imdbID}" class="watchlist">
                  <i class="fa-solid fa-circle-plus" style="color: #ffffff"></i>
                  Watchlist
                </button>
              </div>
              <p class="description">
                ${data.Plot}
              </p>
            </div>
          </div>
          <div class="divider"></div> 
            `
            }
          })
      }
    })
  searchInput.value = ""
  searchedMovies.innerHTML = ""
}

const watchlist = JSON.parse(localStorage.getItem("watchlist")) || []

// adds movie to watchlist and local storage
function addToWatchlist(btnID) {
  if (!watchlist.includes(btnID)) {
    watchlist.push(btnID)
    localStorage.setItem("watchlist", JSON.stringify(watchlist))
  }
}

const watchlistContainer = document.getElementById("watchlist-list")

// renders watchlist
function getWatchlist() {
  if (watchlistContainer) {
    for (let i = 0; i < watchlist.length; i++) {
      fetch(`http://www.omdbapi.com/?apikey=8e62b52d&i=${watchlist[i]}`)
        .then((res) => res.json())
        .then((data) => {
          littleEmpty.style.display = "none"
          watchlistContainer.innerHTML += `<div class="flex-container-movie">
            <img src="${data.Poster}" />
            <div class="flex-container">
              <div class="cont title-rating">
                <p class="movie-title">${data.Title}</p>
                <p class="rating">
                  <i class="fa-solid fa-star" style="color: #fec654"></i> ${data.imdbRating}
                </p>
              </div>
              <div class="cont time-genre">
                <p class="movie-time">${data.Runtime}</p>
                <p class="genre">${data.Genre}</p>
                <button onclick="removeFromWatchlist(this.id)" id="${data.imdbID}" class="watchlist">
                  <i class="fa-solid fa-circle-minus" style="color: orangered"></i>
                  Remove
                </button>
              </div>
              <p class="description">
                ${data.Plot}
              </p>
            </div>
          </div>
          <div class="divider"></div> 
            `
        })
    }
  }
}

// removes movie from watchlist and local storage
function removeFromWatchlist(btnID) {
  let index = watchlist.indexOf(btnID)
  if (index >= 0) {
    watchlist.splice(index, 1)
    localStorage.setItem("watchlist", JSON.stringify(watchlist))
    location.reload()
  }
}

getWatchlist()
