import { Rating, Recipe } from '../../../types/types'
import { array, create } from 'superstruct'
import { getCollection } from '../../firestore'
import { CollectionRef } from '../../utils'

const getRatings = async (
	recipe: Recipe,
	limit: number,
	startAfter?: string[]
): Promise<Rating[]> => {
	const result = await getCollection(
		[
			CollectionRef.users,
			recipe.authorId,
			CollectionRef.recipes,
			recipe.id,
			CollectionRef.ratings,
		],
		[['dateAdded', '>=', 0]],
		[['dateAdded', 'asc']],
		startAfter,
		limit
	)
	const ratings = create(result, array(Rating))
	return ratings
}

export { getRatings }
