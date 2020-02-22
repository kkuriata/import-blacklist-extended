import * as Path from 'path';
import { Utils } from 'tslint';
import { ImportRef, Options, ForbiddenImports } from '../models';

export function getFailureString(fileName: string, forbiddenImports: string[], importRef: ImportRef): string {
  const relativeFileName: string = Path.relative('.', fileName);
  const relativeForbiddenImports: string = forbiddenImports
    .map(forbiddenImport => `- ${Path.relative('.', forbiddenImport)}`)
    .join('\n');

  return Utils.dedent`
        Blacklisted import in file: ${relativeFileName}
        You cannot import from:
            ${relativeForbiddenImports}

        Incorrect "${importRef.text}" in "${importRef.parent.getText()}"
    `;
}

export function categorizeForbiddenImports(options: Options): ForbiddenImports {
  const { tsLintDirectory } = options;

  return options.imports.reduce(
    (acc: ForbiddenImports, forbiddenImport: string) => {
      if (isRelativeImport(forbiddenImport)) {
        acc.relative.push(Path.resolve(tsLintDirectory, forbiddenImport));
      } else {
        acc.alias.push(forbiddenImport);
      }

      return acc;
    },
    { alias: [], relative: [] } as ForbiddenImports,
  );
}

export function isRelativeImport(filePath: string): boolean {
  // TODO: easy workaround, improve this in the future
  return filePath.trim().startsWith('.');
}
