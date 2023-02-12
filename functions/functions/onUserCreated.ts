import { functions, functionsEU } from '../setup'
import { User } from '../types/types'
import { getRandomInt } from '../utils/utils'
import { addUser } from '../database/models/User/addUser'

const onUserCreated = functionsEU()
	.runWith({ memory: '1GB' })
	.auth.user()
	.onCreate(async (user) => {
		if (user.email) {
			const newUser: User = {
				id: user.uid,
				name: `user${getRandomInt(0, 10000)}`,
				email: user.email,
				dateAdded: new Date().getTime(),
			}
			try {
				await addUser(newUser)
			} catch {
				throw new functions.https.HttpsError('data-loss', 'User Could Not Be Created')
			}
		} else {
			throw new functions.https.HttpsError('not-found', 'User Email Not Found')
		}
	})

export { onUserCreated }
