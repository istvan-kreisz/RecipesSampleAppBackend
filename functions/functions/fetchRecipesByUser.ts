import { functionsEU } from '../setup'
import { type, create, string, optional, array } from 'superstruct'
import { User } from '../types/types'
import { checkIfAuthenticated, handleError } from '../utils/utils'
import { getRecipes as getRecipesDB } from '../database/models/Recipe/getRecipes'

const fetchRecipesByUser = functionsEU()
	.runWith({ memory: '1GB' })
	.https.onRequest(async (req, res) => {
		try {
			const itemCountPerPage = 5
			await checkIfAuthenticated(req)

			const InputType = type({
				user: User,
				searchText: string(),
				startAfter: optional(array(string())),
			})

			const data = create(req.body, InputType)

			const recipes = await getRecipesDB(
				data.searchText,
				itemCountPerPage,
				data.startAfter,
				data.user.id
			)

			const payload = { data: recipes, isLastPage: recipes.length < itemCountPerPage }

			res.status(200).send(payload)
		} catch (err) {
			handleError(err, res)
		}
	})

export { fetchRecipesByUser }
