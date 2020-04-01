FROM ubuntu

WORKDIR /home

COPY sandbox /home/sandbox
COPY requirements.txt /home
COPY build_image.sh /home

RUN chmod +x build_image.sh
RUN /home/build_image.sh

RUN rm build_image.sh