import { functionsEU, functions, admin } from '../setup'
import { type, create, string } from 'superstruct'
import { checkIfAuthenticated, getRandomInt, handleError } from '../utils/utils'
import { User } from '../types/types'
import { getUser } from '../database/models/User/getUser'
import { addUser } from '../database/models/User/addUser'

const fetchUser = functionsEU()
	.runWith({ memory: '1GB' })
	.https.onRequest(async (req, res) => {
		try {
			const InputType = type({
				userId: string(),
			})

			const data = create(req.body, InputType)

			try {
				await checkIfAuthenticated(req, data.userId)
			} catch {
				res.sendStatus(401)
				return
			}

			let user: User
			try {
				user = await getUser(data.userId)
			} catch {
				const userAuthInfo = await admin.auth().getUser(data.userId)
				if (userAuthInfo.email) {
					const newUser: User = {
						id: data.userId,
						name: `user${getRandomInt(0, 10000)}`,
						email: userAuthInfo.email,
						dateAdded: new Date().getTime(),
					}
					try {
						await addUser(newUser)
						user = newUser
					} catch {
						throw new functions.https.HttpsError('not-found', 'User Not Found')
					}
				} else {
					throw new functions.https.HttpsError('not-found', 'User Not Found')
				}
			}

			res.status(200).send(user)
		} catch (err) {
			handleError(err, res)
		}
	})

export { fetchUser }
