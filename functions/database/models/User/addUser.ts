import { User } from '../../../types/types'
import { create } from 'superstruct'
import { addDocumentWithId, getDocument, runTransaction } from '../../firestore'
import { CollectionRef } from '../../utils'

const addUser = async (user: User): Promise<void> => {
	const newUser = create(user, User)

	runTransaction(async (transaction) => {
		try {
			const savedUserData = await getDocument([CollectionRef.users, newUser.id], transaction)
			const savedUser = create(savedUserData, User)
			if (!savedUser) throw new Error()
		} catch {
			await addDocumentWithId([CollectionRef.users, user.id], newUser, transaction)
		}
	})
}

export { addUser }
