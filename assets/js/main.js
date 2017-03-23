var PRESIDENTS = [];
var CATEGORIES = [];

function pad(n){
	return (n < 100 ? '0' : '') + (n < 10 ? '0' : '') + n;
};

$.ajax({
	url: './assets/data/rankings.csv',
	dataType: 'text',
	async: false,
	success: function(data){
		data = data.split('\n');
		CATEGORIES = data.shift().split(',');
		CATEGORIES.shift();
		CATEGORIES.pop();
		data.forEach(function(p, rank){
			var comp = p.split(',');
			var comp_1 = comp[0].split(' #');
			var president = {name: comp_1[0], number: comp_1[1], rank: rank+1, total: comp[comp.length-1]};
			comp.shift();
			CATEGORIES.forEach(function(c, i){ president[c] = comp[i]; });
			PRESIDENTS.push(president);
		});
	}
});

function hash_url(val){
	if(val) window.location.hash = val;
	if(!window.location.hash) return false;
	return window.location.hash.substring(1);
};

function hash_clear(){
	window.location.hash = '';
};

function hash_load(){
	var hash = hash_url();
	if(hash <= PRESIDENTS.length && hash >= 1) load_president(hash);
	else load_all_presidents();
};

function load_all_presidents(){
	$("#content").html(
		PRESIDENTS.map(function(president){
			return '<div class="col-xs-12 col-sm-6 col-md-4 shell">'+
				'<div onclick="hash_url('+president.rank+');" '+
						'class="president" style="background-image:url(./assets/portraits/'+pad(president.number)+'.jpg);">'+
					'<div class="rank">'+president.rank+'</div>'+
					'<div class="name"><span class="number">#'+president.number+'</span>'+president.name+'</div>'+
				'</div>'+
			'</div>'
		}).join('')
	);
};

function load_president(rank){
	var president = PRESIDENTS.filter(function(p){ return p.rank == rank; })[0];
	if(president){
		$("#content").html(
			'<div class="col-xs-12 col-md-6 shell profile">'+
				'<table class="totals">'+
					'<tr><td class="rank"><table><tr><td>'+president.rank+'</td></tr></table></td></tr>'+
					'<tr><td class="name"><span class="number">#'+president.number+'</span>'+president.name+'<hr></td></tr>'+
					'<tr><td class="total"><table><tr><td>'+president.total+'</td></tr></table></td></tr>'+
				'</table>'+
			'</div>'+
			'<div class="col-xs-12 col-md-6 shell profile">'+
				'<div class="president" style="background-image:url(./assets/portraits/'+pad(president.number)+'.jpg);">'+
				'</div>'+
			'</div>'+
			'<div class="col-xs-12 shell profile">'+
				CATEGORIES.map(function(c){ 
					var score = president[c] || '-';
					var cls = (score > 7 || ['Death in Office', 'Impeachment in Office'].indexOf(c) != -1 ? 'good' : 'bad');
					return '<div class="col-xs-12 col-sm-6 col-md-3 category-container"><div class="category '+cls+'">'+c+'<hr><div class="score">'+score+'</div></div></div>';
				}).join('')+
			'</div>'
		);
	}
};

window.onhashchange = hash_load;
window.onload       = hash_load;