export const exhaustiveCheck = (prop: never): void => {
	// eslint-disable-next-line no-console
	console.error(`${prop} value was not processed`)
}
