steal("can/util", "can/map", function(can){

	function sortedSetJson(set){
		if(set == null) {
			return set
		} else {
			var sorted = {};

			var keys = [];
			for(var k in set){
				keys.push(k);
			}
			can.each(keys, function(prop){
				sorted[prop] = set[prop];
			});
			return JSON.stringify(sorted);
		}
	}

	can.AppState = can.Map.extend({
		setup: function(){
			can.Map.prototype.setup.apply(this, arguments);
			this.__readyPromises = [];
			this.__pageData = {};
		},
		waitFor: function(promise){
			this.__readyPromises.push(promise);
			return promise;
		},
		pageData: function(key, set, inst){
			var appState = this;

			function store(data){
				var keyData = appState.__pageData[key];
				if(!keyData) keyData = appState.__pageData[key] = {};

				keyData[sortedSetJson(set)] = typeof data.serialize === "function" ?
					data.serialize() : data;
			}

			if(can.isDeferred(inst)){
				this.waitFor(inst);
				inst.then(function(data){
					store(data);
				});
			} else {
				store(inst);
			}

			return inst;
		}
	});

	return can.AppState;

});