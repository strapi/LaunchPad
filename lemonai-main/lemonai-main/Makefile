# Makefile

# Configurable variables for easy modification
IMAGE_NAME   := hexdolemonai/lemon-runtime-sandbox
TAG          := v0.0.5
DOCKERFILE   := containers/runtime/Dockerfile
PLATFORMS    := linux/amd64,linux/arm64
FRONTEND_DIR := frontend  # Frontend directory variable

APP_IMAGE_NAME   := hexdolemonai/lemon
APP_TAG          := v0.0.16
APP_DOCKERFILE   := containers/app/Dockerfile

# ANSI color codes
GREEN=$(shell tput -Txterm setaf 2)
YELLOW=$(shell tput -Txterm setaf 3)
RED=$(shell tput -Txterm setaf 1)
BLUE=$(shell tput -Txterm setaf 6)
RESET=$(shell tput -Txterm sgr0)

# Declare phony targets to avoid conflicts with files of the same name
.PHONY: build start-backend start-frontend run

# Default goal: Start both frontend and backend
.DEFAULT_GOAL := run

# Build and push Docker image
build-runtime-sandbox:
	@echo "Building and pushing $(IMAGE_NAME):$(TAG) for platforms [$(PLATFORMS)]"
	docker buildx build \
	  --platform $(PLATFORMS) \
	  --tag $(IMAGE_NAME):$(TAG) \
	  --tag $(IMAGE_NAME):latest \
	  -f $(DOCKERFILE) \
	  --push .

build-app:
	@echo "Building and pushing $(APP_IMAGE_NAME):$(APP_TAG) for platforms [$(PLATFORMS)]"
	docker buildx build \
	  --platform $(PLATFORMS) \
	  --tag $(APP_IMAGE_NAME):$(APP_TAG) \
	  --tag $(APP_IMAGE_NAME):latest \
	  -f $(APP_DOCKERFILE) \
	  --push .

# Start backend service
start-backend:
	npm run start

# Start frontend service
start-frontend:
	cd $(FRONTEND_DIR) && npm run dev

# Start both frontend and backend
run:
	@$(MAKE) -s init-tables
	@$(MAKE) -s start-backend &
	@$(MAKE) -s start-frontend 

# Init tables
init-tables:
	node src/models/sync.js

install-frontend-dependencies:
	@echo "$(YELLOW)Setting up frontend environment...$(RESET)"
	echo "$(BLUE)Installing frontend dependencies with npm...$(RESET)"
	@cd frontend && npm install
	@echo "$(GREEN)Frontend dependencies installed successfully.$(RESET)"

install-backend-dependencies:
	@echo "$(YELLOW)Setting up backend environment...$(RESET)"
	echo "$(BLUE)Installing backend dependencies with npm...$(RESET)"
	@npm install --production
	@echo "$(GREEN)Backend dependencies installed successfully.$(RESET)"

init:
	@echo "$(GREEN)Init project...$(RESET)"
	@$(MAKE) -s install-backend-dependencies
	@$(MAKE) -s install-frontend-dependencies
	@$(MAKE) -s init-tables
	@echo "$(GREEN)Init completed successfully.$(RESET)"