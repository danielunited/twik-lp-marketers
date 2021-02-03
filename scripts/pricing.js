const features = {
	domains: {
		name: 'Domains',
		item: 'domains',
		desc: 'First domain free',
		rangeMin: 0,
		rangeMax: 100,
		free: 1,
		price: 20,
		per: ' / domain',
		count: 1,
		total: 0,
		tooltip: 'More than one domain will allow connection between your projects in one account (Such as monitoring and sharing content from one domain to another).'
	},
	recording_pageviews: {
		name: 'Business Intelligence',
		item: 'pageviews',
		desc: 'First 10k pageviews free',
		rangeMin: 0,
		rangeMax: 1000000,
		free: 10000,
		price: 0,
		per: ' / pageview',
		count: 10000,
		total: 0,
		relyOn: ['personalization'],
		tooltip: 'This allows you to record traffic on your website. every KPI that can help you increase CRO, This information is critical to help you review site performance and analyze the visitor journey.'
	},
	personalization: {
		name: 'AI Personalization\n',
		item: 'session',
		desc: 'First 5k pageviews free',
		rangeMin: 0,
		rangeMax: 1000000,
		free: 2000,
		price: 0.01,
		count: 5000,
		total: 0,
		dependsOn: ['recording_pageviews'],
		tooltip: 'Twik delivers AI-based personalized content to enhance user experience and increase engagement.'
	},
	dynamic_variants: {
		name: 'Live Content',
		item: 'scrapers',
		desc: 'First dynamic variant free',
		rangeMin: 0,
		rangeMax: 100,
		free: 1,
		price: 10,
		per: ' / dynamic variant',
		count: 1,
		total: 0,
		tooltip: 'A live piece of content that changes in real-time. This can be an element from another page on your website or from another domain.'
	},
};

function pricingTotal() {
	let total = 0;
	Object.keys(features).forEach(feature => {
		if (feature === 'pixel_queries' && features['pixel_queries'].disabled) {
		} else {
			total += features[feature].total
		}
	});
	$('#pricing_total').text(numeral(total).format('($0.0a)'))
}

function updateFeature(id, progress, count, _total) {
	const total = count * features[id].price - (features[id].free * features[id].price);
	$(`#${id}_progress`).width(progress + '%');
	$(`#${id}_progress`).removeClass(total === 0 ? 'blue' : 'green');
	$(`#${id}_progress`).addClass(total === 0 ? 'green' : 'blue');
	const n = numeral(total).format(total < 1000 ? '($0a)' : '($0.00a)');
	$(`#${id}_count`).text(numeral(count).format('0a'));
	$(`#${id}_total`).text(total === 0 ? (features[id].free > 0 ? 'Free' : n) : n);
	$(`#${id}_total`).removeClass('green blue');
	$(`#${id}_total`).addClass(total === 0 ? (features[id].free > 0 ? 'green' : '') : 'blue');
	$(`#${id} .price-switch`).removeClass('green blue');
	$(`#${id} .price-switch`).addClass(total === 0 ? (features[id].free > 0 ? 'green' : '') : 'blue');
	features[id].count = count;
	features[id].total = total;
}

function applyFeature(container, f, isLast = false) {
	const id = f;
	const feature = features[f];
	container.append(`
        <div class="pricing-block ${feature.disabled ? 'disabled' : ''} ${isLast ? 'last' : ''}" id="${id}">
            <div class="row">
                <div class="col-8 col-xxl-10 feature-col">
                    <div class="row">
                        <div class="col">
                            <h5>
		                        <span>${feature.name} <span class="twik-tooltip-container"><span class="feature-info twik-tooltip-trigger">?</span><span class="twik-tooltip"><span>${feature.tooltip}</span></span></span></span>
		                    </h5>
                            <p class="per"><small>¢1 / ${feature.item}</small></p>
		                    <div class="range-slider-wrapper">
				                ${feature.free > 0 ? '<div class="range-slider-prefix"><div></div></div>' : ''}
				                <div class="range-slider-container" id="${id}_slider">
				                    <div class="range-slider">
				                        <div class="range-slider-progress ${feature.total === 0 ? 'green' : ''}" id="${id}_progress"
				                             style="width: 0">
				                            <div class="range-slider-cursor">
				                                <span></span>
				                            </div>
				                        </div>
				                        <div class="range-slider-track"></div>
				                    </div>
				                </div>
				            </div>
						</div>
					</div>
                </div>
                <div class="col-3 col-xxl-2 align-center price-col">
                    <p class="p3"><span id="${id}_count">${numeral(feature.free).format('0a')}</span></p>
                    <p><small>TARGETED ${feature.item.toUpperCase() + 'S'}</small></p>
                    <p class="price-switch ${features[id].total === 0 ? (features[id].free > 0 ? 'green' : '') : 'blue'}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="103.53" height="89.66" viewBox="0 0 103.53 89.66">
  <path id="Polygon_9" data-name="Polygon 9" d="M3094.34,1651.43l-25.88,44.83h-51.77l-25.88-44.83,25.88-44.83h51.77Z" transform="translate(-2990.81 -1606.59)"/>
</svg>

                        <span class="price-text" id="${id}_total"></span>
					</p>
				</div>
				<div class="col-2"></div>
            </div>
        </div>
        `)
	const progress = feature.free * 100 / feature.rangeMax;
	const count = Math.round(progress * feature.rangeMax / 100);
	const total = count * feature.price - (feature.free * feature.price);
	const n = numeral(total).format('($0.0a)');
	$(`#${id}_progress`).width(progress + '%');
	$(`#${id}_total`).text(total === 0 ? (feature.free > 0 ? 'Free' : n) : n);

	function onMouseMove(e) {
		onSliderMove(e, $(`#${id}_slider`))
	}

	$('body')
		.on('mousedown', `#${id}_slider`, function () {
			$('body').on('mousemove', onMouseMove)
		})
		.on('touchstart', `#${id}_slider`, function () {
			$('body').on('touchmove', onMouseMove)
		})
		.on('mouseup', function () {
			$('body').unbind('mousemove', onMouseMove)
		})
		.on('touchend', `#${id}_slider`, function () {
			$('body').unbind('touchmove', onMouseMove)
		});
	$('#customer_success').change(function () {
		if (this.checked) {
			updateFeature('customer_support', null, 1, features['customer_support'].price);
			$('#customer_success_wrapper').addClass('checked');
			features['pixel_queries'].disabled = false;
			$('#pixel_queries_slider').parents('.pricing-block').removeClass('disabled');
			$('#customer_success_count').text(1)
		} else {
			updateFeature('customer_support', null, 0, 0);
			$('#customer_success_wrapper').removeClass('checked');
			features['pixel_queries'].disabled = true;
			$('#pixel_queries_slider').parents('.pricing-block').addClass('disabled');
			$('#customer_success_count').text(0)
		}
		pricingTotal()
	});

	function onSliderMove(e, el) {
		if (feature.disabled) return;
		const rangeMin = feature.rangeMin;
		const rangeMax = feature.rangeMax;
		const pageX = e.pageX || e.changedTouches[0].pageX;
		const pos = Math.round((pageX) - el.offset().left);
		const percentage = Math.ceil(100 / el.width() * pos);
		const min = feature.free * 100 / rangeMax;
		const progress = Math.min(Math.max(min, percentage), 100);
		const count = Math.round(progress * rangeMax / 100);
		const total = count * feature.price - (feature.free * feature.price);
		updateFeature(id, progress, count, total);
		if (feature.dependsOn) {
			feature.dependsOn.forEach(_feature => {
				if (features[id].count > features[_feature].count) {
					updateFeature(_feature, progress, count, total)
				}
			})
		}
		if (feature.relyOn) {
			feature.relyOn.forEach(_feature => {
				if (features[id].count < features[_feature].count) {
					updateFeature(_feature, progress, count, total)
				}
			})
		}
		pricingTotal()
	}
}

$(document).ready(function () {
	const firstItems = [
		'personalization'
	];
	firstItems.forEach((feature, i) => {
		const isLast = i === firstItems.length - 1;
		applyFeature($('#features'), feature, isLast)
	});
	//applyFeature($('#pixel_query_container'), 'pixel_queries', true);
	$('#pricing_total').text(numeral(0).format('($0.0a)'))
});

$(document).ready(function () {
	$('body')
		.on('mouseenter', '.twik-tooltip-trigger', function () {
			$(this).siblings('.twik-tooltip').addClass('in')
		})
		.on('touchstart', '.twik-tooltip-trigger', function () {
			$(this).siblings('.twik-tooltip').addClass('in')
		})
		.on('touchstart', '.twik-tooltip', function () {
			$(this).removeClass('in')
		})
		.on('mouseleave', '.twik-tooltip-trigger', function () {
			$(this).siblings('.twik-tooltip').removeClass('in')
		})
});
