# SessionTS
A session type API code generation toolchain for modern web programming.

## Related Repositories
* Performance benchmarks - [SessionTS-Benchmarks](https://github.com/ansonmiu0214/SessionTS-Benchmarks)
* Examples - [SessionTS-Examples](https://github.com/ansonmiu0214/SessionTS-Examples)

## Getting Started
We provide a development environment on _Docker_, which handles Python package dependencies and the [_Scribble toolchain_](https://github.com/scribble/scribble-java/).

### Prerequisites
* Docker
* Node.js

### Setup DevEnv
```bash
# Make scripts executable
chmod +x build.sh
chmod +x start.sh

# Build Docker image
./build.sh
```

### Enter DevEnv
```bash
# Starts interactive shell inside the Docker container
./start.sh

# To leave the development environment:
exit
```

## Usage

For server side endpoints
```bash
./codegen.sh <filename> <protocol> <role> node
```

For browser-side endpoints
```bash
./codegen.sh -m mpst_ts <filename> <protocol> <role> browser -s <server_role>
```

## Tests

Performs the following steps for each example Scribble protocol:
1. Generate TypeScript code into the sandbox environment;
2. Compile using the TypeScript compiler.

```bash
./test.sh
```