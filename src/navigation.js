let maxPage;
let page = 1
let infintyScroll;

searchFormBtn.addEventListener("click",() => {
    location.hash = "#search=" + searchFormInput.value
    console.log( searchFormInput.value)
})

tredingBtn.addEventListener("click", () => {
    location.hash = "#trends"
})



arrowBtn.addEventListener("click", () =>  {
    history.back()
    location.hash = "#home"
})

window.addEventListener("DOMContentLoaded", navigatorApp, false)
window.addEventListener("hashchange", navigatorApp, false)
window.addEventListener("scroll", infintyScroll, false)

function navigatorApp() {
    console.log({ location })

    if(infintyScroll) {
        window.removeEventListener("scroll", infintyScroll, {passive: false})
    }

    if(location.hash.startsWith("#trends")) {
        trendsPage()
    } else if (location.hash.startsWith("#search=")) {
       searchPage()
    } else if (location.hash.startsWith("#movie=")) {
       movieDetailsPage()
    } else if (location.hash.startsWith("#category=")) {
       categoriesPage()
    } else {
        homePage()
    }

    if(infintyScroll) {
        window.addEventListener("scroll", infintyScroll, false)
    }

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function homePage() {
    headerSection.classList.remove("header-container--long");
    headerSection.style.background = "";
    arrowBtn.classList.add("inactive");
    arrowBtn.classList.remove("header-arrow--white");
    headerTitle.classList.remove("inactive");
    headerCategoryTitle.classList.add("inactive");
    searchForm.classList.remove("inactive");

    trendingPreviewSection.classList.remove("inactive");
    likeMoviesSection.classList.remove("inactive")
    categoriesPreviewSection.classList.remove("inactive");
    genericSection.classList.add("inactive");
    movieDetailsSection.classList.add("inactive");

   

    getTrendingMoviesPreview()
    getCategoriesPreview()
    getLikedMovies()
}

function categoriesPage() {
    headerSection.classList.remove("header-container--long");
    headerSection.style.background = "";
    arrowBtn.classList.remove("inactive");
    arrowBtn.classList.remove("header-arrow--white");
    headerTitle.classList.add("inactive");
    headerCategoryTitle.classList.remove("inactive");
    searchForm.classList.add("inactive");

    trendingPreviewSection.classList.add("inactive");
    likeMoviesSection.classList.add("inactive")
    categoriesPreviewSection.classList.add("inactive");
    genericSection.classList.remove("inactive");
    movieDetailsSection.classList.add("inactive");

    
    const [_, categoryData] = location.hash.split("=");
    
    const [categoryId, categoryName] = categoryData.split("-")
    console.log("heyyy!!", categoryName)

    headerCategoryTitle.innerHTML = categoryName
    getMoviesByCategory(categoryId)

    // infintyScroll = getPagenatedByCategory
}

function movieDetailsPage() {
    console.log("MOVIE!!");

    headerSection.classList.add("header-container--long");
    // headerSection.style.background = "";
    arrowBtn.classList.remove("inactive");
    arrowBtn.classList.add("header-arrow--white");
    headerTitle.classList.add("inactive");
    headerCategoryTitle.classList.add("inactive");
    searchForm.classList.add("inactive");

    trendingPreviewSection.classList.add("inactive");
    likeMoviesSection.classList.add("inactive")
    categoriesPreviewSection.classList.add("inactive"); 
    genericSection.classList.add("inactive");
    movieDetailsSection.classList.remove("inactive");

    const [_, movieId] = location.hash.split("=")
    getMovieById(movieId)

}

function searchPage() {
    console.log("SEARCH!!")

    headerSection.classList.remove("header-container--long");
    headerSection.style.background = "";
    arrowBtn.classList.remove("inactive");
    arrowBtn.classList.remove("header-arrow--white");
    headerTitle.classList.add("inactive");
    headerCategoryTitle.classList.add("inactive");
    searchForm.classList.remove("inactive");

    trendingPreviewSection.classList.add("inactive");
    likeMoviesSection.classList.add("inactive")
    categoriesPreviewSection.classList.add("inactive");
    genericSection.classList.remove("inactive");
    movieDetailsSection.classList.add("inactive");

    const [_, query] = location.hash.split("=")
    getMovieBySearch(query)
    
    infintyScroll = getPaginatedMoviesBySearch(query)
}

function trendsPage() {
    console.log("TRENDS!!")

    headerSection.classList.remove("header-container--long");
    headerSection.style.background = "";
    arrowBtn.classList.remove("inactive");
    arrowBtn.classList.remove("header-arrow--white");
    headerTitle.classList.add("inactive");
    headerCategoryTitle.classList.remove("inactive");
    searchForm.classList.add("inactive");

    trendingPreviewSection.classList.add("inactive");
    likeMoviesSection.classList.add("inactive")
    categoriesPreviewSection.classList.add("inactive");
    genericSection.classList.remove("inactive");
    movieDetailsSection.classList.add("inactive");

    headerCategoryTitle.innerHTML = "Trendings"
    getTrendingMovies()

    infintyScroll = getPaginatedTrendingMovies;
}