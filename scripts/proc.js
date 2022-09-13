global.override.block(LogicBlock, {
	updateTile() {
		let prev_enabled = this.enabled;
		this.enabled = this.enabled && !(this.curr_stepwise == this.executor);
		this.super$updateTile();
		this.enabled = prev_enabled;
	},
	buildConfiguration(table) {
		let opened = false; // Whether the collapser is opened
		const buttons = table.table().get(); // Put all buttons in a nested table to fix spacing

		this.super$buildConfiguration(buttons);

		const collapserButton = buttons.button(Icon.downOpen, Styles.cleari, () => {
			opened = !opened;
			collapserButton.style.imageUp = opened ? Icon.upOpen : Icon.downOpen;
		}).size(40).tooltip("vars").get();

		buttons.button(Icon.rotate, Styles.cleari, () => {
			if (Core.input.shift()){
				if (this.executor.vars[0] !== undefined) {
					this.executor.vars[0].numval = 0;
				}
			} else {
				this.updateCode(this.code);
				this.updateLdbVar(collapser);
			}
		}).size(40).center().tooltip("refresh (shift+click for reset counter)");

		const button2 = buttons.button(this.curr_stepwise == this.executor ? Icon.rightOpen : Icon.lockOpen, Styles.cleari, () => {
			if(Core.input.shift()){
				let stepwise = this.curr_stepwise != this.executor;
				this.curr_stepwise = stepwise ? this.executor : null;

				stepwise = this.curr_stepwise == this.executor;
				button2.style.imageUp = stepwise ? Icon.rightOpen : Icon.lockOpen;
				tooltip1.container.visible = stepwise;
				tooltip2.container.visible = !stepwise;
			} else if(this.curr_stepwise == this.executor && this.executor.initialized()){
				this.executor.runOnce();
			}
		}).size(40).center().get();

		const tooltip1 = Tooltip.Tooltips.getInstance().create("step forward (shift+click to unlock)");
		const tooltip2 = Tooltip.Tooltips.getInstance().create("shift+click to lock");
		button2.addListener(tooltip1);
		button2.addListener(tooltip2);
		let stepwise = this.curr_stepwise == this.executor;
		button2.style.imageUp = stepwise ? Icon.rightOpen : Icon.lockOpen;
		tooltip1.container.visible = stepwise;
		tooltip2.container.visible = !stepwise;

		table.row();
		var collapser = null;
		table.collapser(c => {
			collapser = c;
			c.background(Styles.black6).left().margin(10);
			this.updateLdbVar(c);
		}, false, () => opened).top().left().width(300).touchable(() => Touchable.disabled).self(c => c.height(c.get().getChildren().first().getPrefHeight())) // Match inner table's target height, prevent blocking clicks
	},

	updateLdbVar(c) {
		c.clearChildren();
		for (let v of this.executor.vars) {
			// Only show the constant @unit
			if (!v.constant || v.name == "@unit") {
				c.label(this.ldbVarVal(v)).labelAlign(Align.left).fillX();
				c.row();
			}
		}
	},

	ldbVarVal: v => () => {
		if (v.isobj) {
			if (typeof(v.objval) == "string") {
				return v.name + ': "' + v.objval + '"';
			}
			return v.name + ": " + v.objval;
		}

		return v.name + ": " + v.numval;
	},

	curr_stepwise: null
});
