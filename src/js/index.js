import Search from './models/Search'
import Recipe from './models/Recipe'
import List from './models/List'
import Likes from './models/Likes'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import * as likesView from './views/likesView'
import { elements, renderLoader, DOMStrings, clearLoader } from './views/base'


// Global App State
const state = {}


// Search Controller
const controlSearch = async (e) => {
    // prevent default submit behavior
    e.preventDefault()


    // get search query from view
    const query = searchView.getInput()

    // if query exists
    if (query) {
        // add new search object to the state
        state.search = new Search(query)

        // prepare UI for async result (loading img, etc.)
        searchView.clearInput()
        searchView.clearResults()
        renderLoader(elements.searchParent)

        try {
            // await search recipes
            await state.search.getResults()

            // Render result
            clearLoader()
            searchView.renderResults(state.search.result)
        } catch (err) {
            console.log('Error Searching the Recipe. API call limit possibly reached')
            console.log(err)
            clearLoader()
        }
    }
}

const ctrlSearchPagination = (e) => {
    const btn = e.target.closest(`.${DOMStrings.pagebtn}`)
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10)
        searchView.clearResults()
        searchView.renderResults(state.search.result, goToPage)
    }
}

// Search EventListeners
elements.searchForm.addEventListener('submit', controlSearch)
elements.searchPagination.addEventListener('click', ctrlSearchPagination)





// List Controller
const controlList = () => {
    // create a new list if there is none yet
    if (!state.list) state.list = new List()

    // add each ingredient to the list and the UI
    state.recipe.ingredients.forEach((el) => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient)
        listView.renderItem(item)
    })
}

const updateItem = (e) => {
    const id = e.target.closest('.shopping__item').dataset.itemid

    // handle the delete item
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // delete from state
        state.list.deleteItem(id)

        // delete from UI
        listView.deleteItem(id)

    // handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value)
        state.list.updateCount(id, val)
    }
}

// List EventListeners
elements.shopping.addEventListener('click', updateItem)





// LIKE Controller
const controlLike = () => {
    if (!state.likes) state.likes = new Likes()
    const currentID = state.recipe.id

    // user has NOT yet liked the current recipe
    if (!state.likes.isLiked(currentID)) {
        // add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img,
        )

        // toggle the like button
        likesView.toggleLikeBtn(true)

        // add like to the UI list
        likesView.renderLike(newLike)

        // user has LIKED the current recipe
    } else {
        // remove like to the state
        state.likes.deleteLikes(currentID)

        // toggle the like button
        likesView.toggleLikeBtn(false)

        // remove like to the UI list
        likesView.deleteLike(currentID)
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes())
}


// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes()

    // restore likes
    state.likes.readStorage()

    // toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes())

    // render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like))
})



// Recipe Controller
const controlRecipe = async () => {
    // get ID from URL
    const id = window.location.hash.replace('#', '')

    if (id) {
        // prepare UI for changes
        recipeView.clearIngredients()
        renderLoader(elements.recipe)

        if (state.search) {
            searchView.highlightSelected(id)
        }

        // create new recipe object
        state.recipe = new Recipe(id)

        try {
            // get recipe data
            await state.recipe.getRecipe()
            state.recipe.parseIngredients()

            // calculate servings and time
            state.recipe.calcTime()
            state.recipe.calcServings()

            // render recipe
            clearLoader()
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            )
        } catch (err) {
            // statements
            console.log('Error Processing the Recipe')
            console.log(err)
        }
    }
}

const ctrlServings = (e) => {
    if (e.target.matches('.btn-decrease', '.btn-decrease *')) {
        // decrease btn is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec')
            recipeView.updateSrvIngredients(state.recipe)
        }
    } else if (e.target.matches('.btn-increase', '.btn-increase *')) {
        // increase btn is clicked
        state.recipe.updateServings('inc')
        recipeView.updateSrvIngredients(state.recipe)
    } else if (e.target.matches('.recipe__btn', '.recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList()
    } else if (e.target.matches('.recipe__love', '.recipe__love *')) {
        // Call Like controller
        controlLike()
    }
}

// Recipe EventListeners
['hashchange', 'load'].forEach(e => addEventListener(e, controlRecipe))
elements.recipe.addEventListener('click', ctrlServings)