import { functionsEU } from '../setup'
import { type, create } from 'superstruct'
import { Recipe } from '../types/types'
import { handleError } from '../utils/utils'
import { addRecipe as addRecipeDB } from '../database/models/Recipe/addRecipe'

const addRecipe = functionsEU().https.onRequest(async (req, res) => {
	try {
		// todo: check for auth and if user exists
		const InputType = type({
			recipe: Recipe,
		})

		const data = create(req.body, InputType)

		await addRecipeDB(data.recipe)

		res.status(200).send()
	} catch (err) {
		handleError(err, res)
	}
})

export { addRecipe }
