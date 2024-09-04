#!/bin/bash

cat config-instance.example.toml | envsubst > config-instance.toml

npm run build