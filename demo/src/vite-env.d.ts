/// <reference types="vite/client" />
interface ImportMetaEnv {
	readonly VITE_IMMERSAL_TOKEN: string;
	readonly VITE_IMMERAL_MAP: number;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
