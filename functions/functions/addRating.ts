import { functionsEU } from '../setup'
import { type, create } from 'superstruct'
import { Recipe, Rating } from '../types/types'
import { handleError } from '../utils/utils'
import { addRating as addRatingDB } from '../database/models/Rating/addRating'

const addRating = functionsEU().https.onRequest(async (req, res) => {
	try {
		// todo: check for auth and if user exists
		const InputType = type({
			recipe: Recipe,
			rating: Rating,
		})

		const data = create(req.body, InputType)

		await addRatingDB(data.rating, data.recipe)

		res.status(400).send()
	} catch (err) {
		handleError(err, res)
	}
})

export { addRating }
