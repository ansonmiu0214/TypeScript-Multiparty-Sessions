# Multiparty Session Types in TypeScript
A mono-repo for a session type API code generation toolchain for modern web programming.

> This project was originally built for the author's
> [undergraduate Master's thesis](https://www.imperial.ac.uk/media/imperial-college/faculty-of-engineering/computing/public/1920-ug-projects/Miu,-Anson-(kcm116).pdf)
> at Imperial College London.

1. [Getting started](#getting-started)

    * [Docker workflow](#docker)
    * [Repository layout](#layout)

1. [User guide](#user-guide)

    * [Using code generation toolchain](#usage)
    * [Running tests](#tests)
    * [Running case studies](#case-studies)
    * [Running benchmarks](#run-benchmarks)
    * [Visualising benchmarks](#visualise-benchmarks)

1. [Other documentation](#other-docs)

---

## <a name="getting-started"></a> 1️⃣ Getting started

### <a name="docker"></a> Docker workflow (recommended)

The following steps assume a Unix environment with Docker
properly installed. Other platforms supported by Docker may find a similar
way to import the Docker image.

```bash
$ git clone --recursive \
    https://github.com/ansonmiu0214/TypeScript-Multiparty-Sessions.git
$ cd TypeScript-Multiparty-Sessions
$ docker-compose run --service-ports dev
```

This command exposes the terminal of the _container_.
To run the toolchain (e.g. show the helptext):

```bash
dev@dev:~$ codegen --help
```

### <a name="layout"></a> Repository Layout

- `scribble-java` contains the [Scribble toolchain](https://github.com/scribble/scribble-java),
  for handling multiparty protocol descriptions, a dependency of our toolchain.
- `codegen` contains the source code of our code generator, written in Python, which generates
  TypeScript code for implementing the provided multiparty protocol.
- `protocols` contains various Scribble protocol descriptions, including those used in the case
  studies.
- `case-studies` contains 3 case studies of implementing interactive web applications with our
  toolchain, namely _Noughts and Crosses_, _Travel Agency_, and _Battleships_.
- `perf-benchmarks`contains the code to generate performance benchmarks, including an iPython
  notebook to visualise the benchmarks collected from an experiment run.
- `scripts` contains various convenient scripts to run the toolchain and build the case studies.
- `setup` contains scripts to set up the Docker container.
- `web-sandbox` contains configuration files for the web development, e.g. TypeScript configurations
  and NPM `package.json` files.

## <a name="user-guide"></a> 2️⃣ User guide

### <a name="usage"></a> Using code generation toolchain

Refer to the helptext for detailed information:

```bash
$ codegen --help
```

We illustrate how to use our toolchain to generate TypeScript APIs:

#### __Server-side endpoints__

The following command reads as follows:

```bash
$ codegen ~/protocols/TravelAgency.scr TravelAgency S \
	node -o ~/case-studies/TravelAgency/src
```

1. Generate APIs for role `S` of the `TravelAgency`
protocol specified in `~/protocols/TravelAgency.scr`;

2. Role `S` is implemented as a `node` 
(server-side) endpoint;

3. Output the generated APIs under the path `~/case-studies/TravelAgency/src`

#### __Browser-side endpoints__

The following command reads as follows:

```bash
$ codegen ~/protocols/TravelAgency.scr TravelAgency A \
	browser -s S -o ~/case-studies/TravelAgency/client/src
```

1. Generate APIs for role `A` of the `TravelAgency`
protocol specified in `~/protocols/TravelAgency.scr`;

2. Role `A` is implemented as a `browser` endpoint,
and assume role `S` to be the server;

3. Output the generated APIs under the path `~/case-studies/TravelAgency/client/src`

### <a name="tests"></a> Running tests

To run the end-to-end tests:

```bash
# Run from any directory
$ run_tests
```

The end-to-end tests verify that

* The toolchain correctly parses the Scribble protocol specification files, and,
* The toolchain correctly generates TypeScript APIs, and,
* The generated APIs can be type-checked by the TypeScript Compiler successfully.

The protocol specification files, describing the multiparty communication, are
located in `~/codegen/tests/system/examples`.
The generated APIs are saved under `~/web-sandbox` (which is a
sandbox environment set up for the TypeScript Compiler) and are deleted when the test
finishes.

### <a name="case-studies"></a> Running case studies

> Run the following to install dependencies for
> any pre-existing case studies:
>
> ```bash
> $ setup_case-studies
> ```

We include three case studies of realistic
web applications implemented using the generated APIs.

For example,
to generate the APIs for the case study `NoughtsAndCrosses`:

```bash
# Run from any directory
$ build_noughts-and-crosses
```

Note that the identifier used in the `build_`
command converts the camelCase convention into
a lower-case hyphenated string.

To run the case study `NoughtsAndCrosses`:

```bash
$ cd ~/case-studies/NoughtsAndCrosses
$ npm start
```

and visit `http://localhost:8080`.

Other case studies currently available include:

* TravelAgency
* Battleships

### <a name="run-benchmarks"></a> Running benchmarks

> Run the following to install dependencies for
> the case studies:
>
> ```bash
> $ setup_benchmarks
> ```

We include a script to run the performance benchmarks on web applications built using
the generated APIs, against a baseline
implementation. 

To run the performance benchmarks:
```bash
$ cd ~/perf-benchmarks
$ ./run_benchmark.sh
```

___Note:___ If the terminal log gets stuck at
`Loaded client page`, open a web browser and access
http://localhost:5000.

___Customisation:___: 
You can customise the _number of messages exchanged_ and the
_number of runs_ for each experiment.
These parameters are represented in the `run_benchmark.sh`
script by the `-m` and `-r` flags respectively.

For example, to set up two configurations -- running the benchmark with `100` round trips and `1000` round trips -- and run each configuration `100` times:

```bash
$ cd ~/perf-benchmarks
$ ./run_benchmark.sh -m 100 1000 -r 100
```

Running `./run_benchmark.sh`
will clear any existing logs.

### <a name="visualise-benchmarks"></a> Visualising benchmarks

To visualise the performance benchmarks, run:

```bash
$ cd ~/perf-benchmarks
$ jupyter notebook --ip=0.0.0.0
/* ...snip... */
	To access the notebook, open this file in a browser:
		/* ...snip... */
	Or copy and paste one of these URLs:
	   http://dev:8888/?token=<token>
	or http://127.0.0.1:8888/?token=<token>
```

Use a web browser to open the URL
in the terminal output
beginning with `http://127.0.0.1:8888`.
Open the _Benchmark Visualisation.ipynb_ notebook.

Click on _Kernel -> Restart \& Run All_ from the top menu bar.

___Note:___ If you change the message configuration (i.e.
the `-m` flag), update the `NUM_MSGS` tuple located
in the first cell of the notebook as shown below:

```python
# Update these variables if you wish to
# visualise other benchmarks.
VARIANTS = ('bare', 'mpst')
NUM_MSGS = (100, 1000)
```

## <a name="other-docs"></a> 3️⃣ Other Documentation

Consult the [wiki](https://github.com/ansonmiu0214/TypeScript-Multiparty-Sessions/wiki) for more documentation.

* [Guide to Implementing Your Own Protocols](https://github.com/ansonmiu0214/TypeScript-Multiparty-Sessions/wiki/Guide-to-Implementing-Your-Own-Protocols)
* [Future Work from 2019/2020 MEng Project](https://github.com/ansonmiu0214/TypeScript-Multiparty-Sessions/wiki/2020-Imperial-MEng-Computing-Individual-Project:-Recap)