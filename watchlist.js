"use strict"

const watchlistContainer = document.getElementById("watchlist-list")
const littleEmpty = document.getElementById("little-empty")

// renders watchlist
function getWatchlist() {
  for (let i = 0; i < watchlist.length; i++) {
    fetch(`https://www.omdbapi.com/?apikey=8e62b52d&i=${watchlist[i]}`)
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

const watchlist = JSON.parse(localStorage.getItem("watchlist")) || []

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
