import { Recipe, Rating } from '../../../types/types'
import { create } from 'superstruct'
import { addDocumentWithId } from '../../firestore'
import { CollectionRef } from '../../utils'

const addRating = async (rating: Rating, recipe: Recipe): Promise<void> => {
	const item = create(recipe, Recipe)

	await addDocumentWithId(
		[
			CollectionRef.users,
			recipe.authorId,
			CollectionRef.recipes,
			recipe.id,
			CollectionRef.ratings,
			rating.id,
		],
		item
	)
}

export { addRating }
