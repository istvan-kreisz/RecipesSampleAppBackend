import { object, string, number, array, Infer, boolean, optional } from 'superstruct'

/////////////////////////
// Recipe
/////////////////////////

const Recipe = object({
	id: string(),
	authorId: string(),
	imageURL: optional(string()),
	title: string(),
	ingredients: array(string()),
	steps: array(string()),
	isVegetarian: boolean(),
	source: optional(string()),
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

/////////////////////////
/////////////////////////

/////////////////////////
// User
/////////////////////////

const User = object({
	id: string(),
	name: string(),
	email: string(),
	dateAdded: number(),
})

type User = Infer<typeof User>

/////////////////////////
/////////////////////////

export { Recipe, Rating, User }
