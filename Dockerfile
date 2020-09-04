FROM ubuntu:20.04

WORKDIR /home

COPY sandbox /home/sandbox
COPY requirements.txt /home
COPY build_image.sh /home

ENV DEBIAN_FRONTEND=noninteractive

RUN chmod +x build_image.sh
RUN /home/build_image.sh

COPY codegen.sh /home
RUN chmod +x codegen.sh

COPY test.sh /home
RUN chmod +x test.sh

RUN rm build_image.sh