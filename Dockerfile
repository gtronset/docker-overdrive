FROM lsiobase/alpine:3.18-2904cf3f-ls5
RUN echo "Getting Packages..." && \
    apk --no-cache add \
      ca-certificates bash \
      curl coreutils util-linux \
      libxml2-utils musl-utils \
      openssl tidyhtml && \
    wget https://api.github.com/repos/chbrown/overdrive/zipball/refs/tags/2.4.0 -O overdrive.zip && \
    unzip -d ./overdrive/ -j overdrive.zip && \
    mv overdrive/overdrive.sh /usr/bin/overdrive && \
    rm overdrive.zip && \
    rm -rf ./overdrive && \
    echo "Fixing Permissions..." && \
    chmod +x /usr/bin/overdrive && \
    echo "All done"

COPY run-overdrive.sh /usr/bin/run-overdrive

RUN chmod +x /usr/bin/run-overdrive
