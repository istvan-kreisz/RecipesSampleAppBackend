import { functionsEU, functions, admin } from '../setup'
import { type, create, string } from 'superstruct'
import { checkIfAuthenticated, handleError } from '../utils/utils'
import { User } from '../types/types'
import { getUser } from '../database/models/User/getUser'
import { addUser } from '../database/models/User/addUser'

const getRandomInt = (min: number, max: number): number => {
	const minBound = Math.ceil(min)
	const maxBound = Math.floor(max)
	return Math.floor(Math.random() * (maxBound - minBound + 1)) + minBound
}

const fetchUser = functionsEU().https.onRequest(async (req, res) => {
	try {
		const InputType = type({
			userId: string(),
		})

		const data = create(req.body, InputType)

		await checkIfAuthenticated(req, data.userId)

		let user: User
		try {
			user = await getUser(data.userId)
		} catch {
			const userAuthInfo = await admin.auth().getUser(data.userId)
			if (userAuthInfo.email) {
				const newUser: User = {
					id: data.userId,
					name: `user${getRandomInt(0, 1000)}`,
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

		res.status(200).send({
			user: user,
		})
	} catch (err) {
		handleError(err, res)
	}
})

export { fetchUser }
