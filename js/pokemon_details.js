var data;
var pokemon_name = "1";
// Declare URL
const api_url = document.URL.substring(document.URL.indexOf('http'))
// Defining async function
async function getapi(url) {
	
	// Storing response
	const response = await fetch(url);
	
	// Storing data in form of JSON
	data = await response.json();
	generate_table(data);
}
getapi(api_url);

$('img').attr('draggable', false);
// Show Image not available icon, If image path is undefined
function imgError(image) {
	image.onerror = "";
	image.src = "image_not_available.jpg";
	return true;
}
// Show selected Pokemon Card Details
async function generate_table(data) {
	var tr, image_path, content1, content2;
	
	var new_weight = JSON.stringify(data.weight);
	var new_height = JSON.stringify(data.height);
	var new_abilities = "";
	$.each(JSON.parse(JSON.stringify(data.abilities)), function(k, v){
		new_abilities += '<span style="margin:3px;">'+JSON.stringify(v.ability.name).replace(/"/g, "")+'</span>';
	});
	
	// Moves
	var poke_moves_array =[];
	$.each(JSON.parse(JSON.stringify(data.moves)), function(k, v){
		poke_moves_array.push(JSON.stringify(v.move.name).replace(/"/g, ""))
	});
	
	// Game Indices
	var poke_indices_array =[];
	$.each(JSON.parse(JSON.stringify(data.game_indices)), function(k, v){
		poke_indices_array.push(JSON.stringify(v.version.name).replace(/"/g, ""))
	});
	
	// Poke Type
	var poke_types = "";
	$.each(JSON.parse(JSON.stringify(data.types)), function(k, v){
		poke_types += '<span>'+JSON.stringify(v.type.name).replace(/"/g, "")+' </span>';
	});
	
	// Base stats
	var poke_stats = "";
	$.each(JSON.parse(JSON.stringify(data.stats)), function(k, v){
		poke_stats += '<div style="margin:3px;">'+JSON.stringify(v.base_stat)+'&nbsp;&nbsp;&nbsp;'+JSON.stringify(v.stat.name).replace(/"/g, "")+'</div>';
	});
	
	// Poke Sprites
	var new_img_path ="";
	$.each(JSON.parse(JSON.stringify(data.sprites.other)), function(k, v) {
	  if( k == 'official-artwork') 
		new_img_path= JSON.stringify(v.front_default).replace(/"/g, "");
	});
	
	$(".poke_image").html('');
	image_path = $('<img src="'+new_img_path+'" class="card-img-top" onerror="imgError(this);" alt="" /><h1 class="text-center">'+data.name+'</h1>');
	image_path.append();
	$(".poke_image").append(image_path);
	
	$(".content1").html('');
	content1 = $('<div style="font-size: 1rem;"><b>Type : </b>'+(poke_types.trim() == "" ? "NA" :"" )+'</h3>'+(poke_types == "" ? "<span>NA</span>" : poke_types)+'</div><div style="font-size: 1rem;"><b>Height : </b>'+(new_height.trim()==""?"NA":new_height)+'</div><div style="font-size: 1rem;"><b>Weight : </b>'+(JSON.stringify(data.weight).trim() == "" ? "NA" : JSON.stringify(data.weight))+'</div><div><h2>Abilities</h2>'+(new_abilities.trim() == "" ? "NA" :"" )+'</h3>'+(new_abilities == "" ? "<h5>NA</h5>" : new_abilities)+'</div><div><h2>Stats</h2>'+(poke_stats.trim() == "" ? "NA" :"" )+'</h3>'+(poke_stats == "" ? "<h5>NA</h5>" : poke_stats)+'</div><div><h2 class="indices_list">Indices</h2><div><div id="indices_list1" style="float:left;width:33%;"></div><div id="indices_list2" style="float:left;width:33%;"></div><div id="indices_list3" style="float:right;width:33%;"></div></div></div>');
	content1.append();
	$(".content1").append(content1);
	
	if(poke_indices_array == "")
		$(".indices_list").hide();
	
	var z = 0;
	$.each(poke_indices_array, function(index, value){
		if(z==0){
			$('#indices_list1').append('<div>'+value+'</div>');
			z=1;
		}else if(z==1){
			$('#indices_list2').append('<div>'+value+'</div>');
			z =2;
		}else {
			$('#indices_list3').append('<div>'+value+'</div>');
			z =0;
		}
	});
	
	$(".content2").html('');
	content2 =$('<div><h2 class="moves_list">Moves</h2><div><div id="list1" style="float:left;width:33%;"></div><div id="list2" style="float:left;width:33%;"></div><div id="list3" style="float:right;width:33%;"></div></div></div>');
	content2.append();
	$(".content2").append(content2);
	
	if(poke_moves_array == "")
		$(".moves_list").hide();
	
	var i =0;
	$.each(poke_moves_array, function(index, value){
		if(i==0){
			$('#list1').append('<div>'+value+'</div>');
			i=1;
		}else if(i==1){
			$('#list2').append('<div>'+value+'</div>');
			i =2;
		}else {
			$('#list3').append('<div>'+value+'</div>');
			i =0;
		}
	});
}
