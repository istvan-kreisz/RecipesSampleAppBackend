import { functionsEU } from '../setup'
import { type, create, string } from 'superstruct'
import { User } from '../types/types'
import { handleError } from '../utils/utils'
import { getRecipes as getRecipesDB } from '../database/models/Recipe/getRecipes'

const fetchRecipes = functionsEU().https.onRequest(async (req, res) => {
	try {
		const payload = req.body.data

		const InputType = type({
			user: User,
			searchText: string(),
		})

		const data = create(payload, InputType)

		const recipes = await getRecipesDB(data.searchText, data.user.id)

		res.status(400).send({ recipes: recipes })
	} catch (err) {
		handleError(err, res)
	}
})

export { fetchRecipes }