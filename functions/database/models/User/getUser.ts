import { User } from '../../../types/types'
import { create } from 'superstruct'
import { getDocument } from '../../firestore'
import { CollectionRef } from '../../utils'

const getUser = async (userId: string): Promise<User> => {
	const result = await getDocument([CollectionRef.users, userId])
	const user = create(result, User)
	return user
}

export { getUser }
