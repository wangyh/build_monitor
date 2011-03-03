var tableView = function($){
	var green = "background: -moz-linear-gradient(100% 100% 90deg, #0e0, #090); background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#090), to(#0e0));"
	var yellow = "background: -moz-linear-gradient(100% 100% 90deg, #ee0, #990); background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#990), to(#ee0));"
	var red = "background: -moz-linear-gradient(100% 100% 90deg, #e00, #900);background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#900), to(#e00));"
	function removeDom() {
		$('#status').remove();	
	}
	
	function createDom(data){
		var dom = $('<table id="status" style="color:#333; width="100%" cellpadding="5" />');
		var caption = $('<h2>').html(data.name);
		$('<caption>').append(caption).appendTo(dom);
		data.projects.eachProject(function(item){
			var row = $('<tr/>');
			$('<td>').html(item.name).appendTo(row);
			var color = item.isBuilding() ? yellow : 
						item.isSuccessful() ? green : 
						red;
			row.attr('style', color);
			row.appendTo(dom);
		});
		dom.appendTo($('body'));	
	}
	
	return function(){
		return function(data){
				removeDom();
				createDom(data);
			}
		};
}(jQuery);