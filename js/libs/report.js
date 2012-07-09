$(document).ready(function(){ 
	//enabled product on focus
	$('.product').focus(function(){
		$(this).siblings().find('.product-enable').prop("checked", true).prop('disabled', false);
	});
	
	//disable on blur without valid data
	$('.product').blur(function(){
		if(!$(this).val()){
			$(this).siblings().find('.product-enable').prop("checked", false).prop('disabled', true);
		}
	});
	
	//clear field when unchecking enable, and disallow checking 
	$('.product-enable').change(function(){
		if(!$(this).prop("checked")){
			$(this).closest('div').find('.product').val(null);
			$(this).prop('disabled', true);
		}
	});
	
	$('.date').datepicker();
});