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

%include std_string.i

/*
 * Override the methods inherited from map<string, string>. This is required
 * as SWIG casts EvidenceBase to a map<string, string> when calling, resulting
 * in an exception.
 */
%extend EvidenceBase {
    void set(const std::string &key, const std::string &value) {
         $self->operator[](key) = value;
    }
    const std::string& get(const std::string &key) {
        return $self->operator[](key);
    }
    int size() {
        return $self->size();
    }
};
    