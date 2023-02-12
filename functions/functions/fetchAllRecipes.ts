import { functionsEU } from '../setup'
import { type, create, string } from 'superstruct'
import { checkIfAuthenticated, handleError } from '../utils/utils'
import { getRecipes as getRecipesDB } from '../database/models/Recipe/getRecipes'

const fetchAllRecipes = functionsEU()
	.runWith({ memory: '1GB' })
	.https.onRequest(async (req, res) => {
		try {
			await checkIfAuthenticated(req)

			const InputType = type({
				searchText: string(),
			})

			const data = create(req.body, InputType)

			const recipes = await getRecipesDB(data.searchText)

			res.status(200).send(recipes)
		} catch (err) {
			handleError(err, res)
		}
	})

export { fetchAllRecipes }
