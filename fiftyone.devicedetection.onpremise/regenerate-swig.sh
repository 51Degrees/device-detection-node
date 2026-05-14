#!/usr/bin/env bash
# Regenerate the SWIG V8 wrapper for the node addon.
#
# Why this script and not a one-liner `swig ...`:
#   SWIG (as of 4.4.1) emits V8 API calls that newer V8 versions have removed
#   or changed. We patch the generated wrapper in place to remain compatible
#   across Node 22 (V8 12), Node 24 (V8 13), Node 25 (V8 14.1), and Node 26
#   (V8 14.6+). Macro-only shims are not always possible because some affected
#   names (e.g. `Holder`) are also valid V8 member names that must NOT be
#   remapped. So we sed/patch the specific call sites instead.

set -euo pipefail
cd "$(dirname "$0")"

swig -c++ -javascript -node -o hash_node_wrap.cxx hash_node.i

# --- V8 API drift patches ---
# Each replacement is keyed on a literal string SWIG's javascriptrun.swg /
# javascriptcode.swg emits, so the script is idempotent and safe to re-run.

# 1) V8 13+ removed FunctionCallbackInfo<T>::Holder() (it was always equivalent
#    to This()). Cannot use a #define Holder() This() shim because V8 itself
#    still has PropertyCallbackInfo::Holder() which the macro would corrupt.
sed -i.bak 's/args\.Holder()/args.This()/g' hash_node_wrap.cxx

# 2) V8 14.5+ (Node 26) removed the 1-arg overloads of
#    GetAlignedPointerFromInternalField / SetAlignedPointerInInternalField
#    in favour of a 2-arg / 3-arg form taking a v8::EmbedderDataTypeTag.
#    SWIGFOD_EMBEDDER_TAG_ARG is defined in node_before.i and expands to
#    ", v8::EmbedderDataTypeTag(0)" on new V8, empty on old.
sed -i.bak 's/GetAlignedPointerFromInternalField(0)/GetAlignedPointerFromInternalField(0 SWIGFOD_EMBEDDER_TAG_ARG)/g' hash_node_wrap.cxx
sed -i.bak 's/SetAlignedPointerInInternalField(0, cdata)/SetAlignedPointerInInternalField(0, cdata SWIGFOD_EMBEDDER_TAG_ARG)/g' hash_node_wrap.cxx

# 3) V8 14.x late (Node 26) removed v8::String::WriteUtf8 / Utf8Length.
#    V2 variants exist since V8 12.5 (i.e. not in Node 22's V8 12.4).
#    Replace SWIG's wrapper macros (defined in the generated file) with
#    version-conditional ones. The .replace below preserves SWIG's chosen
#    arg list so call sites need no further changes.
python3 - <<'PY'
path = 'hash_node_wrap.cxx'
with open(path) as f:
    s = f.read()

s = s.replace(
    '#define SWIGV8_WRITE_UTF8(handle, buffer, len) (handle)->WriteUtf8(v8::Isolate::GetCurrent(), buffer, len)',
    '''#if V8_MAJOR_VERSION >= 13
#define SWIGV8_WRITE_UTF8(handle, buffer, len) ((handle)->WriteUtf8V2(v8::Isolate::GetCurrent(), (buffer), (len), v8::String::WriteFlags::kNullTerminate))
#else
#define SWIGV8_WRITE_UTF8(handle, buffer, len) (handle)->WriteUtf8(v8::Isolate::GetCurrent(), buffer, len)
#endif'''
)

s = s.replace(
    '#define SWIGV8_UTF8_LENGTH(handle) (handle)->Utf8Length(v8::Isolate::GetCurrent())',
    '''#if V8_MAJOR_VERSION >= 13
#define SWIGV8_UTF8_LENGTH(handle) ((int)(handle)->Utf8LengthV2(v8::Isolate::GetCurrent()))
#else
#define SWIGV8_UTF8_LENGTH(handle) (handle)->Utf8Length(v8::Isolate::GetCurrent())
#endif'''
)

with open(path, 'w') as f:
    f.write(s)
PY

rm -f hash_node_wrap.cxx.bak

echo "Regenerated hash_node_wrap.cxx (SWIG $(swig -version | awk '/SWIG Version/ {print $3}'); V8 drift patches applied)"
