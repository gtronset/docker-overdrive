FROM lsiobase/alpine:3.17-version-579d97af
RUN echo "Getting Packages..." && \
    apk --no-cache add \
      ca-certificates bash \
      curl coreutils util-linux \
      libxml2-utils musl-utils \
      openssl tidyhtml && \
    curl https://chbrown.github.io/overdrive/overdrive.sh -o /usr/bin/overdrive && \
    echo "Fixing Permissions..." && \
    chmod +x /usr/bin/overdrive && \
    echo "All done"
