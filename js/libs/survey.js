var survey = {};
var ui = {
		select : function(event){
			alert('delected');
      $(this).parent().toggleClass("selected");
			event.preventDefault();			
		},
		yesno : function(event){
			$(this).parents('li').siblings().removeClass('selected');
		},
		outofstock : function(event){
			//don't popup yes/no when de-selecting
		    if($(this).parents('.out-of-stock').hasClass('selected')){
          //but remove those clases
          $(this).parents('.out-of-stock').removeClass('no');
          $(this).parents('.out-of-stock').removeClass('yes');
          return;
		    }
			$(this).parent().append('<div class="backstock"><h1>Is there backstock?</h1><ul><li><a class="yes-btn" href="#">Yes</a></li><li><a class="no-btn" href="#">No</a></li></ul></div>');
		},
		backstock : function(event){
			//track yes/no status using a class
			if($(this).hasClass('yes-btn')){
		        $(this).parents('.out-of-stock').removeClass('no');
		        $(this).parents('.out-of-stock').addClass('yes');
		    } else {
		        $(this).parents('.out-of-stock').removeClass('yes');
		        $(this).parents('.out-of-stock').addClass('no');
		    }            
			$(".backstock").fadeOut();
			event.preventDefault();			
		}
	};
$(document).ready(function(){
	
	
	survey = {
		json : function(){
			//get SKUs
			var output = {};
			output['sku'] = {};
			$('#grp-sku .data-block').each(function(){
				//current section
				var section = $(this).attr('id');
				section = section.replace('-instock', '');
				//section will be an array of values
				output['sku'][section] = new Array();
				$(this).find('li.selected a.option-btn').each(function(){
					//the button that contains the option value
					var button = $(this);
					switch(section){
						//these three are essentially the same
						case '330ml':
						case '500ml':
						case 'one-liter':
							//loop through possible options (matching class)
							$.each(['pure', 'pineapple', 'acai-pom', 'peach-mango', 'tangerine', 'tropical-fruit'], function(index, value){
								if(button.hasClass(value)){
									output['sku'][section].push(value);
								}
							});
							break;
						//this varies to size, not flavor
						case 'multipacks':
							//loop through possible options (matching class)
							$.each(['1L', '500ml'], function(index, value){
								if(button.hasClass(value)){
									output['sku'][section].push(value);
								}
							});
							break;
					}
				})
			});
			
			//get out of stock SKUs
			//TODO: reuse the SKU code
			output['oos'] = {};
			$('#grp-oos .data-block').each(function(){
				//current section
				var section = $(this).attr('id');
				section = section.replace('oos-', '');
				section = section.replace('-outstock', '');
				//section will be an array of values
				output['oos'][section] = new Array();
				$(this).find('li.selected a.option-btn').each(function(){
					//the button that contains the option value
					var button = $(this);
					switch(section){
						//these three are essentially the same
						case '330ml':
						case '500ml':
						case 'one-liter':
							//loop through possible options (matching class)
							$.each(['pure', 'pineapple', 'acai-pom', 'peach-mango', 'tangerine', 'tropical-fruit'], function(index, value){
								if(button.hasClass(value)){
									//the only real change from the sku code
									if(button.hasClass('yes')){
										var backstock = true;
									} else {
										var backstock = false;
									}
									output['oos'][section].push({'sku': value, 'backstock': backstock});
								}
							});
							break;
						//this varies to size, not flavor
						case 'multipacks':
							//loop through possible options (matching class)
							$.each(['1L', '500ml'], function(index, value){
								if(button.hasClass(value)){
									//the only real change from the sku code
									if(button.hasClass('yes')){
										var backstock = true;
									} else {
										var backstock = false;
									}
									output['oos'][section].push({'sku': value, 'backstock': backstock});
								}
							});
							break;
					}
				})
			});				
			
			//promo data
			output['promo'] = {};
			$('#grp-promo .data-block').each(function(){
				//current section
				var section = $(this).attr('id');
				//section will be an array of values
				switch(section){
					case 'promo-display':
					case 'promoted-skus':
					case 'oos-out-of-code':
					case 'product-available-cold':
						if($(this).find('li.selected a.yes').length == 1){
							output['promo'][section] = true;
						} else if($(this).find('li.selected a.no').length == 1) {
							output['promo'][section] = false;
						} else {
							output['promo'][section] = null;
						}
						break;
					case 'warm-touch-points':
					case 'points-of-distro':
						output['promo'][section] = +$(this).find('input').val();
						break;
					case 'visible-equipment':
						output['promo'][section] = new Array();
						$(this).find('li.selected a.option-btn').each(function(){
							var button = $(this);
							//loop through possible options (matching class)
							$.each(['rack', 'case', 'cube', 'wing', 'end', 'cooler', 'hydrocap'], function(index, value){
								if(button.hasClass(value)){
									output['promo'][section].push(value);
								}
							});
						});
						
						break;
				}
			});
			
			//price info
			output['price'] = {};
			$('#grp-price .data-block').each(function(){
				//current section
				var section = $(this).attr('id');
				section = section.replace('pricing-', '');
				output['price'][section] = null;
				$(this).find('li.selected a.option-btn').each(function(){
					var button = $(this);
					//loop through possible options (matching class)
					$.each(['under', 'over', 'correct', 'yes', 'no'], function(index, value){
						if(button.hasClass(value)){
							if('yes' == value){
								value = true;
							} else if('no' == value){
								value = false;
							}
							output['price'][section] = value;
						}
					});
				});
			});
			
			//competitor info
			//price info
			output['competitor'] = {};
			$('#grp-competitor .data-block').each(function(){
				//current section
				var section = $(this).attr('id');
				section = section.split('-');
				switch(section[0]){
					case 'zico':
					case 'naked':
					case 'one':
						if(!output['competitor'][section[0]]){
							output['competitor'][section[0]] = {};
						}
						switch(section[1]){
							case 'facings':
								output['competitor'][section[0]]['facings'] = +$(this).find('input').val();
								break;
							case 'displays':
								section[2] = 'displays';
							case 'pricing':
								output['competitor'][section[0]][section[2]] = null;
								$(this).find('li.selected a.option-btn').each(function(){
									var button = $(this);
									//loop through possible options (matching class)
									$.each(['under', 'over', 'correct', 'yes', 'no'], function(index, value){
										if(button.hasClass(value)){
											if('yes' == value){
												value = true;
											} else if('no' == value){
												value = false;
											}												
											output['competitor'][section[0]][section[2]] = value;
										}
									});
								});
								break;
						}
						break;
					case 'others':
						if(!output['competitor'][section[0]]){
							output['competitor'][section[0]] = {};
						}
						
						switch(section[1]){
							case 'facings':
								output['competitor'][section[0]]['facings'] = +$(this).find('input').val();
								break;
							case 'brands':
								output['competitor'][section[0]]['brands'] = new Array();
								$(this).find('li.selected a.option-btn').each(function(){
									var button = $(this);
									//loop through possible options (matching class)
									$.each(['cocozona', 'nirvana', 'c20', 'monkey', 'amybrian', 'graces', 'harvestbay', 'goya'], function(index, value){
										if(button.hasClass(value)){
											if('yes' == value){
												value = true;
											} else if('no' == value){
												value = false;
											}												
											output['competitor'][section[0]]['brands'].push(value);
										}
									});
								});
								break;
						}
						break;
				}
			});
			return output;
		}
	};
	
	$('#survey-submit a').live('click', function(event){
		event.preventDefault();
		
		if(!$('#store').val()){
			alert('Please select an Account.');
			return;
		}
		
		var data = survey.json();
		data['store'] = $('#store').val();

    var hs = window.HSAjax;
    hs.ajax(hs.AppConfig.baseURL('surveys'), {
      headers: {
        'Authorization': hs.basicAuth()
      },
      type: 'post',
      data: data,
      success: function(data) {
        $(".view-content > *").hide();
        $("#confirm").show();
      }
    });
	});
		
	$('#visit-submit a').live('click', function(event){
		event.preventDefault();
		if(!$('#store').val()){
			alert('Please select an Account.');
			return;
		}
		
		var data = {};
		data.store = $('#store').val();
		data.pos = [];
		$('.select-hard-pos ul li a').each(function(index, element){
			if($(element).hasClass('selected')){
				data.pos.push($(element).attr('title'));
			}
		});
		
		data.message = $('#visit-description').val();
		data.order = ('checked' == $('#order-taken').attr('checked'));
		data.attention = ('checked' == $('#needs-distributor-attention').attr('checked'));
		data.type = 'visit';
		
		var hs = window.HSAjax;
    hs.ajax(hs.AppConfig.baseURL('surveys'), {
      headers: {
        'Authorization': hs.basicAuth()
      },
      type: 'post',
      data: data,
      success: function(data) {
        $(".view-content > *").hide();
        $("#confirm").show();
      }
    });
	});	
	
});

$(document).ready(function(){
	var loading = "<div class='loader'></div>";
	var surveys = "surveys.html";

	

	$(".navbar-btn.left").css("visibility","visible");
	$(".cancel-survey a").html("Cancel");
	$(".navbar-btn.right").css("visibility","hidden");

	$(".cancel-survey").click(function(){ 
		$("#view-pane").html(loading).load(surveys); 
	});


	//Yes-No
	$(".option-btn.yes, .option-btn.no, .option-btn.under, .option-btn.correct, .option-btn.over, .option-btn.na").live("click", function(){
		$(this).parents('li').siblings().removeClass('selected');
	});


	// Backstock Question on Out of Stock Items

	$(".out-of-stock .option-btn, this").live("click", function(){
		//don't popup yes/no when de-selecting
	console.log(this);	
	    if($(this).parents('.out-of-stock').hasClass('selected')){
	    	//but remove those clases
	        $(this).parents('.out-of-stock').removeClass('no');
	        $(this).parents('.out-of-stock').removeClass('yes');
	        return;
	    }
		$(this).parent().append('<div class="backstock"><h1>Is there backstock?</h1><ul><li><a class="yes-btn" href="#">Yes</a></li><li><a class="no-btn" href="#">No</a></li></ul></div>');
	});

	$(".backstock .yes-btn, .backstock .no-btn").live("click", function(){
		//track yes/no status using a class
		if($(this).hasClass('yes-btn')){
	        $(this).parents('.out-of-stock').removeClass('no');
	        $(this).parents('.out-of-stock').addClass('yes');
	    } else {
	        $(this).parents('.out-of-stock').removeClass('yes');
	        $(this).parents('.out-of-stock').addClass('no');
	    }            
		$(".backstock").fadeOut();
		event.preventDefault();
	});

	$('.backstock:visible').click(function(event){
		event.stopPropagation();
	});

	$('html').click(function(){
		$(".backstock:visible").fadeOut();
	});
	 

	// Quantity Inputs & Triggers

	$(".pos-input").prepend('<div class="dec button">-</div>');
	$(".pos-input").append('<div class="inc button">+</div>');

	$(".button").live('click', function() {
		var $button = $(this);
		var oldValue = $button.parent().find("input").val();
		var newVal = oldValue;
		if ($button.text() == "+") {
			var newVal = parseInt(oldValue) + 1;
			// AJAX save would go here
		} else {
			if (oldValue >= 1) {
				var newVal = parseInt(oldValue) - 1;
			}
		}
	    $button.parent().find("input").val(newVal);
	});	


	var viewscrollposition = $(".view-content").scrollTop()+"px"; 

	$('.test-scroll-count').html(viewscrollposition);

	//Option List Toggles
	$('.option-list .option-btn, .option-list-wide .option-btn-wide').live("click", function(e){
		$(this).parent().toggleClass("selected");
		event.preventDefault();
	});

	//make touch events work
	$('.option-list .option-btn, .option-list-wide .option-btn-wide').each(function(index, element){
		new NoClickDelay(element);
	});

	$('.button').each(function(index, element){
		new NoClickDelay(element);
	});
});

