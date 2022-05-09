import path from 'path';
import { writeFile } from 'fs/promises';

import * as tjs from 'typescript-json-schema';
import glob from 'fast-glob';

generateJSONSchemas().catch(console.error);

async function generateJSONSchemas() {
	const paths: string[] = await glob('./**/*.types.ts');
	const resolvedPaths: string[] = paths.map((v) => path.posix.join(...path.resolve(v).split(path.sep))); //BUG upstream with paths on windows: https://github.com/YousefED/typescript-json-schema/issues/347

	const settings: tjs.PartialArgs = { required: true, ref: true };
	const compilerOptions: tjs.CompilerOptions = { strictNullChecks: true };
	const program: tjs.Program = tjs.getProgramFromFiles(resolvedPaths, compilerOptions);
	const generator: tjs.JsonSchemaGenerator = tjs.buildGenerator(program, settings);

	resolvedPaths.forEach((v: string) => {
		const generatedSchema: tjs.Definition = tjs.generateSchema(program, '*', settings, [v], generator);
		const schemaToWrite: string =
			'const schema = ' + JSON.stringify(generatedSchema) + ';\nexport default schema.definitions;';
		const outputPath: string = v.replace(/\.types\.ts$/, '.schema.js');
		writeFile(outputPath, schemaToWrite);
	});
}
