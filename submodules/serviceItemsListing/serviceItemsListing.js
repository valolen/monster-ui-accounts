define(function(require) {
	var $ = require('jquery'),
		_ = require('lodash'),
		monster = require('monster');

	var serviceItemsListing = {

		/**
		 * Renders a service items listing
		 * @param  {Object} args
		 * @param  {jQuery} args.container  Element that will contain the listing
		 * @param  {String[]} args.planIds  Array of plan IDs to be used to generate the listing
		 * @param  {Function} [args.success]  Optional success callback
		 * @param  {Function} [args.error]  Optional error callback
		 */
		serviceItemsListingRender: function(args) {
			var self = this,
				planIds = args.planIds,
				$container = args.container,
				initTemplate = function(data) {
					var $template = $(self.getTemplate({
						name: 'layout',
						data: {
						},
						submodule: 'serviceItemsListing'
					}));

					console.log(data);

					return $template;
				};

			// An array of functions is used instead of an object, because they need to be
			// executed in an ordered manner
			monster.series([
				function(seriesCallback) {
					monster.ui.insertTemplate($container, function(insertTemplateCallback) {
						seriesCallback(null, insertTemplateCallback);
					});
				},
				function(seriesCallback) {
					self.serviceItemsListingRequestServiceQuote({
						planIds: planIds,
						success: function(listing) {
							seriesCallback(null, listing);
						}
					});
				}
			], function(err, results) {
				if (err) {
					return;
				}

				var insertTemplateCallback = results[0],
					data = _.get(results, 1);

				insertTemplateCallback(initTemplate(data));
			});
		},

		/**
		 * Request the aggregate or "quote" for a set of plans
		 * @param  {Object} args
		 * @param  {String[]} args.planIds  List of plans to be included for the quote
		 * @param  {Function} args.success  Success callback
		 * @param  {Function} [args.error]  Optional error callback
		 */
		serviceItemsListingRequestServiceQuote: function(args) {
			var self = this;

			self.callApi({
				resource: 'services.quote',
				data: {
					accountId: self.accountId,
					data: {
						plans: args.planIds
					}
				},
				success: function(data) {
					args.success(data.data);
				},
				error: function(parsedError) {
					_.has(args, 'error') && args.error(parsedError);
				}
			});
		}
	};

	return serviceItemsListing;
});
