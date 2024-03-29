import { functionsEU } from '../setup'
import { type, create } from 'superstruct'
import { Recipe } from '../types/types'
import { checkIfAuthenticated, handleError } from '../utils/utils'
import { addRecipe as addRecipeDB } from '../database/models/Recipe/addRecipe'

const addRecipe = functionsEU()
	.runWith({ memory: '1GB' })
	.https.onRequest(async (req, res) => {
		try {
			const InputType = type({
				recipe: Recipe,
			})

			const data = create(req.body, InputType)

			await checkIfAuthenticated(req, data.recipe.authorId)

			await addRecipeDB(data.recipe)

			res.status(200).send()
		} catch (err) {
			handleError(err, res)
		}
	})

export { addRecipe }
