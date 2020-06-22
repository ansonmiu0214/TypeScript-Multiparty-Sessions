# TypeScript-Multiparty-Sessions

# SessionTS
A session type API code generation toolchain for modern web programming.

## Getting Started
We provide a development environment on _Docker_, which handles Python package dependencies and the [_Scribble toolchain_](https://github.com/scribble/scribble-java/).

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
python3.7 -m mpst_ts <filename> <protocol> <role> node
```

For browser-side endpoints
```bash
python3.7 -m mpst_ts <filename> <protocol> <role> browser -s <server_role>
```

## Tests

Performs the following steps for each example Scribble protocol:
1. Generate TypeScript code into the sandbox environment;
2. Compile using the TypeScript compiler.

```bash
python3.7 -m mpst_ts.tests.system
```
 
