import { s, elements, DOMStrings, parseHTML } from './base'

export const getInput = () => elements.searchInput.value
export const clearInput = () => {
    elements.searchInput.value = ''
}
export const clearResults = () => {
    elements.searchResList.innerHTML = ''
    elements.searchPagination.innerHTML = ''
}

export const highlightSelected = (id) => {
    // save doc search list as array
    const linkArr = Array.from(document.querySelectorAll('.results__link'))

    // clear active class
    linkArr.forEach((el) => {
        if (el.className.match(/.*active.*/g)) {
            el.classList.remove('results__link--active')
        }
    })

    // add active class
    s(`.results__link[href="#${id}"]`).classList.add('results__link--active')
}

// Trim Title if Limit Exceeded
export const limitRecipeTitle = (title, limit = 17) => {
    // array to push words
    const newTitle = []

    if (title.length > limit) {
        title.split(' ')
            // create trimmed title
            .reduce((acc, cur) => { // ( acc = 0 + n, cur = currentWord )
                if (acc + cur.length <= limit) {
                    // only push if acc + cur.len will not exceed limit
                    newTitle.push(cur)
                }
                // return new accumulator
                return acc + cur.length
            }, 0)
        // finally, return new title
        return `${newTitle.join(' ')} ...`
    }
    return title
}

// callback for rendering each recipe
const renderRecipe = (recipe) => {
    const resMarkup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="Test">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `
    elements.searchResList.appendChild(parseHTML(resMarkup))
}

// direction: 'prev' or 'next'
const createButton = (page, direction) => `
    <button class="${DOMStrings.pagebtn} results__btn--${direction}" data-goto="${direction === 'prev' ? page - 1 : page + 1}">
        <span>Page ${direction === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${direction === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`

const renderButtons = (page, numRecipes, resPerPage) => {
    // number of recipes / results per page then roundUP if there is remainder
    const pages = Math.ceil(numRecipes / resPerPage)

    let button
    if (page === 1 && pages > 1) {
    // One button to go to NEXT page (2)
        button = createButton(page, 'next')
    } else if (page < pages) {
        // Both buttons
        button = `${createButton(page, 'next')} ${createButton(page, 'prev')}`
    } else if (page === pages && pages > 1) {
        // One button to go to PREV page (2)
        button = createButton(page, 'prev')
    }
    elements.searchPagination.appendChild(parseHTML(button))
}

// display recipes
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    /*
        start = {page = 1} - 1 * {resPerPage = 10}
              = 1 - 1 * 10
              = 0 * 10
        ---------------
        start = 0

        end   = {page = 1} * {resPerPage = 10}
              = 1 * 10
        ---------------
        end   = 10

        recipes.slice(0, 10) - zero based && "end" index not included

        page 1 > slice(1 - 1 * 10, 1 * 10) = slice(0, 10)
        page 2 > slice(2 - 1 * 10, 2 * 10) = slice(10, 20)
        page 3 > slice(3 - 1 * 10, 2 * 10) = slice(20, 30)
    */
    const start = (page - 1) * resPerPage
    const end = page * resPerPage

    // render results of current page > MAX 10
    recipes.slice(start, end).forEach(renderRecipe)

    // render pagination
    renderButtons(page, recipes.length, resPerPage)
}