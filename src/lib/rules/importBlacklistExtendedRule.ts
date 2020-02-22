import { AbstractWalker, Replacement, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import { ForbiddenImports, ImportRef, Options, ValidationResult } from '../models';
import { categorizeForbiddenImports, getFailureString, isRelativeImport } from '../utils/rule-utils';
import { findImports, ImportKind } from 'tsutils';
import * as Path from 'path';
import { some } from 'lodash';

const MESSAGES = {
  replacement: 'insert relative path in here',
};

export class Rule extends Rules.AbstractRule {
  apply(sourceFile: SourceFile): RuleFailure[] {
    if (!this.ruleArguments.length || !this.isEnabled()) return [];

    const options: Options = this.getOptions().ruleArguments[0] as Options;

    return this.applyWithWalker(new ImportBlacklistExtendedWalker(sourceFile, 'import-blacklist-extended', options));
  }
}

class ImportBlacklistExtendedWalker extends AbstractWalker<Options> {
  private forbiddenImports: ForbiddenImports = { alias: [], relative: [] };

  walk(sourceFile: SourceFile): void {
    if (!this.options?.imports?.length) {
      return;
    }

    this.forbiddenImports = categorizeForbiddenImports(this.options);

    findImports(sourceFile, ImportKind.All).forEach((importRef: ImportRef) => {
      const { text: importRefPath } = importRef;
      const { isInvalid, forbiddenImports }: ValidationResult = this.validate(sourceFile, importRefPath);

      if (isInvalid) {
        const start = importRef.getStart() + 1;
        const width = importRef.getWidth() - 2;

        // TODO: find proposals (files that export imported members)
        const fix = new Replacement(start, width, MESSAGES.replacement);

        this.addFailure(start, width, getFailureString(sourceFile.fileName, forbiddenImports, importRef), fix);
      }
    });
  }

  validate(sourceFile: SourceFile, importRefPath: string): ValidationResult {
    const isRelativePath: boolean = isRelativeImport(importRefPath);
    const importDestinationPath = isRelativePath
      ? Path.resolve(Path.dirname(sourceFile.fileName), importRefPath)
      : importRefPath;

    const forbiddenImports = isRelativePath ? this.forbiddenImports.relative : this.forbiddenImports.alias;

    const isInvalid: boolean = some(forbiddenImports, forbiddenImport => {
      return isRelativePath
        ? forbiddenImport.includes(importDestinationPath)
        : forbiddenImport === importDestinationPath;
    });

    return {
      isInvalid,
      forbiddenImports,
    } as ValidationResult;
  }
}
