import { Recipe } from '../../../types/types'
import { array, create } from 'superstruct'
import { getCollectionGroup } from '../../firestore'
import { CollectionRef } from '../../utils'

const getRecipes = async (searchText: string, authorId?: string): Promise<Recipe[]> => {
	const filters: Array<[string, FirebaseFirestore.WhereFilterOp, any]> = []
	if (searchText.length) {
		filters.push(['title', '>=', searchText])
		filters.push(['title', '<=', searchText + '\uf8ff'])
	}
	if (authorId) {
		filters.push(['authorId', '==', authorId])
	}
	console.log(filters)
	const result = await getCollectionGroup(CollectionRef.recipes, filters)
	const recipes = create(
		result.map((r) => r.data),
		array(Recipe)
	)
	return recipes
}

export { getRecipes }
