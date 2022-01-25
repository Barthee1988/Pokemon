

	// Function to set JSON value in seperate ArrayList
	async function gererate_main_json(datax){
		all_records= [];
		for (var i = 0; i < datax.results.length; i++) {
			const response = await fetch(datax.results[i].url);
			var datas = await response.json();
			
			var new_weight = JSON.stringify(datas.weight);
			var new_height = JSON.stringify(datas.height);
			var new_abilities = "";
			$.each(JSON.parse(JSON.stringify(datas.abilities)), function(k, v){
				if(new_abilities == "")
				new_abilities += JSON.stringify(v.ability.name).replace(/"/g, "");
				else
				new_abilities += ', '+JSON.stringify(v.ability.name).replace(/"/g, "");
			});
			var new_img_path ="";
			$.each(JSON.parse(JSON.stringify(datas.sprites.other)), function(k, v) {
			  if( k == 'official-artwork') 
			  new_img_path= JSON.stringify(v.front_default).replace(/"/g, "");
			});
			all_records.push(
				{id: i, name: datas.name, height: (new_height.trim()==""?0:new_height),weight :(new_weight.trim()==""?0:new_weight),abilities :(new_abilities == "" ? "NA" : new_abilities),image_path : new_img_path, api_url : datax.results[i].url}
			);
		}
		main_all_records = all_records;
		apply_pagination();
	}
	// Function to get Image not available icon.
	function imgError(image) {
		image.onerror = "";
		image.src = "img/image_not_available.jpg";
		return true;
	}
	// Generate Card View
	var isEmpty;
	async function generate_table() {
		var tr;
		$('#pokeman').html("");
		for (var i = 0; i < displayRecords.length; i++) {
			tr = $('<div class="column" data-count = "'+i+'" data-name="'+displayRecords[i].name+'"  data-height="'+(displayRecords[i].height.trim()==""?0:displayRecords[i].height)+'"  data-weight ="'+(displayRecords[i].weight.trim()==""?0:displayRecords[i].weight)+'">');
			tr.append('<div class="card"><a href="pokemon_details.html?api_url='+displayRecords[i].api_url+'"><img href="pokemon_details.html?orderid='+i+'" src="'+displayRecords[i].image_path+'" class="card-img-top" onerror="imgError(this);" alt="" /></a>'+
				'<div><strong class ="name">'+displayRecords[i].name+'</strong></div>'+
				'<div class="row">'+
					'<div class="col-sm-6 division">Height<br><strong>'+(displayRecords[i].height.trim()==""?0:displayRecords[i].height)+'</strong></div>'+
					'<div class="col-sm-6 division">Weight<br><strong>'+(displayRecords[i].weight.trim() == "" ? 0 : displayRecords[i].weight)+'</strong></div>'+
					'<div class="col-sm-12 division">Abilities<br><strong>'+(displayRecords[i].abilities == "" ? "<span>NA</span>" : displayRecords[i].abilities)+'</strong></div>'+
				'</div>'+
				'</div></div><br>');
			$('#pokeman').append(tr);
		}
	}
	// Function to reset the no. of entries to be show in page view.
	function changecardcount()
	{
		recPerPage = $("#card_length_show").val();
		totalPages = Math.ceil(totalRecords / recPerPage);
		$('.pagination').removeData("twbs-pagination");
		$('#pokeman').html("");
		apply_pagination();
	}
	// Function to set Pagination
	function apply_pagination(x) 
	{
		$pagination.twbsPagination({
			totalPages: Math.ceil(all_records.length / $("#card_length_show").val()),
			visiblePages: 5,
			onPageClick: function (event, page) {
				displayRecordsIndex = Math.max(page - 1, 0) * parseInt($('#card_length_show').val());
				endRec = (displayRecordsIndex) + parseInt($('#card_length_show').val());
				var json_data = all_records;
				displayRecords = json_data.slice(displayRecordsIndex, endRec);
				generate_table();
				$(".show-top").show();
			}
		});
	}
	// Function to sort the JSON file
	function sortJSON(arr, key,way) 
	{
		return arr.sort(function(a, b) {
			var x = a[key]; var y = b[key];
			if (way === '123') { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
		 });
	}
	// Function to Sort Ascending Order Using Name, Height & Weight.
	async function changecardsort()
	{
		all_records = main_all_records;
		if($("#myInput").val() !=""){
			var data_filter = await all_records.filter( element => (element.name.indexOf($("#myInput").val()) != -1 | element.abilities.indexOf($("#myInput").val()) != -1))
			all_records = data_filter;
		}
		if($("#card_sort_show").val() == "Name"){
			all_records = await sortJSON(all_records,'name','123')
		}else if($("#card_sort_show").val() == "Height"){
			all_records = await sortJSON(all_records,'height','123')
		}else if($("#card_sort_show").val() == "Weight"){
			all_records = await sortJSON(all_records,'weight','123')
		}else if($("#card_sort_show").val() == "Default"){
			all_records = await sortJSON(all_records,'id','123')
		}
		$('.pagination').removeData("twbs-pagination");
		$('#pokeman').html("");
		apply_pagination();
	}
	// Search Function
	async function getFilter(){
		all_records =main_all_records;
		all_records = await sortJSON(all_records,$("#card_sort_show").val(),'123')
		var data_filter = await all_records.filter( element => (element.name.indexOf($("#myInput").val()) != -1 | element.abilities.indexOf($("#myInput").val()) != -1))
		all_records = data_filter;
		$('.pagination').removeData("twbs-pagination");
		$('#pokeman').html("");
		apply_pagination();
	}
	 window.onload = function(){
		 setTimeout(function(){
			 var loader = document.getElementsByClassName("loader-wrapper")[0];
			 loader.style.display = "none";
		 },60000)
	 }
