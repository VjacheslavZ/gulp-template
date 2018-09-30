$(".single_range").slider({
    min: 0,
    max: 1000,
    range: false,
    tooltip: 'always',
});

$(".range__multiple").slider({
    class: 'range__multiple',
    min: 0,
    max: 1000,
    range: true,
    value: [0, 1000],
    tooltip_split: true,
    reversed: false,
    tooltip: 'always',
});

let sum = $('.product__sum-price');
let basePrice = parseInt($('.product__base-price .base_price').text());
let configPriceEl = $('.product__config-price .base_price');

let inputs = $('.slider input');
let checkboxes = $('.confBlock-main__options input');

function sortByName(a, b){
    let aName = a.name.toLowerCase();
    let bName = b.name.toLowerCase();
    return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
}
inputs.sort(sortByName); //before handle range__multiple inputs

inputs.on('change', function(e){
    getDataInputs();
});

checkboxes.on('change', function(e){
	getDataInputsBoxes();
});

let cashTotalPrice = parseInt(sum.text());
let cashConfigPrice = 0;

function getDataInputs() {
    let configPrice = 0;
    let rangeInputVal = 0;

	inputs.each(function(i, input){
		let stepPrice = parseInt(
                $(this)
                .closest('.slider')
                .find('.range__title .price')
                .text()
                .replace(/\D/g, ''));

        let inputVal = parseInt(input.value);
        let checkBoxPrice = 0;

        if(input.name === 'range__multiple'){
            let val = $(this).val().split(',');
            let maxVal = $(this).data('slider-max');
            let setMinVal = parseInt(val[0]) || 0;
            let setMaxVal = maxVal - val[1];

            rangeInputVal = (maxVal - (setMinVal + setMaxVal)) * parseInt(stepPrice);
            inputVal = 0;
        }

		configPrice += parseInt((parseInt(inputVal) * parseInt(stepPrice)) + rangeInputVal + checkBoxPrice);
        configPriceEl.text(configPrice);
        sum.text(basePrice + configPrice);

		cashTotalPrice = basePrice + configPrice;
		cashConfigPrice = configPrice;
	})
}

function getDataInputsBoxes() {
	let sumCheckBoxPrice = 0;
	
	checkboxes.each(function (i, input) {
		if(input.type === 'checkbox') {
			if(input.checked) {
				let checkBoxPrice = parseInt(
						$(this)
						.closest('.options-btn, .config__select')
						.find('.config__name span')
						.text()
						.replace(/\D/g, ''));
				sumCheckBoxPrice += checkBoxPrice
			}
		}
	});

	sum.text(cashTotalPrice + sumCheckBoxPrice);
	configPriceEl.text(cashConfigPrice + sumCheckBoxPrice)
}

