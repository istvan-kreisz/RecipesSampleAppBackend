import { Recipe } from '../../../types/types'
import { array, create } from 'superstruct'
import { getCollectionGroup } from '../../firestore'
import { CollectionRef } from '../../utils'

const getRecipes = async (searchText: string, authorId?: string): Promise<Recipe[]> => {
	const filters: Array<[string, FirebaseFirestore.WhereFilterOp, any]> = [
		['title', '>=', searchText],
		['title', '<=', searchText + '\uf8ff'],
	]
	if (authorId) {
		filters.push(['authorId', '==', authorId])
	}
	const result = getCollectionGroup(CollectionRef.recipes, filters, ['dateAdded', 'desc'])
	const recipes = create(result, array(Recipe))
	return recipes
}

export { getRecipes }
