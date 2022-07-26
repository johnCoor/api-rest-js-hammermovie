

const api = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    headers: {
        "Content-Type": "application/json"
    },
    params: {
        "api_key": API_url,
        // "language": traductor
    }
})




function likedMovieList() {
    const item = JSON.parse(localStorage.getItem("liked_movies"))
    let movies;
    
    if(item) {
        movies = item
    } else {
        movies = {}
    }
    
    
    return movies
}

function likeMovie(movie,movieBtn) {
    // debugger
    const likeMovies = likedMovieList()

   
    
    if(likeMovies[movie.id]){
        likeMovies[movie.id] = undefined; 
        movieBtn.classList.add("movie-btn--liked")
    } else {
        likeMovies[movie.id] = movie;
    }
    
    
    localStorage.setItem("liked_movies",JSON.stringify(likeMovies,movieBtn))

}

const lazyLoad = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting) {
            const url = entry.target.getAttribute("data-img")
              entry.target.setAttribute("src", url )
         
        } 
    })
})


function createMovie(
    movies,
    container,
    {
        lazyLoader = false,
        clean =  true

    } = {}) {
    if(clean) {
        container.innerHTML = "";
    }
    

    movies.forEach(movie => {


            const movieContainer = document.createElement("div");
            movieContainer.classList.add("movie-container");
           
            
            const movieImg = document.createElement("img");
            movieImg.classList.add("movie-img")
            movieImg.setAttribute("alt", movie.title)
            movieImg.setAttribute(
            lazyLoader ? "data-img" : "src",
            "https://image.tmdb.org/t/p/w300"  + movie.poster_path)

            movieImg.addEventListener("click" , () => {
            location.hash = "#movie=" + movie.id})
                            
            movieImg.addEventListener("error", () => {
                movieImg.setAttribute("src", "https://us.123rf.com/450wm/quartadis/quartadis1803/quartadis180300113/97665207-conjunto-de-iconos-de-cine.jpg?ver=6")
            }) 
            
            const movieBtn = document.createElement("button");
            movieBtn.classList.add("movie-btn");
            
            if(likedMovieList()[movie.id]) {
                movieBtn.classList.add("movie-btn--liked")
               } 
 
                movieBtn.addEventListener("click", () => {
                movieBtn.classList.toggle("movie-btn--liked");
                likeMovie(movie, movieBtn)
                getLikedMovies()
            })

            
             if(lazyLoader) {
                 lazyLoad.observe(movieImg)
             }

             
                            
            movieContainer.appendChild(movieImg)
            movieContainer.appendChild(movieBtn)
            container.appendChild(movieContainer)
        
    });
}


function createCategories(categories, container) {
    container.innerHTML = "";

    categories.forEach(category => {
            const categoryContainer = document.createElement("div");
            categoryContainer.classList.add("category-container");
    
            
            const categoryTitle = document.createElement("h3");
            categoryTitle.classList.add("category-title");
            categoryTitle.setAttribute("id", "id" + category.id);
            categoryTitle.addEventListener("click", () => {
                location.hash = "#category=" + `${category.id}-${category.name}`
            })
            const categoryTitleText = document.createTextNode(category.name);
    
            categoryTitle.appendChild(categoryTitleText);
            categoryContainer.appendChild(categoryTitle);
            container.appendChild(categoryContainer);
            
     

    });

}



async function getTrendingMoviesPreview() {
    const { data } = await api("/trending/movie/day", {
        params: {
            // "language":"es"
        }
    })
    const movies = data.results
    createMovie(movies, trendingMoviePreviewList, true)
    
}



async function getCategoriesPreview() {
    const { data } = await api("/genre/movie/list")
    const categories = data.genres;
    createCategories(categories, categoriesPreviewList)
  
}


async function getMoviesByCategory(id) {
    const { data } = await api("discover/movie", {
        params: {
            with_genres: id ,

        }
    })
    const movies = data.results

   createMovie(movies, genericSection, {lazyLoader: true, clean: true})
}



async function  getMovieBySearch(query) {
    const { data } = await api("search/movie", {
        params: {
            query,
            
        }
    })
    const movies = data.results
    maxPage = data.total_pages
   

   createMovie(movies, genericSection, {lazyLoader: true, clean: true})
}

 function getPaginatedMoviesBySearch(query) {
     return async function() {
         
         const { 
            scrollTop,
            clientHeight,
            scrollHeight 
         } = document.documentElement
           
            const scrollIsBotton = (scrollTop + clientHeight) >=
             (scrollHeight - 15)
            
            const pageIsNotMax = page < maxPage

        if(scrollIsBotton && pageIsNotMax) {
            page++
            const { data } = await api("search/movie", {
                params: {
                    query,
                    page,
                }
            })
        const movies = data.results
        createMovie(movies, genericSection, {lazyLoader: true, clean: true})
    }
   }
}


async function getTrendingMovies() {
    const { data } = await api("/trending/movie/day")
    
    const movies = data.results
    createMovie(movies, genericSection, {lazyLoader: true, clean: true})
    maxPage = data.total_pages;
   

}


async function getPaginatedTrendingMovies() {
    page++

    const pageIsNotMax = page < maxPage

    const { 
        scrollTop,
        clientHeight,
        scrollHeight 
    } = document.documentElement

    const scrollIsBotton = (scrollTop + clientHeight) >= (scrollHeight - 15)

    if(scrollIsBotton && pageIsNotMax){
        const { data } = await api("/trending/movie/day", {
            params:{
                page
            },
        })
        const movies = data.results
        createMovie(movies, genericSection, {lazyLoader: true, clean: false})
    }

    // const btnloadMore = document.createElement("button");
    // btnloadMore.innerText = "Cargar más";
    // btnloadMore.addEventListener("click", getPaginatedTrendingMovies)
    // genericSection.appendChild(btnloadMore)
}

async function getMovieById(id) {
    const { data: movie } = await api("movie/" + id)

    movieDetailTitle.textContent = movie.title
    movieDetailDescription.textContent = movie.overview
    movieDetailScore.textContent = movie.vote_average

    const movieImgUrl = "https://image.tmdb.org/t/p/w500" + movie.poster_path
    headerSection.style.background = `
    linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%),
    url(${movieImgUrl})`

    createCategories(movie.genres, movieDetailCategoriesList)
    

    getRelatedMoviesId(id)
}

async function getRelatedMoviesId(id) {
    const { data } = await api(`movie/${id}/recommendations`)
    const movies = data.results;

    createMovie(movies, relatedMoviesContainer, true)
}

function getLikedMovies(){
    const likedMovies = likedMovieList();
    const moviesArray = Object.values(likedMovies)


    createMovie(moviesArray, likedMoviesListArticle , {lazyLoader: true, clean: true})
    
}

