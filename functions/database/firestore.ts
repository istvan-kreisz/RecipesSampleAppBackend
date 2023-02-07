import { firestore, functions } from '../setup'
import { chunkArray, notEmpty } from '../utils/utils'

const docRef = (
	path: string[]
): FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> => {
	return firestore.doc(path.join('/'))
}

const collectionRef = (
	path: string[]
): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> => {
	return firestore.collection(path.join('/'))
}

const getCollection = async (
	path: string[],
	filters?: Array<[string, FirebaseFirestore.WhereFilterOp, any]>,
	transaction?: FirebaseFirestore.Transaction
): Promise<any[]> => {
	try {
		let ref:
			| FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>
			| FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = collectionRef(path)
		if (filters && filters.length) {
			for (const filter of filters) {
				if (filter && filter.length === 3) {
					ref = ref.where(...filter)
				}
			}
		}
		let querySnapshot: any
		if (transaction) {
			querySnapshot = await transaction.get(ref)
		} else {
			querySnapshot = await ref.get()
		}
		if (querySnapshot?.empty) {
			return []
		} else {
			return querySnapshot?.docs?.map((doc: any) => doc?.data())?.filter(notEmpty) ?? []
		}
	} catch (err) {
		return []
	}
}

const deleteCollection = async (
	path: string[],
	filters?: Array<[string, FirebaseFirestore.WhereFilterOp, any]>,
	transaction?: FirebaseFirestore.Transaction
) => {
	try {
		const docIds = await getDocumentIds(path, filters, transaction)
		const paths = docIds.map((docId) => [...path, docId])
		await deleteDocuments(paths)
	} catch (err) {
		return
	}
}

const getDocumentIds = async (
	path: string[],
	filters?: Array<[string, FirebaseFirestore.WhereFilterOp, any]>,
	transaction?: FirebaseFirestore.Transaction
): Promise<string[]> => {
	try {
		let ref:
			| FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>
			| FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = collectionRef(path)
		if (filters && filters.length) {
			for (const filter of filters) {
				if (filter && filter.length === 3) {
					ref = ref.where(...filter)
				}
			}
		}
		let querySnapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
		if (transaction) {
			querySnapshot = await transaction.get(ref)
		} else {
			querySnapshot = await ref.get()
		}
		if (querySnapshot) {
			if (querySnapshot.empty) {
				return []
			} else {
				return querySnapshot.docs.filter((doc) => doc.exists).map((doc) => doc.id)
			}
		} else {
			return []
		}
	} catch (err) {
		return []
	}
}

const getCollectionGroup = async (
	name: string,
	filters?: Array<[string, FirebaseFirestore.WhereFilterOp, any]>,
	orderBy?: [string, FirebaseFirestore.OrderByDirection | undefined],
	startAfter?: string[],
	limit?: number,
	transaction?: FirebaseFirestore.Transaction,
	filterByIds?: string[]
) => {
	let ref:
		| FirebaseFirestore.CollectionGroup<FirebaseFirestore.DocumentData>
		| FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = firestore.collectionGroup(name)
	if (filters && filters.length) {
		for (const filter of filters) {
			if (filter && filter.length === 3) {
				ref = ref.where(...filter)
			}
		}
	}
	if (orderBy) {
		ref = ref.orderBy(orderBy[0], orderBy[1])
	}
	if (startAfter && startAfter.length) {
		const doc = await docRef(startAfter).get()
		ref = ref.startAfter(doc)
	}
	if (limit) {
		ref = ref.limit(limit)
	}

	let querySnapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
	if (transaction) {
		querySnapshot = await transaction.get(ref)
	} else {
		querySnapshot = await ref.get()
	}

	if (querySnapshot?.empty) {
		return []
	} else {
		return (
			querySnapshot?.docs
				.map((doc) => {
					const docPath = doc.ref.path.split('/')

					if (docPath && docPath.length) {
						if (filterByIds && !filterByIds.includes(doc.id)) {
							return undefined
						} else {
							const data = doc?.data()
							if (data) {
								return { data: data, path: docPath }
							} else {
								return undefined
							}
						}
					} else {
						return undefined
					}
				})
				?.filter(notEmpty) ?? []
		)
	}
}

const getDocument = async (
	path: string[],
	transaction?: FirebaseFirestore.Transaction
): Promise<FirebaseFirestore.DocumentData | null | undefined> => {
	try {
		const ref = docRef(path)
		if (transaction) {
			return (await transaction.get(ref)).data()
		} else {
			return (await ref.get()).data()
		}
	} catch (err) {
		return null
	}
}

const addDocument = async (
	path: string[],
	data: object,
	transaction?: FirebaseFirestore.Transaction
): Promise<string> => {
	const ref = collectionRef(path)
	const arg = {
		...data,
	}
	const newId = ref.doc().id
	if (transaction) {
		transaction.set(ref.doc(newId), arg)
	} else {
		await ref.doc(newId).set(arg)
	}
	return newId
}

const addDocumentWithId = async (
	path: string[],
	data: object,
	transaction?: FirebaseFirestore.Transaction
): Promise<void> => {
	const ref = docRef(path)
	const arg = {
		...data,
	}

	if (transaction) {
		transaction.set(ref, arg)
	} else {
		await ref.set(arg)
	}
}

const addDocumentsWithIds = async (docs: { path: string[]; data: object }[]): Promise<void> => {
	const batch = firestore.batch()
	docs.forEach((doc) => {
		//
		const ref = docRef(doc.path)
		const data = {
			...doc.data,
		}
		batch.set(ref, data)
	})
	await batch.commit()
}

const updateDocument = async (
	path: string[],
	data: object,
	transaction?: FirebaseFirestore.Transaction,
	merge = true
): Promise<void> => {
	const ref = docRef(path)
	const updatedData = {
		...data,
	}

	const options = { merge: merge }

	if (transaction) {
		transaction.set(ref, updatedData, options)
	} else {
		await ref.set(updatedData, options)
	}
}

const deleteDocument = async (
	path: string[],
	transaction?: FirebaseFirestore.Transaction
): Promise<void> => {
	const ref = docRef(path)
	if (transaction) {
		transaction.delete(ref)
	} else {
		await ref.delete()
	}
}

const deleteDocuments = async (paths: string[][]): Promise<void> => {
	const batchDelete = (paths: string[][]): Promise<FirebaseFirestore.WriteResult[]> => {
		const batch = firestore.batch()

		const refs = paths.map((path) => docRef(path))
		refs.forEach((ref) => batch.delete(ref))

		return batch.commit()
	}

	// Get new write batch
	const pathsChunked = chunkArray(paths, 500)
	for (const pathsChunk of pathsChunked) {
		try {
			await batchDelete(pathsChunk)
		} catch (err) {
			functions.logger.error(err)
		}
	}
}

const runTransaction = async (
	updateBlock: (transaction: FirebaseFirestore.Transaction) => void
) => {
	await firestore.runTransaction(async (transaction) => {
		return updateBlock(transaction)
	})
}

export {
	getCollection,
	deleteCollection,
	getDocumentIds,
	getCollectionGroup,
	getDocument,
	addDocument,
	addDocumentWithId,
	addDocumentsWithIds,
	updateDocument,
	deleteDocument,
	deleteDocuments,
	runTransaction,
}
