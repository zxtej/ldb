global.ldbTipNo = function(tip, cell) {
	if (Vars.net.client()) {
		cell.disabled(true);
		cell.tooltip("not on client");
	} else {
		if (!(tip === undefined)) {
			cell.tooltip(tip);
		}
	}
};
require("ldbe/mem");
require("ldbe/proc");
require("ldbe/disp");
