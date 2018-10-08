// Bind 's' as querySelector shorthand
export const s = document.querySelector.bind(document)

// parse template literal as HTMLNode
export const parseHTML = str => document.createRange().createContextualFragment(str)

// Export Elements
export const elements = {
    searchForm: s('.search'),
    searchInput: s('.search__field'),
    searchResList: s('.results__list'),
    searchPagination: s('.results__pages'),
    searchParent: s('.results'),
    recipe: s('.recipe'),
    shopping: s('.shopping__list'),
    likesMenu: s('.likes__field'),
    likesList: s('.likes__list'),
}

export const DOMStrings = {
    loader: 'loader',
    pagebtn: 'btn-inline',
}

export const renderLoader = (parent) => {
    const loaderMarkup = `
        <div class="${DOMStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `
    parent.prepend(parseHTML(loaderMarkup))
}

export const clearLoader = () => {
    const loader = s(`.${DOMStrings.loader}`)
    if (loader) {
        if (loader.parentNode.className.match(/.*recipe.*/g)) {
            elements.recipe.removeChild(loader)
        } else if (loader.parentNode.className.match(/.*results.*/g)) {
            elements.searchParent.removeChild(loader)
        }
    }
}