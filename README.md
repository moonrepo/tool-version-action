# moon - Automatic tool versioning

Since [moon](https://github.com/moonrepo/moon) requires fully-qualified semantic versions for tools
in its toolchain, this action will automatically determine valid versions based on a partial
version. For example, `14` will resolve to `14.10.12`.

It achieves this by resolving an [input](#inputs) against the tool's official manifest (or GitHub's
manifest) to determine a valid semantic version. Once resolved, it will set moon specific
environment variables for subsequent steps.

## Installation

```yaml
# ...
jobs:
  ci:
    name: CI
    runs-on: ubuntu-latest
    steps:
      - uses: moonrepo/tool-version-action@v1
        with:
          node: 16
      - run: moon ci
```

Multiple versions can be supported through GitHub actions matrix.

```yaml
# ...
jobs:
  ci:
    name: CI
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [14, 16, 18]
      - uses: moonrepo/tool-version-action@v1
        with:
          node: ${{ matrix.node-version }}
      - run: moon ci
```

## Inputs

- `node` - The Node.js version to resolve. Will set a `MOON_NODE_VERSION` environment variable.

## Testing

This action can be tested locally by defining an environment variable for the input you'd like test,
and executing the `index.mjs` file. For example, if you'd like to test Node.js:

```shell
INPUT_NODE=16 node index.mjs
```
