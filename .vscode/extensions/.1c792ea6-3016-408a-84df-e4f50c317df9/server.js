'use strict';

const {join, parse} = require('path');

const {createConnection, ProposedFeatures, TextDocuments} = require('vscode-languageserver');
const findPkgDir = require('find-pkg-dir');
const parseUri = require('vscode-uri').URI.parse;
const pathIsInside = require('path-is-inside');
const stylelintVSCode = require('./stylelint-vscode');

let config;
let configOverrides;
let autoFixOnSave;
let configBasedir;
let ignorePath;
let configFile;

let ignoreDisables;
let allowEmptyInput;

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments();

async function validate(document, isAutoFixOnSave = false) {
  const options = {
    fix: isAutoFixOnSave,
  };
  config && (options.config = config);
  configBasedir && (options.configBasedir = configBasedir);
  configOverrides && (options.configOverrides = configOverrides);
  configFile && (options.configFile = configFile);
  ignorePath && (options.ignorePath = ignorePath);
  
  toString.call(ignoreDisables) === '[object Boolean]' && (options.ignoreDisables = ignoreDisables);
  toString.call(allowEmptyInput) === '[object Boolean]' && (options.allowEmptyInput = allowEmptyInput);

  const documentPath = parseUri(document.uri).fsPath;

  if (documentPath) {
    const workspaceFolders = await connection.workspace.getWorkspaceFolders();

    if (workspaceFolders) {
      for (const {uri} of workspaceFolders) {
        const workspacePath = parseUri(uri).fsPath;

        if (pathIsInside(documentPath, workspacePath)) {
          options.ignorePath = join(workspacePath, '.stylelintignore');
          break;
        }
      }
    }
    if (ignorePath) {
      options.ignorePath = ignorePath
    } else if (options.ignorePath === undefined) {
      options.ignorePath = join(findPkgDir(documentPath) || parse(documentPath).root, '.stylelintignore');
    }
  }

  try {
    connection.sendDiagnostics({
      uri: document.uri,
      diagnostics: await stylelintVSCode(document, options)
    });
  } catch (err) {
    if (err.reasons) {
      for (const reason of err.reasons) {
        connection.window.showErrorMessage(`stylelint: ${reason}`);
      }

      return;
    }

    // https://github.com/stylelint/stylelint/blob/10.0.1/lib/utils/configurationError.js#L10
    if (err.code === 78) {
      connection.window.showErrorMessage(`stylelint: ${err.message}`);
      return;
    }

    connection.window.showErrorMessage(err.stack.replace(/\n/ug, ' '));
  }
}

function validateAll() {
  for (const document of documents.all()) {
    validate(document);
  }
}

connection.onInitialize(() => {
  validateAll();

  return {
    capabilities: {
      textDocumentSync: documents.syncKind
    }
  };
});
connection.onDidChangeConfiguration(({settings}) => {
  config = settings.stylelint.config;
  configOverrides = settings.stylelint.configOverrides;
  autoFixOnSave = settings.stylelint.autoFixOnSave;
  configBasedir = settings.stylelint.configBasedir;
  configFile = settings.stylelint.configFile;
  ignorePath = settings.stylelint.ignorePath;
  ignoreDisables = settings.stylelint.ignoreDisables;
  allowEmptyInput = settings.stylelint.allowEmptyInput;

  validateAll();
});
connection.onDidChangeWatchedFiles(validateAll);

documents.onDidChangeContent(({document}) => validate(document));
documents.onDidClose(({document}) => connection.sendDiagnostics({
  uri: document.uri,
  diagnostics: []
}));

documents.onDidSave(({document}) => {
  if (autoFixOnSave) {
    validate(document, true);
  }
});

documents.listen(connection);

connection.listen();
