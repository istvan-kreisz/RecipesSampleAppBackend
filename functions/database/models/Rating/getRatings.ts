import { Rating, Recipe } from '../../../types/types'
import { array, create } from 'superstruct'
import { getCollection } from '../../firestore'
import { CollectionRef } from '../../utils'

const getRatings = async (recipe: Recipe): Promise<Rating[]> => {
	const result = await getCollection([
		CollectionRef.users,
		recipe.authorId,
		CollectionRef.recipes,
		recipe.id,
		CollectionRef.ratings,
	])
	const ratings = create(result, array(Rating))
	return ratings
}

export { getRatings }
