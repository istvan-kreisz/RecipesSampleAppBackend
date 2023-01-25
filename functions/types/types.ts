import { object, string, number, array, Infer, boolean } from 'superstruct'

/////////////////////////
// Recipe
/////////////////////////

const Recipe = object({
	id: string(),
	authorId: string(),
	imageURL: string(),
	title: string(),
	ingredients: array(string()),
	steps: array(string()),
	isVegetarian: boolean(),
	source: string(),
	dateAdded: number(),
})

type Recipe = Infer<typeof Recipe>

/////////////////////////
/////////////////////////

/////////////////////////
// Rating
/////////////////////////

const Rating = object({
	id: string(),
	author: string(),
	authorId: string(),
	comment: string(),
	dateAdded: number(),
})

type Rating = Infer<typeof Rating>

export { Recipe, Rating }
