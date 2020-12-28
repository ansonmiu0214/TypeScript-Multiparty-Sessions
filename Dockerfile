FROM ubuntu:focal

# Get latest packages
RUN ln -fs /usr/share/zoneinfo/Europe/London /etc/localtime \
  && apt-get update \
  && apt-get install -y --no-install-recommends \
    curl \
    default-jdk \
    git \
    gpg-agent \
    graphviz \
    make \
    nano \
    python3-pip \
    software-properties-common \
    sudo \
    unzip \
    vim \
  && rm -rf /var/lib/apt/lists/* /tmp/*

RUN useradd stscript \
  && echo "stscript:stscript" | chpasswd \
  && adduser stscript sudo \
  && mkdir /home/stscript \
  && chown stscript:stscript /home/stscript

RUN mkdir /home/stscript/bin

##############################################################################
# Scribble-Java
##############################################################################

COPY --chown=stscript:stscript \
  scribble-java /home/stscript/scribble-java/

RUN cd /home/stscript/scribble-java \
  && ./mvnw -Dlicense.skip install \
  && cd scribble-dist/target \
  && unzip scribble-dist-0.4.4-SNAPSHOT.zip \
  && chmod +x scribblec.sh \
  && cp -r lib scribblec.sh /home/stscript/bin

##############################################################################
# Codegen
##############################################################################

# Setup Python
RUN add-apt-repository -y ppa:deadsnakes/ppa \
  && apt-get install python3.8 \
  && echo python3.8 --version

RUN echo 'alias python=python3.8' \
    >> /home/stscript/.bashrc

COPY requirements.txt /home/stscript
RUN python3.8 -m pip install -r /home/stscript/requirements.txt

# Setup NodeJS
RUN curl -sL https://deb.nodesource.com/setup_12.x -o nodesource_setup.sh \
  && bash ./nodesource_setup.sh \
  && apt-get -y install nodejs build-essential

RUN npm i -g npm typescript typescript-formatter concurrently

##############################################################################
# Performance benchmarks
##############################################################################

# Setup perf-benchmarks
COPY --chown=stscript:stscript \
  perf-benchmarks /home/stscript/perf-benchmarks/

RUN find /home/stscript/perf-benchmarks -name *.sh -exec chmod +x {} \;

RUN cd /home/stscript/perf-benchmarks \
  && python3.8 -m pip install -r requirements.txt \
  && pushd . \
  && cd simple_pingpong \
    && npm i \
    && cd clients && ./build.sh \
  && popd \
  && cd complex_pingpong \
    && npm i \
    && cd clients && ./build.sh \
  && popd

# Setup scripts
COPY --chown=stscript:stscript \
  scripts /home/stscript/scripts/

RUN chmod +x /home/stscript/scripts/*.sh

# Prepare workspace
COPY --chown=stscript:stscript \
  setup.sh /home/stscript

RUN echo '[ ! -z "$TERM" -a -r /etc/welcome ] && bash setup.sh && cat /etc/welcome' \
    >> /etc/bash.bashrc \
    ; echo "\
To run the code generator, you can do\n\
  $ codegen.sh --help\n\
\n\
To run a case study application, for example Battleships, you can do\n\
  $ cd case-studies/Battleships\n\
  $ npm run build\n\
  $ npm start\n\
and visit http://localhost:8080\n"\
    > /etc/welcome

USER stscript

WORKDIR /home/stscript

ENV PATH="/home/stscript/bin:/home/stscript/scripts:$PATH"
EXPOSE 3000 5000 8000 8080 8888