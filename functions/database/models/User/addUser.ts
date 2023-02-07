import { User } from '../../../types/types'
import { create } from 'superstruct'
import { addDocumentWithId } from '../../firestore'
import { CollectionRef } from '../../utils'

const addUser = async (user: User): Promise<void> => {
	const item = create(user, User)

	await addDocumentWithId([CollectionRef.users, user.id], item)
}

export { addUser }
