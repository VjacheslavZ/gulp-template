"use strict";

$(".single_range").slider({
    min: 0,
    max: 1000,
    range: false,
    tooltip: 'always'
});

$(".range__multiple").slider({
    class: 'range__multiple',
    min: 0,
    max: 1000,
    range: true,
    value: [0, 1000],
    tooltip_split: true,
    reversed: false,
    tooltip: 'always'
});

var sum = $('.product__sum-price');
var basePrice = parseInt($('.product__base-price .base_price').text());
var configPriceEl = $('.product__config-price .base_price');
var inputs = $('.slider input');

function sortByName(a, b) {
    var aName = a.name.toLowerCase();
    var bName = b.name.toLowerCase();
    return aName > bName ? -1 : aName < bName ? 1 : 0;
}
inputs.sort(sortByName); //before handle range__multiple inputs

inputs.on('change', function (e) {
    getDataInputs($(this));
});

function getDataInputs() {
    var configPrice = 0;
    var rangeInputVal = 0;

    inputs.each(function (i, input) {
        var stepPrice = parseInt($(this).closest('.slider').find('.range__title .price').text().replace(/\D/g, ''));

        var inputVal = parseInt(input.value);

        if (input.name === 'range__multiple') {
            var val = $(this).val().split(',');
            var maxVal = $(this).data('slider-max');
            var setMinVal = parseInt(val[0]) || 0;
            var setMaxVal = maxVal - val[1];

            rangeInputVal = (maxVal - (setMinVal + setMaxVal)) * parseInt(stepPrice);
            inputVal = 0;
        }

        configPrice += parseInt(parseInt(inputVal) * parseInt(stepPrice) + rangeInputVal);
        configPriceEl.text(configPrice);
        sum.text(basePrice + configPrice);
    });
}