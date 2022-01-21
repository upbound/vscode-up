# ====================================================================================
# Setup Project

PROJECT_NAME := vscode-up
PROJECT_REPO := github.com/upbound/$(PROJECT_NAME)

-include build/makelib/common.mk

# ====================================================================================
# Targets

# run `make help` to see the targets and options

# We want submodules to be set up the first time `make` is run.
# We manage the build/ folder and its Makefiles as a submodule.
# The first time `make` is run, the includes of build/*.mk files will
# all fail, and this target will be run. The next time, the default as defined
# by the includes will be run instead.
fallthrough: submodules
	@echo Initial setup complete. Running make again . . .
	@make

# Update the submodules, such as the common build scripts.
submodules:
	@git submodule sync
	@git submodule update --init --recursive

install: 
	@yarn install

build.ext: install
	@yarn compile

package: build.ext
	@mkdir -p ./out
	@yarn vsce package -o ./out/