export interface Sfc {
	__path__: string
	__content__: string
	[key: string]: string
}

export type Sfcs = Record<string, Sfc>
