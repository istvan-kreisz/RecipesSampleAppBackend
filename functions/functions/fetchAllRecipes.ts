import { functionsEU } from '../setup'
import { type, create, string } from 'superstruct'
import { handleError } from '../utils/utils'
import { getRecipes as getRecipesDB } from '../database/models/Recipe/getRecipes'

const fetchAllRecipes = functionsEU().https.onRequest(async (req, res) => {
	try {
		// todo: check for auth and if user exists
		const InputType = type({
			searchText: string(),
		})

		const data = create(req.body, InputType)

		const recipes = await getRecipesDB(data.searchText)

		res.status(400).send({ recipes: recipes })
	} catch (err) {
		handleError(err, res)
	}
})

export { fetchAllRecipes }
