import { is, object, string } from 'superstruct'
import { Response } from 'firebase-functions/v1'

const handleError = (err, res: Response) => {
	console.error(err)
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
	let result: T[][] = []
	for (let i = 0; i < array.length; i += size) {
		let chunk = array.slice(i, i + size)
		result.push(chunk)
	}
	return result
}

const notEmpty = <T>(value: T | null | undefined): value is T => {
	return value !== null && value !== undefined
}

export { handleError, chunkArray, notEmpty }
