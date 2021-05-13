"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emptyLine = '';
exports.emptyLine = emptyLine;
const lineWithOnlyWhitespaces = '   ';
exports.lineWithOnlyWhitespaces = lineWithOnlyWhitespaces;
const commentLine = '# This is a comment';
exports.commentLine = commentLine;
const commentLineStartWithSpaces = '    # This is a comment';
exports.commentLineStartWithSpaces = commentLineStartWithSpaces;
const keyLine = '  key: value';
exports.keyLine = keyLine;
const valueLine = '  - true';
exports.valueLine = valueLine;
const mockForClosest = `seq:
  # Ordered sequence of nodes
  Block style: !!seq
  - Mercury   # Rotates - no light/dark sides.
  - Venus     # Deadliest. Aptly named.
  - Earth     # Mostly dirt.
  - Mars      # Seems empty.
`;
exports.mockForClosest = mockForClosest;
const selectedForClosest = '  - Mercury   # Rotates - no light/dark sides.';
exports.selectedForClosest = selectedForClosest;
const expectedLineForClosest = '  Block style: !!seq';
exports.expectedLineForClosest = expectedLineForClosest;
//# sourceMappingURL=mockData.js.map