import { Recipe } from '../../../types/types'
import { create } from 'superstruct'
import { addDocumentWithId } from '../../firestore'
import { CollectionRef } from '../../utils'

const addRecipe = async (recipe: Recipe): Promise<void> => {
	const item = create(recipe, Recipe)

	await addDocumentWithId(
		[CollectionRef.users, recipe.authorId, CollectionRef.recipes, recipe.id],
		item
	)
}

export { addRecipe }
