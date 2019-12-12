/* ********************************************************************
 * Copyright (C) 2019  51Degrees Mobile Experts Limited.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * ******************************************************************** */

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
    