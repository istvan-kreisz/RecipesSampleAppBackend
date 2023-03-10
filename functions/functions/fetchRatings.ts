import { functionsEU } from '../setup'
import { type, create, optional, array, string } from 'superstruct'
import { Recipe } from '../types/types'
import { checkIfAuthenticated, handleError } from '../utils/utils'
import { getRatings as getRatingsDB } from '../database/models/Rating/getRatings'

const fetchRatings = functionsEU()
	.runWith({ memory: '1GB' })
	.https.onRequest(async (req, res) => {
		try {
			const itemCountPerPage = 15
			await checkIfAuthenticated(req)

			const InputType = type({
				recipe: Recipe,
				startAfter: optional(array(string())),
			})

			const data = create(req.body, InputType)

			const ratings = await getRatingsDB(data.recipe, itemCountPerPage, data.startAfter)

			const payload = { data: ratings, isLastPage: ratings.length < itemCountPerPage }
			console.log(payload)

			res.status(200).send(payload)
		} catch (err) {
			handleError(err, res)
		}
	})

export { fetchRatings }
