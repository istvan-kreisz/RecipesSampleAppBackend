import { Recipe } from '../../../types/types'
import { array, create } from 'superstruct'
import { getCollectionGroup } from '../../firestore'
import { CollectionRef } from '../../utils'

const getRecipes = async (
	searchText: string,
	limit: number,
	startAfter?: string[],
	authorId?: string
): Promise<Recipe[]> => {
	const filters: Array<[string, FirebaseFirestore.WhereFilterOp, any]> = []
	if (searchText.length) {
		filters.push(['title', '>=', searchText])
		filters.push(['title', '<=', searchText + '\uf8ff'])
	}
	if (authorId) {
		filters.push(['authorId', '==', authorId])
	}
	const result = await getCollectionGroup(
		CollectionRef.recipes,
		filters,
		['dateAdded', 'desc'],
		startAfter,
		limit
	)
	const recipes = create(
		result.map((r) => r.data),
		array(Recipe)
	)
	return recipes
}

export { getRecipes }
