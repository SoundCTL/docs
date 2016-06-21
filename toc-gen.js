'use strict';

const Toc = require('markdown-toc');
const Fs = require('fs');
const Docs = require('./docs.json')

const internals = {
  filename: './DOCS.md'
};

function joinDocs() {
  Fs.truncateSync(internals.filename);
  for (let i = 0; i < Docs.length; ++i) {
    const data = Fs.readFileSync('./docs/' + Docs[i], 'utf8');
    Fs.appendFileSync(internals.filename, data)
  }
}

internals.generate = function() {
  const version = 1;
  const api = Fs.readFileSync(internals.filename, 'utf8');
  const tocOptions = {
    bullets: '-',
    slugify: function(text) {
      return text.toLowerCase().replace(/\s/g, '-').replace(/[^\w-]/g, '');
    }
  };
  const output = Toc.insert(api, tocOptions).replace(/<!-- version -->(.|\n)*<!-- versionstop -->/, '<!-- version -->\n# SoundCTL API v' + version + ' Documentation\n<!-- versionstop -->');
  Fs.writeFileSync(internals.filename, output);
};

joinDocs();
internals.generate();
