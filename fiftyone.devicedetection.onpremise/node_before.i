/* *********************************************************************
 * This Original Work is copyright of 51 Degrees Mobile Experts Limited.
 * Copyright 2019 51 Degrees Mobile Experts Limited, 5 Charlotte Close,
 * Caversham, Reading, Berkshire, United Kingdom RG4 7BY.
 *
 * This Original Work is licensed under the European Union Public Licence (EUPL) 
 * v.1.2 and is subject to its terms as set out below.
 *
 * If a copy of the EUPL was not distributed with this file, You can obtain
 * one at https://opensource.org/licenses/EUPL-1.2.
 *
 * The 'Compatible Licences' set out in the Appendix to the EUPL (as may be
 * amended by the European Commission) shall be deemed incompatible for
 * the purposes of the Work and the provisions of the compatibility
 * clause in Article 5 of the EUPL shall not apply.
 * 
 * If using the Work as, or as part of, a network application, by 
 * including the attribution notice(s) required under Article 5 of the EUPL
 * in the end user terms of the application under an appropriate heading, 
 * such notice(s) shall fulfill the requirements of that article.
 * ********************************************************************* */

/*
 * This file contains swig instructions to be included before everything else
 */

/*
 * Override the overloaded constructor template to
 * carry though the correct error message. The additions are the
 * two "goto fail"'s.
 *
 * V8 backend only — the NAPI backend uses Napi::CallbackInfo (`info`) and
 * C++ exceptions for overload dispatch, so this override doesn't apply.
 */
#ifdef SWIG_JAVASCRIPT_V8
%fragment ("js_ctor_dispatch_case", "templates")
%{
	if(args.Length() == $jsargcount) {
		errorHandler.err.Clear();
#if (V8_MAJOR_VERSION-0) < 4 && (SWIG_V8_VERSION < 0x031903)
		self = $jswrapper(args, errorHandler);
		if(errorHandler.err.IsEmpty()) {
			SWIGV8_ESCAPE(self);
		} else {
			goto fail;
		}
#else
		$jswrapper(args, errorHandler);
		if(errorHandler.err.IsEmpty()) {
			return;
		} else {
			goto fail;
		}
#endif
	}
%}

#endif

/*
 * NOTE: V8 13+ removed FunctionCallbackInfo<T>::Holder(); use args.This().
 * SWIG 4.4.1 still emits args.Holder() in its built-in templates
 * (javascriptcode.swg, javascriptrun.swg). A C-preprocessor macro shim
 * cannot be used here because V8 headers also declare
 * PropertyCallbackInfo::Holder() which would be wrongly remapped.
 * Instead, regenerate-swig.sh runs `sed` over the generated wrapper to
 * rewrite `args.Holder()` -> `args.This()`. See that script for the full set
 * of V8 API-drift patches it applies.
 */

/*
 * V8 14.5+ (Node 26+) removed the 1-arg overloads of
 * (Get|Set)AlignedPointerInInternalField; the new signature requires a
 * v8::EmbedderDataTypeTag. Older V8 doesn't define EmbedderDataTypeTag at all.
 *
 * regenerate-swig.sh appends `SWIGFOD_EMBEDDER_TAG_ARG` to each affected call
 * site. We define the macro here as either ", v8::EmbedderDataTypeTag(0)"
 * (new V8) or empty (old V8). Using a fixed tag value (0) is safe because the
 * SWIG wrapper is the sole owner of every Set/Get pair.
 *
 * `%insert("begin")` lands at the very top of the generated wrapper, before
 * <v8.h> is pulled in. <v8-version.h> is self-contained and just defines
 * V8_MAJOR_VERSION / V8_MINOR_VERSION, so it is safe to include here.
 */
%insert("begin") %{
#include <v8-version.h>
#if V8_MAJOR_VERSION > 14 || (V8_MAJOR_VERSION == 14 && V8_MINOR_VERSION >= 5)
#define SWIGFOD_EMBEDDER_TAG_ARG , v8::EmbedderDataTypeTag(0)
#else
#define SWIGFOD_EMBEDDER_TAG_ARG
#endif
%}
