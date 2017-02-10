
# Docca PDF Writer

This repo contains the first stage of a re-write of the Docca PDF writer.

This initial commit has the minimum functionality required to write Hello World! to a PDF in order to keep it as simple as possible. At the same time it is designed to be extendable to get it to the point where it can produce PDFA1-B valid files as the current Docca writer does now (soon to be released).

See [Building a PDF writer](building-pdf-writer.md) for a quick PDF primer.

### Coding Goals

- use pure functions - I like to call it bottle code, one way in and one way out. It makes getting good test coverage a breeze and makes the code more reusable and easily refactored
- keep it flat, from the file structure to code objects, it won't go any deeper than needed
- it will avoid subclassing without a damn good reason. Classes should be holders of state and import functions to get stuff done and maybe house a small number of very specialised methods
- keep it as simple as possible at all times. It's fairly much guarenteed to get more complicated than desired without any extra help.

```
npm i
mkdir ./tmp
npm test
open tmp/writes-to-stream-out.pdf
npm test -- --coverage
open coverage/lcov-report/index.html
```

### Tech

- Node6/ES6/Babel
- Jest
- ESLint
- Lodash

