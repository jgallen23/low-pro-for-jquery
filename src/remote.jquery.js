(function($) {

	Remote = $.klass({
		initialize: function(options) {
			if (this.element.attr('nodeName') == 'FORM') this.element.attach(Remote.Form, options);
			else this.element.attach(Remote.Link, options);
		}
	});

	Remote.Base = $.klass({
		initialize : function(options) {
			this.options = options;
		},
		_makeRequest : function(options) {
			$.ajax(options);
			return false;
		}
	});

	Remote.Link = $.klass(Remote.Base, {
		onclick: function() {
			var options = $.extend({ 
				url: this.element.attr('href'), 
				type: 'GET' 
			}, this.options);
			return this._makeRequest(options);
		}
	});

	Remote.Form = $.klass(Remote.Base, {
		onclick: function(e) {
			var target = e.target;

			if ($.inArray(target.nodeName.toLowerCase(), ['input', 'button']) >= 0 && target.type.match(/submit|image/))
				this._submitButton = target;
		},
		onsubmit: function() {
			var data = this.element.serializeArray();

			if (this._submitButton) data.push({ name: this._submitButton.name, value: this._submitButton.value });

			var options = $.extend({
				url : this.element.attr('action'),
				type : this.element.attr('method') || 'GET',
				data : data
			}, this.options);

			this._makeRequest(options);

			return false;
		}
	});

	$.ajaxSetup({
		beforeSend: function(xhr) {
			if (!this.dataType)
				xhr.setRequestHeader("Accept", "text/javascript, text/html, application/xml, text/xml, */*");
		}
	});

})(jQuery);
