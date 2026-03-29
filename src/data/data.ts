// ─── Icon re-exports (proper ES module imports, not raw string paths) ─────────
export {
	box_icon,
	cart,
	delivery_icon,
	emptyCart,
	login,
	logo,
	plus,
	searchIcon,
	sort,
	tax_icon,
	tick,
	trash_icon,
} from "../assets/icons";

import pizzaArrirava from "../assets/images/pizzaImages/pizza-arriva.avif";
import pizzaBurgerPizza from "../assets/images/pizzaImages/pizza-burgerPizza.avif";
import pizzaCheeseChick from "../assets/images/pizzaImages/pizza-cheeseChick.avif";
import pizzaCheesyChedar from "../assets/images/pizzaImages/pizza-cheesyCheddar.avif";
import pizzaChickenRanch from "../assets/images/pizzaImages/pizza-chickenRanch.avif";
import pizzaChillGrill from "../assets/images/pizzaImages/pizza-chillGrill.avif";
import pizzaDodo from "../assets/images/pizzaImages/pizza-dodo.avif";
import pizzaDoubleChicken from "../assets/images/pizzaImages/pizza-doubleChicken.avif";
import pizzaFourSeasons from "../assets/images/pizzaImages/pizza-fourSeasons.avif";
import pizzaHawaiian from "../assets/images/pizzaImages/pizza-hawaiian.avif";
import pizzaJulienne from "../assets/images/pizzaImages/pizza-julienne.avif";
// ─── Pizza image imports ───────────────────────────────────────────────────────
import pizzaMargarita from "../assets/images/pizzaImages/pizza-margarita.avif";
import pizzaMeat from "../assets/images/pizzaImages/pizza-meat.avif";
import pizzaPepperoni from "../assets/images/pizzaImages/pizza-pepperoni.avif";
import pizzaPesto from "../assets/images/pizzaImages/pizza-pesto.avif";
import pizzaPizzaPie from "../assets/images/pizzaImages/pizza-pie.avif";
import pizzaSuperMeat from "../assets/images/pizzaImages/pizza-superMeat.avif";
import pizzaVolcano from "../assets/images/pizzaImages/pizza-volcano.avif";

// ─── Tag image imports ─────────────────────────────────────────────────────────
import spicyIcon from "../assets/images/pizzaTags/spicy-icon.webp";
import vegetarianIcon from "../assets/images/pizzaTags/vegetarian-icon.png";

// ─── Topping image imports ─────────────────────────────────────────────────────
import cheddarIcon from "../assets/images/toppings/cheddar-icon.svg";
import cheeseBorderIcon from "../assets/images/toppings/cheese-border-icon.svg";
import mozzarellaIcon from "../assets/images/toppings/mozzarella-icon.svg";

// ─── Types ────────────────────────────────────────────────────────────────────
export type PizzaTypeT = "new" | "classic";

export type PizzaCategoryT =
	| "meat"
	| "vegetarian"
	| "spicy"
	| "sweet"
	| "chicken";

export type PizzaDataType = {
	img: string;
	name: string;
	ingredients: string;
	price: number;
	pizzaType: PizzaTypeT;
	pizzaCategory?: PizzaCategoryT | PizzaCategoryT[];
	purchase: number;
};

const pizzaNameTranslations: Record<string, string> = {
	Margherita: "Маргарита",
	"Burger pizza": "Бургер-пицца",
	"Cheese chedar": "Сырный чеддер",
	"Chicken ranch": "Чикен ранч",
	"super meat": "Супер мясная",
	"Four seasons": "Четыре сезона",
	Hawaiian: "Гавайская",
	Julienne: "Жюльен",
	Meat: "Мясная",
	Volcano: "Вулкан",
	Arrirava: "Аррирава",
	Pesto: "Песто",
	"Pizza pie": "Пицца-пай",
	"Chill Grill": "Чилл Гриль",
	Pepperoni: "Пепперони",
	"Double Chicken": "Двойная курица",
	"Cheese Chicken": "Сырная курица",
	"Pizza dodo": "Пицца Додо",
};

const pizzaIngredientsTranslations: Record<string, string> = {
	"Mozzarella, tomatoes, basil, tomato sauce, olive oil, oregano":
		"Моцарелла, томаты, базилик, томатный соус, оливковое масло, орегано",
	"Juicy beef slices, crispy bacon, rich cheese sauce, garlic, crunchy pickles, red onion":
		"Сочные кусочки говядины, хрустящий бекон, сырный соус, чеснок, маринованные огурчики, красный лук",
	"Cheddar blend, stretchy mozzarella, smooth cheese sauce, aromatic garlic, pickles":
		"Смесь чеддера, тянущаяся моцарелла, сырный соус, ароматный чеснок, огурчики",
	"Tender chicken, mozzarella, creamy cheese sauce, garlic, pickles, sliced red onion, tomatoes":
		"Нежная курица, моцарелла, сливочный сырный соус, чеснок, огурчики, красный лук, томаты",
	"Pepperoni, bacon, ketchup, mozzarella, velvety cheese sauce, garlic, pickles, juicy tomatoes":
		"Пепперони, бекон, кетчуп, моцарелла, бархатный сырный соус, чеснок, огурчики, сочные томаты",
	"Mozzarella, creamy cheese sauce, pickles, red onion, tomatoes, pepperoni, mushrooms":
		"Моцарелла, сливочный сырный соус, огурчики, красный лук, томаты, пепперони, грибы",
	"Chicken pieces, rich cheese sauce, garlic, pickles, tomatoes":
		"Кусочки курицы, насыщенный сырный соус, чеснок, огурчики, томаты",
	"Beef strips, mozzarella, smooth cheese sauce, crunchy pickles, tomatoes":
		"Кусочки говядины, моцарелла, сырный соус, хрустящие огурчики, томаты",
	"Pepperoni, sausage, cheese sauce, garlic, pickles, red onion, tomatoes":
		"Пепперони, колбаски, сырный соус, чеснок, огурчики, красный лук, томаты",
	"Spicy meatballs, mozzarella, creamy cheese sauce, pickles, red onion, tomatoes":
		"Острые фрикадельки, моцарелла, сливочный сырный соус, огурчики, красный лук, томаты",
	"Chicken, spicy chorizo, burger sauce, bell peppers, red onions, tomatoes, mozzarella, ranch dressing, garlic":
		"Курица, острый чоризо, бургерный соус, болгарский перец, красный лук, томаты, моцарелла, соус ранч, чеснок",
	"Pesto sauce, creamy Alfredo sauce, double chicken, feta cheese cubes, tomatoes, and real milk mozzarella":
		"Соус песто, сливочный соус Альфредо, двойная курица, кубики феты, томаты и молочная моцарелла",
	"pineapple, vanilla sauce, blueberry": "ананас, ванильный соус, голубика",
	"Chicken, pickles, red onion, grill sauce, mozzarella, garlic, signature Alfredo sauce":
		"Курица, огурчики, красный лук, гриль-соус, моцарелла, чеснок, фирменный соус Альфредо",
	"Spicy pepperoni, mozzarella cheese and creamy Alfredo sauce":
		"Острая пепперони, моцарелла и сливочный соус Альфредо",
	"Whole milk mozzarella, alfredo sauce, double the chicken, double the fun":
		"Моцарелла из цельного молока, соус Альфредо, двойная курица, двойное удовольствие",
	"Chicken, mozzarella, cheddar and parmesan cheeses, cheese sauce, alfredo sauce, garlic":
		"Курица, моцарелла, сыры чеддер и пармезан, сырный соус, соус Альфредо, чеснок",
	"Hot chorizo, jalapeño, barbecue sauce, meatballs, tomatoes, bell peppers, red onion, mozzarella":
		"Острый чоризо, халапеньо, барбекю соус, фрикадельки, томаты, болгарский перец, красный лук, моцарелла",
};

const addNameTranslations: Record<string, string> = {
	Cheddar: "Чеддер",
	Mozzarella: "Моцарелла",
	"Cheese Border": "Сырный бортик",
};

export function getLocalizedPizzaName(name: string, lang: "en" | "rus") {
	return lang === "rus" ? (pizzaNameTranslations[name] ?? name) : name;
}

export function getLocalizedIngredients(
	ingredients: string,
	lang: "en" | "rus",
) {
	return lang === "rus"
		? (pizzaIngredientsTranslations[ingredients] ?? ingredients)
		: ingredients;
}

export function getLocalizedAddName(name: string, lang: "en" | "rus") {
	return lang === "rus" ? (addNameTranslations[name] ?? name) : name;
}

// ─── Pizza data ───────────────────────────────────────────────────────────────
export const pizzaData: PizzaDataType[] = [
	{
		purchase: 122,
		img: pizzaMargarita,
		name: "Margherita",
		ingredients:
			"Mozzarella, tomatoes, basil, tomato sauce, olive oil, oregano",
		price: 280,
		pizzaType: "classic",
		pizzaCategory: "vegetarian",
	},
	{
		purchase: 123,
		img: pizzaBurgerPizza,
		name: "Burger pizza",
		ingredients:
			"Juicy beef slices, crispy bacon, rich cheese sauce, garlic, crunchy pickles, red onion",
		price: 390,
		pizzaType: "new",
		pizzaCategory: "meat",
	},
	{
		purchase: 124,
		img: pizzaCheesyChedar,
		name: "Cheese chedar",
		ingredients:
			"Cheddar blend, stretchy mozzarella, smooth cheese sauce, aromatic garlic, pickles",
		price: 270,
		pizzaType: "classic",
		pizzaCategory: "vegetarian",
	},
	{
		purchase: 125,
		img: pizzaChickenRanch,
		name: "Chicken ranch",
		ingredients:
			"Tender chicken, mozzarella, creamy cheese sauce, garlic, pickles, sliced red onion, tomatoes",
		price: 380,
		pizzaType: "new",
		pizzaCategory: "chicken",
	},
	{
		purchase: 126,
		img: pizzaSuperMeat,
		name: "super meat",
		ingredients:
			"Pepperoni, bacon, ketchup, mozzarella, velvety cheese sauce, garlic, pickles, juicy tomatoes",
		price: 300,
		pizzaType: "classic",
		pizzaCategory: "meat",
	},
	{
		purchase: 127,
		img: pizzaFourSeasons,
		name: "Four seasons",
		ingredients:
			"Mozzarella, creamy cheese sauce, pickles, red onion, tomatoes, pepperoni, mushrooms",
		price: 340,
		pizzaType: "classic",
		pizzaCategory: ["meat", "chicken"],
	},
	{
		purchase: 128,
		img: pizzaHawaiian,
		name: "Hawaiian",
		ingredients: "Chicken pieces, rich cheese sauce, garlic, pickles, tomatoes",
		price: 360,
		pizzaType: "classic",
		pizzaCategory: "chicken",
	},
	{
		purchase: 129,
		img: pizzaJulienne,
		name: "Julienne",
		ingredients:
			"Beef strips, mozzarella, smooth cheese sauce, crunchy pickles, tomatoes",
		price: 420,
		pizzaType: "new",
		pizzaCategory: "meat",
	},
	{
		purchase: 130,
		img: pizzaMeat,
		name: "Meat",
		ingredients:
			"Pepperoni, sausage, cheese sauce, garlic, pickles, red onion, tomatoes",
		price: 450,
		pizzaType: "classic",
		pizzaCategory: "meat",
	},
	{
		purchase: 131,
		img: pizzaVolcano,
		name: "Volcano",
		ingredients:
			"Spicy meatballs, mozzarella, creamy cheese sauce, pickles, red onion, tomatoes",
		price: 290,
		pizzaType: "new",
		pizzaCategory: "spicy",
	},
	{
		purchase: 132,
		img: pizzaArrirava,
		name: "Arrirava",
		ingredients:
			"Chicken, spicy chorizo, burger sauce, bell peppers, red onions, tomatoes, mozzarella, ranch dressing, garlic",
		price: 310,
		pizzaType: "new",
		pizzaCategory: "chicken",
	},
	{
		purchase: 133,
		img: pizzaPesto,
		name: "Pesto",
		ingredients:
			"Pesto sauce, creamy Alfredo sauce, double chicken, feta cheese cubes, tomatoes, and real milk mozzarella",
		price: 320,
		pizzaType: "new",
		pizzaCategory: "vegetarian",
	},
	{
		purchase: 134,
		img: pizzaPizzaPie,
		name: "Pizza pie",
		ingredients: "pineapple, vanilla sauce, blueberry",
		price: 220,
		pizzaType: "new",
		pizzaCategory: "sweet",
	},
	{
		purchase: 135,
		img: pizzaChillGrill,
		name: "Chill Grill",
		ingredients:
			"Chicken, pickles, red onion, grill sauce, mozzarella, garlic, signature Alfredo sauce",
		price: 280,
		pizzaType: "new",
		pizzaCategory: "chicken",
	},
	{
		purchase: 136,
		img: pizzaPepperoni,
		name: "Pepperoni",
		ingredients: "Spicy pepperoni, mozzarella cheese and creamy Alfredo sauce",
		price: 300,
		pizzaType: "classic",
		pizzaCategory: "meat",
	},
	{
		purchase: 137,
		img: pizzaDoubleChicken,
		name: "Double Chicken",
		ingredients:
			"Whole milk mozzarella, alfredo sauce, double the chicken, double the fun",
		price: 330,
		pizzaType: "new",
		pizzaCategory: "chicken",
	},
	{
		purchase: 120,
		img: pizzaCheeseChick,
		name: "Cheese Chicken",
		ingredients:
			"Chicken, mozzarella, cheddar and parmesan cheeses, cheese sauce, alfredo sauce, garlic",
		price: 395,
		pizzaType: "new",
		pizzaCategory: "chicken",
	},
	{
		purchase: 121,
		img: pizzaDodo,
		name: "Pizza dodo",
		ingredients:
			"Hot chorizo, jalapeño, barbecue sauce, meatballs, tomatoes, bell peppers, red onion, mozzarella",
		price: 320,
		pizzaType: "new",
		pizzaCategory: "spicy",
	},
];

export const sidebarListItemsText = [
	"Cheese sauce",
	"Garlic",
	"Pickles",
	"Red onion",
	"Tomatoes",
	"Mozzarella",
];

// ─── Utilities ────────────────────────────────────────────────────────────────
export function headerSearchFunc(pizzaName: string, userInput: string) {
	return pizzaName.toLowerCase().includes(userInput.toLowerCase().trim());
}

export function detectTags(category?: PizzaCategoryT | PizzaCategoryT[]) {
	if (!category) return [];

	const categories = Array.isArray(category) ? category : [category];
	const tags = [];

	if (categories.includes("spicy")) {
		tags.push({ key: "spicy", img: spicyIcon, width: 8, height: 8 });
	}

	if (categories.includes("vegetarian")) {
		tags.push({ key: "vegetarian", img: vegetarianIcon, width: 6, height: 6 });
	}

	return tags;
}

// ─── Add-ons data ─────────────────────────────────────────────────────────────
export const addsData = [
	{ image: cheddarIcon, name: "Cheddar", price: "179$" },
	{ image: mozzarellaIcon, name: "Mozzarella", price: "79$" },
	{ image: cheeseBorderIcon, name: "Cheese Border", price: "79$" },
];
