export function formatName(name: string) {
	if (name.endsWith('index.vue')) name = name.replace('/index.vue', '')
	return name.slice(name.lastIndexOf('/') + 1).replace('.vue', '')
}
