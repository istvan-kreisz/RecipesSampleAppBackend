import * as functions from 'firebase-functions'
import * as fs from 'fs'
import * as admin from 'firebase-admin'
import { Recipe } from './types/types'
import { array, create } from 'superstruct'
import { addRecipe } from './database/models/Recipe/addRecipe'

const runConfig = {
	isEmulator: process.env.FUNCTIONS_EMULATOR === 'true',
}

admin.initializeApp()

const firestore = admin.firestore()

firestore.settings({ ignoreUndefinedProperties: true })
const functionsEU = () => functions.region('europe-west1')

if (runConfig.isEmulator) {
	const uploadRecipes = async () => {
		const fs = require('fs')
		const recipesJSON = JSON.parse(fs.readFileSync('./testData/recipes.json'))

		const recipes = create(recipesJSON, array(Recipe))
		for (const recipe of recipes) {
			await addRecipe(recipe)
		}
	}
	uploadRecipes()
}

export { admin, functions, functionsEU, firestore, runConfig, fs }
