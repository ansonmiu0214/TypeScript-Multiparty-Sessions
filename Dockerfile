FROM ubuntu

WORKDIR /home

COPY requirements.txt /home
COPY build_container.sh /home

RUN chmod +x build_container.sh
RUN /home/build_container.sh

RUN rm build_container.sh