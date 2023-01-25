import * as functions from 'firebase-functions'
import * as fs from 'fs'
import * as admin from 'firebase-admin'

const runConfig = {
	isEmulator: process.env.FUNCTIONS_EMULATOR === 'true',
}

admin.initializeApp()

const firestore = admin.firestore()

firestore.settings({ ignoreUndefinedProperties: true })
const functionsEU = () => functions.region('europe-west1')

export { admin, functions, functionsEU, firestore, runConfig, fs }
