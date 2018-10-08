import axios from 'axios'
import { key, proxy } from '../config'

export default class Recipe {
    constructor(id) {
        this.id = id
    }

    async getRecipe() {
        try {
            // await promise
            const res = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`)
            const { title, publisher, image_url, source_url, ingredients } = res.data.recipe
            this.title = title
            this.author = publisher
            this.img = image_url
            this.url = source_url
            this.ingredients = ingredients
        } catch (e) {
            console.log('Rejected!')
            console.log(e)
        }
    }

    calcTime() {
        // 15min / 3 ingredients
        const numIng = this.ingredients.length
        // how many periods/15mins forEach recipe
        const periods = Math.ceil(numIng / 3)
        // time to cook = periodCount * period
        this.time = periods * 15
    }

    calcServings() {
        this.servings = 4
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds']
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound']
        const units = [...unitsShort, 'kg', 'g']

        /*
            Transform ingredients format to:

            - no parenthesis
            - uniform units
            - simplified fraction expressions (e.g, 4 1/2, 1 1/4)

        */

        const newIngredients = this.ingredients.map((el) => {
            let ingredient = el.toLowerCase()

            // uniform units using unitsLong and unitsShort as reference
            unitsLong.forEach((unit, i) => {
                // replace long unit with uniform/short unit
                ingredient = ingredient.replace(unit, unitsShort[i])
            })

            // remove parenthesis - REGEX = `space~ ( not ")" ) space~`
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ')

            /* parse ingredients into count, unit and ingredients */

            // split by 'space' and convert to string array
            const arrIng = ingredient.split(' ')

            // return first index match of 'unit' param from 'unitsShort' array
            const unitIndex = arrIng.findIndex(unit => units.includes(unit))

            // use 'unitIndex' as reference for 'objIng' condition statements
            let objIng

            if (unitIndex > -1) {
                /* if there is a unit, e.g, index = 1 or 2 */

                /*
                    index available:
                    - index 0 = number
                    - index 1 = fraction
                */
                const arrCount = arrIng.slice(0, unitIndex)

                // evaluated fraction expression
                let count

                // e.g, 4 1/2 cups, arrCount is [4 1/2] --> calc --> 4.5
                if (arrCount.length === 1) {
                    /*
                        length = 1 => [4-1/2]
                        Number concatenated with 'dash'

                        Course solution:
                            count = eval(arrIng[0]).replace('-', '+')
                            dangerous due to eval string execution as javascript

                        Number constructor solution:
                            count = parseFloat(new Number(arrIng.slice(0, unitIndex).join('+')))
                            not recommended by ESLINT due to typeof behavior as
                            Object and Booleans being always Truthy even if set to false
                    */

                    // OVERCOMPLICATED eval() alternative
                    count = arrIng[0].replace('-', '+').split('+')
                        .map((num) => {
                            if (num.match(/.*\/.*/g)) {
                                // to avoid parseFloat roundup string evaluation
                                return num.split('/').reduce((acc, cur) => parseFloat(acc) / parseFloat(cur))
                            }
                            return parseInt(num, 10)
                        }).reduce((acc, cur) => acc + cur)
                } else {
                    /*
                        length = 2 => [4, 1/2]
                        Separate Integer and Fraction

                        Course solution:
                            count = eval(arrIng.slice(0, unitIndex).join('+'))
                    */

                    count = arrIng.slice(0, unitIndex)
                        .map((num) => {
                            if (num.match(/.*\/.*/g)) {
                                // to avoid parseFloat roundup string evaluation
                                return num.split('/').reduce((acc, cur) => parseFloat(acc) / parseFloat(cur))
                            }
                            return parseInt(num, 10)
                        }).reduce((acc, cur) => acc + cur)
                }

                // if unitIndex > -1
                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' '),
                }
            } else if (parseInt(arrIng[0], 10)) {
                /* if there is NO unit, but 1st element is a NUMBER */

                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' '),
                }
            } else if (unitIndex === -1) {
                // there is NO unit AND NO number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient,
                }
            }

            return objIng
        })
        this.ingredients = newIngredients
    }

    // inc OR dec
    updateServings(type) {
        // update servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1

        // update ingredient count
        this.ingredients.forEach((ing) => {
            /*
                count = 4
                    4 = 4 * (3 / 4)
                        4 * 0.75
                        3

                count = 3
                    3 = 3 * (2 / 4)
                        3 * 0.5
                        1.5
            */


            /* WARNING: mutating arguments' 'count' property */
            ing.count *= (newServings / this.servings)
        })

        this.servings = newServings
    }
}