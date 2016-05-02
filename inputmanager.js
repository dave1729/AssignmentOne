//num_groups has default of one
//since "% 0" would be undefined in addInputToCurrent()
function InputManager(ctx) {
	this.ctx = ctx;
    this.inputgroup_list = [];
    this.currentgroup = new InputList();
    this.inputgroup_list.push(this.currentgroup);
	this.num_groups = 1;
    this.currentgroupIndex = 0;
}

//add a new group and switch to it
InputManager.prototype.addGroup = function() {
	this.inputgroup_list.push(new InputList());
	this.currentgroupIndex = this.num_groups;
	this.currentgroup = this.inputgroup_list[this.currentgroupIndex];
	this.num_groups++;
}

//add a new input to the current group
InputManager.prototype.addInput = function(theName, theChar) {
	this.currentgroup.addInput(theName, theChar);
}

//sets an input command to false(to stop a motion with a command)
InputManager.prototype.setFalse = function(theName) {
	for(var i = 0; i < this.currentgroup.size; i++) {
		if(this.currentgroup.inputname_list[i] === theName) {
			this.currentgroup.inputboolean_list[i] = false;
		}
	}
}

//sets all inputs for this group to false (off)
InputManager.prototype.setAllFalse = function() {
	for(var i = 0; i < this.currentgroup.size; i++) {
		this.currentgroup.inputboolean_list[i] = false;
	}
}

//returns a boolean value used to check key presses
InputManager.prototype.checkInput = function(theName) {
	var initiated = false;
	for(var i = 0; i < this.currentgroup.size; i++) {
		if(this.currentgroup.inputname_list[i] === theName) {
			initiated = this.currentgroup.inputboolean_list[i];
		}
	}
	return initiated;
}

InputManager.prototype.inputCode = function(name) {
	var code = 63;//dec code for ? character
	for(var i = 0; i < this.currentgroup.size; i++) {
		if(this.currentgroup.inputname_list[i] === name) {
			initiated = this.currentgroup.inputcharcode_list[i];
		}
	}
	return initiated;
}

//iterates forward through the groups, resets to beginning if you iterate past the last
//default iterations is 1 iteration if given no input
InputManager.prototype.iterate = function(iterations = 1) {
	this.currentgroupIndex = ((this.currentgroupIndex + iterations) % this.num_groups);
	this.currentgroup = this.inputgroup_list[this.currentgroupIndex];
}

InputManager.prototype.start = function () {
	// var getXandY = function (e) {
        // var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        // var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;
// 
        // if (x < 1024) {
            // x = Math.floor(x / 32);
            // y = Math.floor(y / 32);
        // }
// 
        // return { x: x, y: y };
    // }

    //var that = this;

    // event listeners are added here

    // this.ctx.canvas.addEventListener("click", function (e) {
        // that.click = getXandY(e);
        // console.log(e);
        // console.log("Left Click Event - X,Y " + e.clientX + ", " + e.clientY);
    // }, false);
// 
    // this.ctx.canvas.addEventListener("contextmenu", function (e) {
        // that.click = getXandY(e);
        // console.log(e);
        // console.log("Right Click Event - X,Y " + e.clientX + ", " + e.clientY);
        // e.preventDefault();
    // }, false);
// 
    // this.ctx.canvas.addEventListener("mousemove", function (e) {
        // //console.log(e);
        // that.mouse = getXandY(e);
    // }, false);
// 
    // this.ctx.canvas.addEventListener("mousewheel", function (e) {
        // console.log(e);
        // that.wheel = e;
        // console.log("Click Event - X,Y " + e.clientX + ", " + e.clientY + " Delta " + e.deltaY);
    // }, false);
	var that = this;
    this.ctx.canvas.addEventListener("keydown", function (e) {
		for(var i = 0; i < that.currentgroup.size; i++) {
			if(that.currentgroup.inputcharcode_list[i] === e.which) {
				that.currentgroup.inputboolean_list[i] = true;
			}
		}
    }, false);

    // this.ctx.canvas.addEventListener("keypress", function (e) {
        // that.chars[e.code] = true;
        // console.log(e);
        // console.log("Key Pressed Event - Char " + e.charCode + " Code " + e.keyCode);
    // }, false);
// 
    this.ctx.canvas.addEventListener("keyup", function (e) {
		for(var i = 0; i < that.currentgroup.size; i++) {
			if(that.currentgroup.inputcharcode_list[i] === e.which) {
				that.currentgroup.inputboolean_list[i] = false;
			}
		}
    }, false);
// 
    // console.log('Input started');
}

function InputList() {
    this.inputname_list = [];
    this.inputcharcode_list = [];
    this.inputboolean_list = [];
	this.size = 0;
}

InputList.prototype.addInput = function(theName, theChar) {
	
	//the given name of this input
	this.inputname_list.push(theName);
	
	//stores the charcode, not the char itself
	this.inputcharcode_list.push(theChar.charCodeAt(0) - 32);
	
	//default state is off
	this.inputboolean_list.push(false);
	
	this.size++;
}

InputList.prototype.printInput = function() {
	for(var i = 0; i < this.size; i++) {
		alert(this.inputname_list[i] + " " + this.inputcharcode_list[i] + " " + this.inputboolean_list[i]);
	}
}