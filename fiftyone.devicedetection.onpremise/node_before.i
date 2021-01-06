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
 */
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
