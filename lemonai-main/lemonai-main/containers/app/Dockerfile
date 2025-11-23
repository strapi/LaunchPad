# Start from the Node.js 22 slim image
FROM node:22-slim

# Set the working directory in the container
WORKDIR /app

# --- Layer 1: System Dependencies (Least Frequent Change) ---
# Switch to root user to install packages
USER root
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends \
    wget curl sudo apt-utils git jq tmux bash curl ca-certificates file make \
    libgl1-mesa-glx \
    libasound2-plugins libatomic1 && \
    # Remove packages with CVEs and no updates yet, if present
    (apt-get remove -y libaom3 || true) && \
    (apt-get remove -y libjxl0.7 || true) && \
    (apt-get remove -y libopenexr-3-1-30 || true) && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# --- Layer 2: Package Manager Manifests (Infrequent Change) ---
# Copy package.json and Makefile. If you have a lock file (package-lock.json or yarn.lock),
# copy it here as well. This is crucial for caching dependency installation.
COPY ./package.json ./
RUN npm install --production

# COPY ./package-lock.json ./  # Or yarn.lock - uncomment and use if you have one!
COPY ./Makefile ./

# --- Layer 3: Install Project Dependencies (Changes when manifests change) ---
# This runs 'npm install' or similar based on your Makefile's 'init' target.
# This layer will be cached as long as package.json, lock file, and Makefile haven't changed.
COPY ./frontend ./frontend
RUN cd frontend && npm install

# --- Layer 4: Playwright Installation (Changes if Playwright version in package.json changes or make init changes) ---
# Installs Playwright browsers and their OS dependencies.
# Using --with-deps is generally more efficient and ensures OS dependencies are met.
# RUN npx playwright install --with-deps
RUN npx playwright install
RUN npx playwright install-deps

# --- Layer 5: Create static directories (Very infrequent change) ---
# This is a lightweight operation.
RUN mkdir workspace

# --- Layer 6: Application Code (Most Frequent Change) ---
# Copy your application code last, as this is what changes most often.
COPY ./public ./public
COPY ./bin ./bin
COPY ./src ./src
COPY ./types ./types
RUN make init-tables

# At this point, the image is built with root permissions for the build steps.
# For running the application, you might want to switch to a non-root user.
# e.g., USER node (the default user for the 'node' image)
# USER node

# Your original Dockerfile had 'USER root' quite late.
# It's needed for 'apt-get'. If 'make init' or 'npx playwright install'
# also require root, then keeping USER root as set above is fine for the build process.

# The 'ls' and 'pwd' commands were likely for debugging and are removed from the optimized version.

# Define CMD or ENTRYPOINT below to run your application
# Example: CMD ["node", "src/index.js"]