# FROM nikolaik/python-nodejs:python3.12-nodejs22
FROM node:22-slim

# Shared environment variables
ENV MAMBA_ROOT_PREFIX=/chataa/micromamba \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    EDITOR=code \
    VISUAL=code \
    GIT_EDITOR="code --wait" \
    OPENVSCODE_SERVER_ROOT=/chataa/.openvscode-server


# Install base system dependencies
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends \
        wget curl sudo apt-utils git jq tmux bash curl ca-certificates file lsof zip unzip \
        libatomic1 && \
    # Remove packages with CVEs and no updates yet, if present
    (apt-get remove -y libaom3 || true) && \
    (apt-get remove -y libjxl0.7 || true) && \
    (apt-get remove -y libopenexr-3-1-30 || true) && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Remove UID 1000 if it's called pn--this fixes the nikolaik image for ubuntu users
RUN if getent passwd 1000 | grep -q pn; then userdel pn; fi

# Create necessary directories
RUN mkdir -p /chataa && \
    mkdir -p /chataa/logs 


# Install micromamba
RUN mkdir -p /chataa/micromamba/bin && \
    /bin/bash -c "PREFIX_LOCATION=/chataa/micromamba BIN_FOLDER=/chataa/micromamba/bin INIT_YES=no CONDA_FORGE_YES=yes $(curl -L https://micro.mamba.pm/install.sh)" && \
    /chataa/micromamba/bin/micromamba config remove channels defaults && \
    /chataa/micromamba/bin/micromamba config list

# Create the chataa virtual environment and install poetry and python
RUN /chataa/micromamba/bin/micromamba create -n chataa \
      -c conda-forge \
      python=3.12 \
      poetry \
      -y
ENV PATH=/chataa/micromamba/envs/chataa/bin:$PATH


RUN \
    if [ -d /chataa/code ]; then rm -rf /chataa/code; fi && \
    mkdir -p /chataa/code/chataa  

COPY ./src/runtime/plugins/vscode/settings.json /workspace/.vscode/settings.json
RUN chmod -R a+rwx /workspace/.vscode/settings.json


# Install all dependencies
WORKDIR /chataa/code

# ================================================================
# END: Build Runtime Image from Scratch
# ================================================================


# ================================================================
# Copy Project source files
# ================================================================
RUN if [ -d /chataa/code/chataa ]; then rm -rf /chataa/code/chataa; fi


COPY ./src/runtime/plugins/vscode/settings.json /workspace/.vscode/settings.json
RUN chmod -R a+rwx /workspace/.vscode/settings.json

COPY ./src/runtime /chataa/code/chataa
RUN chmod a+rwx /chataa/code/chataa/action_execution_server.js

COPY ./package.json ./package-lock.json /chataa/code/
RUN npm i --production

COPY ./browser_server /chataa/code/browser_server

# 安装 browser_server 依赖并安装 chromium
RUN pip install -r /chataa/code/browser_server/requirements.txt && \
    patchright install chromium --with-deps --no-shell

# Setup VSCode Server
ARG RELEASE_TAG="openvscode-server-v1.94.2"
ARG RELEASE_ORG="gitpod-io"
# ARG USERNAME=openvscode-server
# ARG USER_UID=1000
# ARG USER_GID=1000

RUN if [ -z "${RELEASE_TAG}" ]; then \
        echo "The RELEASE_TAG build arg must be set." >&2 && \
        exit 1; \
    fi && \
    arch=$(uname -m) && \
    if [ "${arch}" = "x86_64" ]; then \
        arch="x64"; \
    elif [ "${arch}" = "aarch64" ]; then \
        arch="arm64"; \
    elif [ "${arch}" = "armv7l" ]; then \
        arch="armhf"; \
    fi && \
    wget https://github.com/${RELEASE_ORG}/openvscode-server/releases/download/${RELEASE_TAG}/${RELEASE_TAG}-linux-${arch}.tar.gz && \
    tar -xzf ${RELEASE_TAG}-linux-${arch}.tar.gz && \
    if [ -d "${OPENVSCODE_SERVER_ROOT}" ]; then rm -rf "${OPENVSCODE_SERVER_ROOT}"; fi && \
    mv ${RELEASE_TAG}-linux-${arch} ${OPENVSCODE_SERVER_ROOT} && \
    cp ${OPENVSCODE_SERVER_ROOT}/bin/remote-cli/openvscode-server ${OPENVSCODE_SERVER_ROOT}/bin/remote-cli/code && \
    rm -f ${RELEASE_TAG}-linux-${arch}.tar.gz

ENV SKIP_LLM_API_KEY_VERIFICATION=true

# ================================================================
# END: Build from versioned image
# ================================================================


# Install extra dependencies if specified