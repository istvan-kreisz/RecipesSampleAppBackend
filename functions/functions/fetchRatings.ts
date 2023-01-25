import { functionsEU } from '../setup'
import { type, create } from 'superstruct'
import { Recipe } from '../types/types'
import { handleError } from '../utils/utils'
import { getRatings as getRatingsDB } from '../database/models/Rating/getRatings'

const fetchRatings = functionsEU().https.onRequest(async (req, res) => {
	try {
		const payload = req.body.data

		const InputType = type({
			recipe: Recipe,
		})

		const data = create(payload, InputType)

		const ratings = await getRatingsDB(data.recipe)

		res.status(400).send({
			ratings: ratings,
		})
	} catch (err) {
		handleError(err, res)
	}
})

export { fetchRatings }
