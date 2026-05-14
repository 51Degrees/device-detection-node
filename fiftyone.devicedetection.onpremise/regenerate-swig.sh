#!/usr/bin/env bash
# Regenerate the SWIG V8 wrapper for the node addon.
#
# Why this script and not a one-liner `swig ...`:
#   SWIG (as of 4.4.1) emits `args.Holder()` in its built-in JavaScript
#   templates. V8 13+ (Node 23/24/25) removed `FunctionCallbackInfo::Holder()`,
#   so the generated wrapper fails to compile. We patch the generated wrapper
#   in place to call `args.This()` instead, which V8 docs state is always
#   equivalent for FunctionCallbackInfo.
#
# A preprocessor macro can't replace this step because V8's own headers also
# declare `PropertyCallbackInfo::Holder()`, which a global `#define Holder()`
# would mis-rewrite.

set -euo pipefail
cd "$(dirname "$0")"

swig -c++ -javascript -node -o hash_node_wrap.cxx hash_node.i

# V8 13+: FunctionCallbackInfo<T>::Holder() removed (equivalent to This()).
sed -i.bak 's/args\.Holder()/args.This()/g' hash_node_wrap.cxx
rm -f hash_node_wrap.cxx.bak

echo "Regenerated hash_node_wrap.cxx (SWIG $(swig -version | awk '/SWIG Version/ {print $3}'); Holder()->This() patch applied)"
