// JavaScript Document
var newHirePositions = ['TechSupport', 'Sales', 'Tech2', 'Lead', 'Supe'],
    systemOS,
    employeeStatus = 'inactive',
    createdTimestamp,
    netid,
    emailid,
    emailAddress,
    repTag,
    passWord,
    pandionid,
    pandionpass
;

var splitURL = function (){
	var urlData = document.URL;
	console.log("url is " + urlData);
	var	urlParts = urlData.split('?');
	var urlVals = urlParts[1].split('&');	
	var idVals = {};
	for (var i in urlVals){
		var keyValue = urlVals[i].split('=');
		var key = decodeURIComponent(keyValue[0]);
		var value = decodeURIComponent(keyValue[1]);
		idVals[key] = value;
	}
	console.log(idVals[key]);
	return(idVals[key]);
};


var deleteItem = function(emp) {
	var empDoc = {};
	
	$.couch.db('empman').openDoc(emp, {
		success: function (data) {
			empDoc._id = data._id;
			empDoc._rev = data._rev;

			console.log("we will remove: ", empDoc);
			
			$.couch.db('empman').removeDoc(empDoc, {
				success: function(data) { 
					$.mobile.changePage( "index.html#bFname", {
					    transition: "pop",
					    reverse: false,
					    changeHash: false
					});
				},
				error: function(status) {
					console.log(status);}
		
			});
		}
	});
	
	return false;
};

var editEmployee = function(emp) {
	var empDoc = {};

	$.couch.db('empman').openDoc(emp, {
		success: function (data) {
			$.mobile.changePage( "edit.html?_id=" + data._id, {
			    transition: "pop",
			    reverse: false,
			    changeHash: false
			});
		}
	});
	return false;
};

function getCreatedTimestamp() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDay();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var formattedTime = year + '/' + month + '/' + day + ' ' + hour + ':' + minutes + ':' + seconds;
    createdTimestamp = formattedTime;
    console.log('Created Timestamp: '+ createdTimestamp);
    return false;
};

function getNetID() {
    //create network login id first initial last name
    var fname = $('#firstName').val();
    var lname = $('#lastName').val();
    var id = fname.charAt(0) + lname;
    netid = id.toLowerCase();
    console.log('NetID: '+ netid);
};

function getEmailID() {
    //create network login id first initial last name
    var fname = $('#firstName').val();
    var lname = $('#lastName').val();
    var id = fname + lname.charAt(0);
    emailid = id.toLowerCase();
    console.log('emailID: ' + emailid);
};

function getEmailAddress(id) {
    emailAddress = id + '@example.com';
};

function hackify(str) {
    // hackify strings for things like passwords
    // hackify is l337 5p38k. 3 = e, 8 = a, etc. 
    str = str.replace('1','!');
    str = str.replace(' ','_');
    str = str.replace('a','8');
    str = str.replace('A','8');
    str = str.replace('e','3');
    str = str.replace('E','3');
    str = str.replace('i','1');
    str = str.replace('I','1');
    str = str.replace('o','0');
    str = str.replace('O','0');
    str = str.replace('s','5');
    str = str.replace('S','5');
    str = str.replace('t','7');
    str = str.replace('T','7');
    return str;
};

function getRepTag() {
     // rep tag (Last Initial, First Initial, last 3 of extension: YM225)
    var fname = $('#firstName').val();
    var lname = $('#lastName').val();
    var ext = $('#phoneExt').val();
    var id = ( lname.charAt(0) + fname.charAt(0) + ext.slice(1,4) );
    repTag = id.toUpperCase();
    console.log('repTag: ' + repTag);
};

function getPassWord() {
    // password = x10firstname last initial + hackified
    var fname = $('#firstName').val();
    var lname = $('#lastName').val();
    var id = 'x10' + hackify(fname + lname.charAt(0));
    passWord = id.toLowerCase();
    console.log('passWord = ' + passWord);
};

function getPandionUser() {
    var fname = $('#firstName').val();
    var lname = $('#lastName').val();
    var id = fname + '.' + lname + '@chat.example.com';
    pandionid = id.toLowerCase();
};

function getPandionPassword() {
    var fname = $('#firstName').val();
    var lname = $('#lastName').val();
    var id = lname + fname.charAt(0);
    pandionpass = id.toLowerCase();
};

function getCheckboxValue() {
    if($('#empStatus').attr('checked')) {
        employeeStatus = 'active';
    } else {
        employeeStatus = 'inactive';
    }
};

//store employee into local storage
function storeData() {
	console.log('Soring Data');
    getCheckboxValue();
    getCreatedTimestamp();
    getNetID();
    getEmailID();
    getEmailAddress(emailid);
    getRepTag();
    getPassWord();
    getPandionUser();
    getPandionPassword();
    if ( $('#key').val() == "" ) { var id = "empman_" + repTag; }
    else { var id = $('#key').val(); };
    var emp             = {};
    	emp._id			= id;
        emp.fname       = ['First Name:', $('#firstName').val()];
        emp.lname       = ['Last Name:', $('#lastName').val()];
        emp.hired       = ['Hire Date:', $('#hireDate').val()];
        emp.created     = ['Created On:', createdTimestamp];
        emp.jobStatus   = ['Employee Status:', employeeStatus];
        emp.department  = ['Department', 'Default'];
        emp.position    = ['Position:', $('#jobTitle').val()];
        emp.swipeid     = ['SwipeID:', $('#swipeID').val()];
        emp.phoneExt    = ['Phone Ext:', $('#phoneExt').val()];
        emp.repTag      = ['Rep Tag:', repTag];
        emp.vmpass      = ['Voice Mail Password:','1234'];
        emp.compNumber  = ['Company Phone Number:', '(425) 203-3900'];
        emp.netid       = ['Network ID:', netid];
        emp.netPass     = ['Network Pass:', passWord];      
        emp.emailid     = ['Email ID:', emailid];
        emp.emailPass   = ['Email Pass:', passWord];        
        emp.emailAddress= ['Email Address:', emailAddress];
        emp.pandionid   = ['Pandion User:', pandionid];     
        emp.pandionpass = ['Pandion Pass:', pandionpass];
        emp.os          = ['Stations OS:', $('[name=os]:checked').val()];
        emp.notes       = ['Notes:', $('#notes').val()];

    console.log('EMP = ' + emp);
	console.log('RevKey on Store: ' + $('#revkey').val());
	
    if ($('#revkey').val() != '') {
    	console.log('rev is good and = ' + $('#revkey'));
    	emp._rev = $('#revkey').val(); 
	    console.log('Updating: ' + emp);
	    $.couch.db('empman').saveDoc(emp, {
	    	success: function(data) {
	    		console.log('Saved: ' + data);
	    	}
		});
		$.mobile.changePage( "employee.html?_id=" + id, {
		    transition: "pop"
		});

    } else {
	    console.log('Saving: ' + emp);
	    $.couch.db('empman').saveDoc(emp, {
	    	success: function(data) {
	    		console.log('Saved: ' + data);
	    	}
		});
		$.mobile.changePage( "employee.html?_id=" + id, {
		    transition: "pop"
		});
    };
};

$('#home').live('pageshow',function(){
	console.log('Homepage Live: OK!');
});

$('#bFname').live('pageshow',function(){	
    $.couch.db('empman').view('app/employees', {
        success: function (data) {
            console.log(data);
            $('#bEmployeeLV').empty();
            $.each(data.rows, function(index, emp) {
                var item = (emp.value || value.doc);
                $('#bEmployeeLV').append(
                    $('<li>').append(
                        $('<a>')
                            .attr('href', 'employee.html?_id='+emp.key)
                            .append(
                            	$('<h3>')
                            		.text(item.fname[1] + " " + item.lname[1])
                            )
                            .append(
                            	$('<p>')
                            		.text(item.emailAddress[1]))
                            )
                )
            });
            $('#bEmployeeLV').listview('refresh');
        }
    });
});


$('#bEmployee').live('pageshow',function(){
	var employee = splitURL();
	$.couch.db('empman').openDoc(employee, {
		success: function (data) {
			$('#bEmployee article').empty();
			
			$('<h1>' + data.fname[1] + " " + data.lname[1] + '</h1>' + '<div class="ui-grid-a">' +
					"<div class='ui-block-a'><strong>" + data.hired[0] + " </strong></div>" + 
						"<div class='ui-block-b'>" + data.hired[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.created[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.created[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.jobStatus[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.jobStatus[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.department[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.department[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.position[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.position[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.swipeid[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.swipeid[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.phoneExt[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.phoneExt[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.repTag[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.repTag[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.vmpass[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.vmpass[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.compNumber[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.compNumber[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.netPass[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.netPass[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.emailid[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.emailid[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.emailPass[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.emailPass[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.emailAddress[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.emailAddress[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.pandionid[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.pandionid[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.pandionpass[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.pandionpass[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.os[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.os[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.notes[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.notes[1] + "</div>" +
					"</div>" +
					"<div><a href='' onclick='editEmployee(\"" + 
						employee + "\")' data-role='button' data-theme='b'>Edit Employee</a>" +
					"<a href='#' onclick='deleteItem(\"" + employee + 
						"\")' data-role='button' data-theme='e'>Delete Employee</a></div>" +
			"").appendTo($('#bEmployee article')).trigger('create');
		}
	});
});


$('#addNewHirePage').live('pageshow', function() {
	console.log('Edit Page OK!!');
    $("#addNewHireForm").validate({
        errorContainer: "#errors, #errorsMsg",
        errorLabelContainer: "#errors ul",
        wrapper: "li", debug:true,
        submitHandler: function(form) { 
            var data = $("#addNewHireForm").serializeArray();
            storeData();
        }
    });
    $.each(newHirePositions, function(key,value) {
        $('#jobTitle')
            .append($('<option><option')
                .attr('value',value)
                .text(value)).selectmenu('refresh');
    });
    
    if (document.URL.indexOf('?') > 0) {
    	var employee = splitURL();
    	console.log('Editing Employee: '+employee);
    	
    	$.couch.db('empman').openDoc(employee, {
    		success: function (data) {
    			var id = data._id;
    			var rev = data._rev;
		        $('#firstName').val(data.fname[1]);
		        $('#lastName').val(data.lname[1]);
		        $('#hireDate').val(data.hired[1]);
		        $('#jobTitle').val(data.position[1]).attr('selected', true).siblings('option').removeAttr('selected');
		        $('#jobTitle').selectmenu('refresh');
		        $('#swipeID').val(data.swipeid[1]);
		        $('#phoneExt').val(data.phoneExt[1]);
		        $('#notes').val(data.notes[1]);
		        $('#submit').text('Update Employee').button('refresh');
		        if(data.jobStatus[1] == 'Active'){ $('empStatus').checked = true; };
		        for (var i=0; i< $('[name=os]').length; i++) {
		            if( $('[name=os]:eq('+i+')').val() == 'WinXP' && data.os[1] == "WinXP") {
		                $('[name=os]:eq('+i+')').attr('checked','checked');
		            } else if ( $('[name=os]:eq('+i+')').val() == 'Win7' && data.os[1] == "Win7") {
		                $('[name=os]:eq('+i+')').attr('checked','checked');
		            }
		        };
		        $('#key').val(id);
		        $('#revkey').val(rev);
		        console.log('_rev = ' + rev);
		    	console.log('RevKey on change page: ' + $('#revkey').val());

    		}
    	});
    };
    
	return false;
});
