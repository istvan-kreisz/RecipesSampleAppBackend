import { functionsEU } from '../setup'
import { type, create } from 'superstruct'
import { Recipe, Rating } from '../types/types'
import { checkIfAuthenticated, handleError } from '../utils/utils'
import { addRating as addRatingDB } from '../database/models/Rating/addRating'

const addRating = functionsEU()
	.runWith({ memory: '1GB' })
	.https.onRequest(async (req, res) => {
		try {
			await checkIfAuthenticated(req)

			const InputType = type({
				recipe: Recipe,
				rating: Rating,
			})

			const data = create(req.body, InputType)

			await addRatingDB(data.rating, data.recipe)

			res.status(200).send()
		} catch (err) {
			handleError(err, res)
		}
	})

export { addRating }
