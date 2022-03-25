global.override.block(LogicBlock, {
	updateTile() {
		let prev_enabled = this.enabled;
		this.enabled = this.enabled && !(this.curr_stepwise == this.executor);
		this.super$updateTile();
		this.enabled = prev_enabled;
	},
	buildConfiguration(table) {
		this.super$buildConfiguration(table);
		// Remove long black bar due to collapser
		table.background(null);

		const editBtn = table.cells.get(0).get();
		table.clearChildren();

		table.table(null, table => {
			table.add(editBtn).size(40);

			const button = table.button(Icon.downOpen, Styles.clearTransi, () => {
				this.ldbCollapser.toggle();
				button.style.imageUp = this.ldbCollapser.collapsed ? Icon.downOpen : Icon.upOpen;
			}).size(40).center().tooltip("vars").get();

			table.button(Icon.rotate, Styles.clearTransi, () => {
				if (Core.input.shift()){
					if (this.executor.vars[0] !== undefined) {
						this.executor.vars[0].numval = 0;
					}
				} else {
					this.updateCode(this.code);
					let collapsed = this.ldbCollapser.isCollapsed();
					this.ldbBuildVariables();
					cell.setElement(this.ldbCollapser).get().setCollapsed(collapsed);
				}	
			}).size(40).center().tooltip("refresh (shift+click for reset counter)");
			
			const button2 = table.button(this.curr_stepwise == this.executor ? Icon.rightOpen : Icon.lockOpen, Styles.clearTransi, () => {
				if(Core.input.shift()){
					let stepwise = this.curr_stepwise != this.executor;
					this.curr_stepwise = stepwise ? this.executor : null;
					
					stepwise = this.curr_stepwise == this.executor;
					button2.style.imageUp = stepwise ? Icon.lockOpen : Icon.rightOpen;
					tooltip1.container.visible = stepwise;
					tooltip2.container.visible = !stepwise;
				} else if(this.curr_stepwise == this.executor && this.executor.initialized()){
					this.executor.runOnce();
				}
			}).size(40).center().get();
			//const tooltip = Tooltip.Tooltips.getInstance().create("");
			//const label = tooltip.container.getChildren().peek();
			

			const tooltip1 = Tooltip.Tooltips.getInstance().create("step forward (shift+click to unlock)");
			const tooltip2 = Tooltip.Tooltips.getInstance().create("shift+click to lock");
			button2.addListener(tooltip1);
			button2.addListener(tooltip2);
			let stepwise = this.curr_stepwise == this.executor;
			button2.style.imageUp = stepwise ? Icon.lockOpen : Icon.rightOpen;
			tooltip1.container.visible = stepwise;
			tooltip2.container.visible = !stepwise;
		}).center();
		table.row();
		this.ldbBuildVariables();
		const cell = table.add(this.ldbCollapser).size(300, 600).bottom();
	},

	ldbBuildVariables() {
		if (this.ldbCollapser !=  null) {
			this.ldbCollapser.remove();
		}
		this.ldbCollapser = new Collapser(table => {
			const back = new BaseDrawable(Styles.none);
			table.background(back);

			const p = table.pane(tableInPane => {
				tableInPane.left().top().margin(10);
				tableInPane.background(Styles.black6);
				for (var v of this.executor.vars) {
					// Only show the constant @unit
					if (!v.constant || v.name == "@unit") {
						tableInPane.label(this.ldbVarVal(v)).padLeft(10).left().get().alignment = Align.left;
						tableInPane.row();
					}
				}
			}).size(300, 600).grow().left().margin(10).pad(10).get();
			p.setOverscroll(false, false);
			p.setSmoothScrolling(false);
		}, true);
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

	ldbCollapser: null,
	curr_stepwise: null
});
