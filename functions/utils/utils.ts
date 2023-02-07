import { is, object, string } from 'superstruct'
import { Response } from 'firebase-functions/v1'
import { admin, functions } from '../setup'

const handleError = (err, res: Response) => {
	functions.logger.error(err)
	if (err && is(err, object())) {
		const message = err['message']
		if (message && is(message, string())) {
			res.statusMessage = message
		}
	} else if (err && is(err, string())) {
		res.statusMessage = err
	}
	res.status(500).end()
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
				throw new functions.https.HttpsError('permission-denied', 'Permission Denied')
			}
		}
	} catch {
		throw new functions.https.HttpsError('unauthenticated', 'Not Authenticated')
	}
}

export { handleError, chunkArray, notEmpty, checkIfAuthenticated }
