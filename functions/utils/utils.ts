import { is, object, string } from 'superstruct'
import { Response } from 'firebase-functions/v1'
import { admin, functions } from '../setup'

const getRandomInt = (min: number, max: number): number => {
	const minBound = Math.ceil(min)
	const maxBound = Math.floor(max)
	return Math.floor(Math.random() * (maxBound - minBound + 1)) + minBound
}

const handleError = (err, res: Response) => {
	functions.logger.error(err)
	let errorCode = 500
	if (err && is(err, object())) {
		const message = err['message']
		if (message && is(message, string())) {
			res.statusMessage = message
			if (message === 'Not Authenticated') {
				errorCode = 401
			}
		}
	} else if (err && is(err, string())) {
		res.statusMessage = err
	}
	res.status(errorCode).end()
}

const chunkArray = <T>(array: T[], size: number): T[][] => {
	const result: T[][] = []
	for (let i = 0; i < array.length; i += size) {
		const chunk = array.slice(i, i + size)
		result.push(chunk)
	}
	return result
}

const notEmpty = <T>(value: T | null | undefined): value is T => {
	return value !== null && value !== undefined
}

const checkIfAuthenticated = async (req: functions.https.Request, userId?: string) => {
	try {
		const tokenId = req.get('Authorization')?.split('Bearer ')[1]

		if (!tokenId) throw new Error()

		const token = await admin.auth().verifyIdToken(tokenId)
		if (userId) {
			if (token.uid !== userId) {
				throw new Error()
			}
		}
	} catch {
		throw new functions.https.HttpsError('unauthenticated', 'Not Authenticated')
	}
}

export { getRandomInt, handleError, chunkArray, notEmpty, checkIfAuthenticated }
