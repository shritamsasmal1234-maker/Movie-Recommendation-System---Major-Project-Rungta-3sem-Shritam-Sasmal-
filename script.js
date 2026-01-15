const API_KEY = "2ccf6f24";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const movieContainer = document.getElementById("movieContainer");
const message = document.getElementById("message");
const sortSelect = document.getElementById("sortSelect");

let moviesData = [];

// Fetch movies by title
async function fetchMovies(title) {
  try {
    message.textContent = "";
    movieContainer.innerHTML = "";

    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${title}`
    );
    const data = await response.json();

    if (data.Response === "False") {
      message.textContent = "❌ Movie not found!";
      return;
    }

    moviesData = data.Search;
    displayMovies(moviesData);
  } catch (error) {
    message.textContent = "⚠️ Something went wrong. Try again!";
  }
}

// Fetch movie details
async function fetchMovieDetails(imdbID) {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`
  );
  return response.json();
}

// Display movies
async function displayMovies(movies) {
  movieContainer.innerHTML = "";

  for (let movie of movies) {
    const details = await fetchMovieDetails(movie.imdbID);

    const card = document.createElement("div");
    card.className =
      "bg-white rounded shadow p-4 hover:scale-105 transition";

    card.innerHTML = `
      <img
        src="${details.Poster !== "N/A" ? details.Poster : "https://via.placeholder.com/300"}"
        alt="${details.Title}"
        class="w-full h-64 object-cover rounded"
      />

      <h2 class="text-lg font-bold mt-2">${details.Title}</h2>
      <p class="text-sm text-gray-600">Year: ${details.Year}</p>
      <p class="text-sm text-gray-600">Genre: ${details.Genre}</p>
      <p class="text-sm text-gray-600">IMDb: ⭐ ${details.imdbRating}</p>

      <p class="text-sm mt-2 line-clamp-3">${details.Plot}</p>
    `;

    movieContainer.appendChild(card);
  }
}

// Search button event
searchBtn.addEventListener("click", () => {
  const title = searchInput.value.trim();

  if (!title) {
    alert("Please enter a movie name!");
    return;
  }

  fetchMovies(title);
});

// Sort movies
sortSelect.addEventListener("change", () => {
  if (sortSelect.value === "year") {
    moviesData.sort((a, b) => b.Year - a.Year);
  }

  if (sortSelect.value === "rating") {
    moviesData.sort(async (a, b) => {
      const movieA = await fetchMovieDetails(a.imdbID);
      const movieB = await fetchMovieDetails(b.imdbID);
      return movieB.imdbRating - movieA.imdbRating;
    });
  }

  displayMovies(moviesData);
});