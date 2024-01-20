#!/usr/bin/env bash

mkdir -p ../.vscode
cp .vscode/* ../.vscode/
rm -rf .git

git config core.hookspath .skc/githooks