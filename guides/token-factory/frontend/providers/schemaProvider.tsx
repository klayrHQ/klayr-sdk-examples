import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getSchemas } from '@/utils/api';
import { Schema } from '@klayr/codec';

type SchemaChild = {moduleCommand: string, schema: Schema};

interface Schemas {
	block: { schema: Schema }
	header: { schema: Schema }
	asset: { schema: Schema }
	transaction: { schema: Schema }
	event: { schema: Schema }
	standardEvent: { schema: Schema }
	ccm: { schema: Schema }
	events: SchemaChild[]
	assets: SchemaChild[]
	commands: SchemaChild[]
	messages: SchemaChild[]
}

interface SchemasProviderProps {
	schemas: Schemas | undefined
	getSchema: (baseTransaction: boolean, moduleCommand?: string) => Schema | undefined
}

export const SchemasContext = createContext<SchemasProviderProps>(
	{} as SchemasProviderProps,
);

export const useSchemas = () => useContext(SchemasContext);

export const SchemasProvider = ({ children }: {
	children: ReactNode;
}) => {
	const [schemas, setSchemas] = useState<Schemas>();

	useEffect(() => {
		const getSchemasFromService = async () => {
			const fetchedSchemas = await getSchemas();

			setSchemas(fetchedSchemas);
		}

		getSchemasFromService();
	}, [])

	const getSchema = (baseTransaction: boolean, moduleCommand?: string) => {
		if (!schemas) return undefined;

		return baseTransaction ? schemas.transaction.schema : schemas.commands.find((command) => command.moduleCommand === moduleCommand).schema;
	}

	return (
		<SchemasContext.Provider value={{ schemas, getSchema }}>
			{children}
		</SchemasContext.Provider>
	)
}