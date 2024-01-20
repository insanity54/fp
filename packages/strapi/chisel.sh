#!/bin/bash

. .env
chisel client --auth="${CHISEL_AUTH}" "${CHISEL_SERVER}" R:8900:localhost:1337

