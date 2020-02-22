import { isRelativeImport } from '../../src/lib/utils/rule-utils';

describe('isRelativeImport()', () => {
    describe('when filePath starts with dot', () => {
        test('should return true', () => {
            const givenPath = './some/path';

            const result = isRelativeImport(givenPath)

            expect(result).toBeTruthy();
        });
    });

    describe('when filePath does not start with dot', () => {
        test('should return false', () => {
            const givenPath = '@some/path';

            const result = isRelativeImport(givenPath)

            expect(result).toBeFalsy();
        });
    });
});
