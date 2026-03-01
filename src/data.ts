// TYPES
export type PizzaTypeT = "new" | "classic"

export type PizzaCategoryT =
| "meat"
| "vegetarian"
| "spicy"
| "sweet"
| "chicken"

export type PizzaDataType = {
img: string
name: string
ingredients: string
price: number
pizzaType: PizzaTypeT
pizzaCategory?: PizzaCategoryT | PizzaCategoryT[]
purchase: number
}

// ICONS
export const logo = "../src/public/images/utilityImg/logo.svg"
export const searchIcon = "../src/public/images/utilityImg/search.svg"
export const login = "../src/public/images/utilityImg/loginPerson.svg"
export const cart = "../src/public/images/utilityImg/cart.svg"
export const sort = "../src/public/images/utilityImg/sort.svg"
export const plus = "../src/public/images/utilityImg/plus.svg"
export const tick = "../src/public/images/utilityImg/tick.svg"
export const emptyCart = "../src/public/images/utilityImg/emptyCart.svg"

// DATA
export const pizzaData: PizzaDataType[] = [
{ purchase: 122,img: "../src/public/images/pizzaImages/margarita.avif", name: "Margherita", ingredients: "Mozzarella, tomatoes, basil, tomato sauce, olive oil, oregano", price: 280, pizzaType: "classic", pizzaCategory: "vegetarian"},
{ purchase: 123,img: "../src/public/images/pizzaImages/burgerPizza.png", name: "Burger pizza", ingredients: "Juicy beef slices, crispy bacon, rich cheese sauce, garlic, crunchy pickles, red onion", price: 390, pizzaType: "new", pizzaCategory: "meat"},
{ purchase: 124,img: "../src/public/images/pizzaImages/cheesyChedar.avif", name: "Cheese chedar", ingredients: "Cheddar blend, stretchy mozzarella, smooth cheese sauce, aromatic garlic, pickles", price: 270, pizzaType: "classic", pizzaCategory: "vegetarian"},
{ purchase: 125,img: "../src/public/images/pizzaImages/chickenRanch.avif", name: "Chicken ranch", ingredients: "Tender chicken, mozzarella, creamy cheese sauce, garlic, pickles, sliced red onion, tomatoes", price: 380, pizzaType: "new", pizzaCategory: "chicken"},
{ purchase: 126,img: "../src/public/images/pizzaImages/four cheeses.avif", name: "Four cheeses", ingredients: "Cheese blend, mozzarella, velvety cheese sauce, garlic, pickles, juicy tomatoes", price: 300, pizzaType: "classic", pizzaCategory: "vegetarian"},
{ purchase: 127,img: "../src/public/images/pizzaImages/fourSeasons.avif", name: "Four seasons", ingredients: "Mozzarella, creamy cheese sauce, pickles, red onion, tomatoes, pepperoni, mushrooms", price: 340, pizzaType: "classic", pizzaCategory: ["meat", "chicken"]},
{ purchase: 128,img: "../src/public/images/pizzaImages/hawaiian.avif", name: "Hawaiian", ingredients: "Chicken pieces, rich cheese sauce, garlic, pickles, tomatoes", price: 360, pizzaType: "classic", pizzaCategory: "chicken"},
{ purchase: 129,img: "../src/public/images/pizzaImages/julienne.avif", name: "Julienne", ingredients: "Beef strips, mozzarella, smooth cheese sauce, crunchy pickles, tomatoes", price: 420, pizzaType: "new", pizzaCategory: "meat"},
{ purchase: 130,img: "../src/public/images/pizzaImages/meat.avif", name: "Meat", ingredients: "Pepperoni, sausage, cheese sauce, garlic, pickles, red onion, tomatoes", price: 450, pizzaType: "classic", pizzaCategory: "meat"},
{ purchase: 131,img: "../src/public/images/pizzaImages/volcano.avif", name: "Volcano", ingredients: "Spicy meatballs, mozzarella, creamy cheese sauce, pickles, red onion, tomatoes", price: 290, pizzaType: "new", pizzaCategory: "spicy"},
{ purchase: 132,img: "../src/public/images/pizzaImages/arrirava.avif", name: "Arrirava", ingredients: "Chicken, spicy chorizo, burger sauce, bell peppers, red onions, tomatoes, mozzarella, ranch dressing, garlic", price: 310, pizzaType: "new", pizzaCategory: "chicken"},
{ purchase: 133,img: "../src/public/images/pizzaImages/pesto.avif", name: "Pesto", ingredients: "Pesto sauce, creamy Alfredo sauce, double chicken, feta cheese cubes, tomatoes, and real milk mozzarella", price: 320, pizzaType: "new", pizzaCategory: "vegetarian"},
{ purchase: 134,img: "../src/public/images/pizzaImages/pizza pie.avif", name: "Pizza pie", ingredients: "pineapple, vanilla sauce, blueberry", price: 220, pizzaType: "new", pizzaCategory: "sweet"},
{ purchase: 135,img: "../src/public/images/pizzaImages/chillGrill.avif", name: "Chill Grill", ingredients: "Chicken, pickles, red onion, grill sauce, mozzarella, garlic, signature Alfredo sauce", price: 280, pizzaType: "new", pizzaCategory: "chicken"},
{ purchase: 136,img: "../src/public/images/pizzaImages/pepperoni.avif", name: "Pepperoni", ingredients: "Spicy pepperoni, mozzarella cheese and creamy Alfredo sauce", price: 300, pizzaType: "classic", pizzaCategory: "meat"},
{ purchase: 137,img: "../src/public/images/pizzaImages/doubleChicken.avif", name: "Double Chicken", ingredients: "Whole milk mozzarella, alfredo sauce, double the chicken, double the fun", price: 330, pizzaType: "new", pizzaCategory: "chicken"},
{ purchase: 138,img: "../src/public/images/pizzaImages/faris.jpg", name: "The Black Honored one", ingredients: "black chocolate, nutella, snickers, eggs, Africa", price: Infinity, pizzaType: "new", pizzaCategory: "vegetarian"},
{ purchase: 139,img: "../src/public/images/pizzaImages/amira.jpg", name: "Beliy ruskiy devochka", ingredients: "marshmallow, my little pony, ice-cream, buldak ", price: 67, pizzaType: "new", pizzaCategory: "spicy"},
{ purchase: 120,img: "../src/public/images/pizzaImages/cheeseChick.svg", name: "Cheese Chicken", ingredients: "Chicken, mozzarella, cheddar and parmesan cheeses, cheese sauce, alfredo sauce, garlic", price: 395, pizzaType: "new", pizzaCategory: "chicken"},
{ purchase: 121,img: "../src/public/images/pizzaImages/diablo.svg", name: "Diablo", ingredients: "Hot chorizo, jalapeño, barbecue sauce, meatballs, tomatoes, bell peppers, red onion, mozzarella", price: 320, pizzaType: "new", pizzaCategory: "spicy"}
]
export const sidebarListItemsText = ["Cheese sauce", "Garlic", "Pickles", "Red onion", "Tomatoes", "Mozzarella"]
// SIMPLE SEARCH
export function headerSearchFunc(pizzaName: string, userInput: string) {
    return pizzaName.toLowerCase().includes(userInput.toLowerCase().trim())
}

// CLEAN BADGE DETECTOR
export function detectTags(
    category?: PizzaCategoryT | PizzaCategoryT[]
) {
    if (!category) return []

    const categories = Array.isArray(category)
        ? category
        : [category]

    const tags = []

    if (categories.includes("spicy")) {
        tags.push({
            key: 'spicy',
            img: "../src/public/images/utilityImg/spicy.webp",
            width: 8,
            height: 8
        })
    }

    if (categories.includes("vegetarian")) {
        tags.push({
            key: 'vegetarian',
            img: "../src/public/images/utilityImg/vegetarian.png",
            width: 6,
            height: 6
        })
    }

    return tags
}