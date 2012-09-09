// PhoneGap Index.js
var app = {
initialize: function() {
    this.bind();
},
bind: function() {
    document.addEventListener('deviceready', this.deviceready, false);
},
deviceready: function() {
    // note that this is an event handler so the scope is that of the event
    // so we need to call app.report(), and not this.report()
    app.report('deviceready');
},
report: function(id) {
    console.log("report:" + id);
    // hide the .pending <p> and show the .complete <p>
    document.querySelector('#' + id + ' .pending').className += ' hide';
    var completeElem = document.querySelector('#' + id + ' .complete');
    completeElem.className = completeElem.className.split('hide').join('');
}
};



// back to homepage function if click the fixed header title
$('header h1').on('click', function(event){
	$.mobile.changePage('#home', {
		transition: "pop",
		reverse: false, 
		changeHash: true //removes query strings and hash tags from address
	});
});

//Split url into variable function
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

// make a programming and websafe id
var makeIDName = function(str){
	str = str.replace(' ', '-');
	return str;
};


//Delete fish record
var deleteFish = function(fish) {
	var fishDoc = {};
	
	$.couch.db('laquaria').openDoc(fish, {
		success: function (data) {
			fishDoc._id = data._id;
			fishDoc._rev = data._rev;

			console.log("we will remove: ", fishDoc);
			
			$.couch.db('laquaria').removeDoc(fishDoc, {
				success: function(data) { 
					$.mobile.changePage( "index.html#browseFishies", {
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

// Edit the fish record
var editFish = function(fish) {
	var fishDoc = {};

	$.couch.db('laquaria').openDoc(fish, {
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

//store the fish's data
function storeFishData() {
	console.log('Storing the fishy');
	var idName = makeIDName($('#commonName').val());
	console.log(idName);
    if ( $('#key').val() == "" ) { var id = "fish_" + idName }
    else { var id = $('#key').val(); };
	var fish				= {} //create empty object
		fish._id			= id;
		fish.commonName		= ['Common Name:', $('#commonName').val()];
		fish.scientificName = ['Scientific Name:',$('#scientificName').val()];
		fish.photo			= ['Photo:',$('#photo').val()];
		fish.family			= ['Family:',$('#family').val()];
		fish.species		= ['Species Type:',$('#speciesType').val()];
		fish.sizeMax		= ['Maximum Size:',$('#maxSize').val()];
		fish.lifeSpan		= ['Life Span:',$('#lifeSpan').val()];
		fish.habitat		= ['Natural Habitat:',$('#naturalHabitat').val()];
		fish.tankSize		= ['Minimum Tank Size:',$('#minTank').val()];
		fish.tankRegion		= ['Tank Region:',$('#tankRegion').val()];
		fish.tankMates		= ['Possible Tank Mates:',$('#possibleTankMates').val()];
		fish.description	= ['Description:',$('#desc').val()];
		fish.tempRangeL		= ['Low End &deg;F:',$('#tempRangeLow').val()];
		fish.tempRangeH		= ['High End &deg;F:',$('#tempRangeHigh').val()];
		fish.phRangeL		= ['Low End PH:',$('#phRangeLow').val()];
		fish.phRangeH		= ['High End PH:',$('#phRangeHigh').val()];
		fish.hardnessRangeL	= ['Low End Hardness:',$('#hardRangeLow').val()];
		fish.hardnessRangeH	= ['High End Hardness:',$('#hardRangeHigh').val()];
		fish.breedingInfo	= ['Breeding Info:',$('#breedingInfo').val()];
		fish.sexingInfo		= ['Sexing Info:',$('#sexingInfo').val()];
		fish.diet			= ['Diet:',$('#diet').val()];
		fish.temperment		= ['Temperment:',$('#temperment').val()];
		fish.commonDeseases	= ['Common Deseases:',$('#commonDiseases').val()];
	console.log('Fish = ' + fish);
	console.log('RevKey on Store: ' + $('#revkey').val());
	
    if ($('#revkey').val() != '') {
    	console.log('rev is good and = ' + $('#revkey'));
    	fish._rev = $('#revkey').val(); 
	    console.log('Updating: ' + fish);
	    $.couch.db('laquaria').saveDoc(fish, {
	    	success: function(data) {
	    		console.log('Saved: ' + data);
	    	}
		});
		$.mobile.changePage( "fish_profile.html?_id=" + id, {
		    transition: "pop"
		});

    } else {
	    console.log('Saving: ' + fish);
	    $.couch.db('laquaria').saveDoc(fish, {
	    	success: function(data) {
	    		console.log('Saved: ' + data);
	    	}
		});
		$.mobile.changePage( "fish_profile.html?_id=" + id, {
		    transition: "pop"
		});
    };
};


// Page Handlers

$('#home').live('pageshow',function(){
	// Let's make sure everything is working, eh? 
	console.log('Homepage Live: OK!');
});

$('#addAFish').live('pageshow', function() {
	console.log('Add/Edit Page OK!!');
	//form handler
	$('#addNewFishForm').validate({
		errorContainer: '#errors',
		errorLabelContainer: '#errors ui',
		wrapper: "li", debug: true,
		submitHandler: function(form) {
			var data = $('#addNewFishForm').serializeArray();
			storeFishData();
		}
	});

	function smartSubmit () {	
		var requiredFields = $('input.required');
		if ($("input.required:not(:valid)").length){
			console.log('form is not valid, disable button here');
			$('#addNewFishForm #submit').attr('disabled',true);
		} else {
			console.log('form is  valid ');
			$('#addNewFishForm #submit').attr('disabled',false);
		}
	}
	
    if (document.URL.indexOf('?') > 0) {
    	var fish = splitURL();
    	console.log('Editing the fish: '+fish);
    	
    	$.couch.db('laquaria').openDoc(fish, {
    		success: function (data) {
    			var id = data._id;
    			var rev = data._rev;
		        $('#commonName').val(data.commonName[1]);
		        $('#scientificName').val(data.scientificName[1]);
		        $('#family').val(data.family[1]);
		        $('#speciesType').val(data.species[1]);
		        $('#maxSize').val(data.sizeMax[1]);
		        $('#lifeSpan').val(data.lifeSpan[1]);
		        $('#naturalHabitat').val(data.habitat[1]);
		        $('#minTank').val(data.tankSize[1]);
		        $('#tankRegion').val(data.tankRegion[1]);
		        $('#possibleTankMates').val(data.tankMates[1]);
		        $('#desc').val(data.description[1]);
		        $('tempRangeLow').val(data.tempRangeL[1]);
		        $('#tempRangeHigh').val(data.tempRangeH[1]);
		        $('#phRangeLow').val(data.phRangeL[1]);
		        $('#phRangeHigh').val(data.phRangeH[1]);
		        $('#hardRangeLow').val(data.hardnessRangeL[1]);
		        $('#hardRangeHigh').val(data.hardnessRangeH[1]);
		        $('#breedingInfo').val(data.breedingInfo[1]);
		        $('#sexingInfo').val(data.sexingInfo[1]);
		        $('#diet').val(data.diet[1]);
		        $('#temperment').val(data.temperment[1]);
		        $('#commonDiseases').val(data.commonDeseases[1]);
		        $('#submit').text('Update Fish').button('refresh');
		        $('#key').val(id);
		        $('#revkey').val(rev);
		        console.log('_rev = ' + rev);
		    	console.log('RevKey on change page: ' + $('#revkey').val());

    		}
    	});
    };
    
	return false;
});


$('#browseFishies').live('pageshow', function() {
	console.log('Browse Page OK!!');
    $.couch.db('laquaria').view('app/fishies', {
        success: function (data) {
            console.log(data);
            $('#browseFishiesLV').empty();
            $.each(data.rows, function(index, fish) {
                var item = (fish.value || value.doc);
                $('#browseFishiesLV').append(
                    $('<li>').append(
                        $('<a>') 
                            .attr('href', 'fish_profile.html?_id='+fish.key)
                            .append(
                            	$('<h3>')
                            		.text(item.commonName[1])
                            )
                            .append(
                            	$('<p>')
                            		.text(item.scientificName[1]))
                            )
                )
            });
            $('#browseFishiesLV').listview('refresh');
        }
    });
});



$('#fishProfile').live('pageshow',function(){
	var fish = splitURL();
	$.couch.db('laquaria').openDoc(fish, {
		success: function (data) {
			$('#fishProfile article').empty();
			
			$('<h1>' + data.commonName[1] + '</h1>' + '<div class="ui-grid-a">' +
					"<div class='ui-block-a'><strong>" + data.scientificName[0] + " </strong></div>" + 
						"<div class='ui-block-b'>" + data.scientificName[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.family[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.family[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.species[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.species[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.sizeMax[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.sizeMax[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.lifeSpan[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.lifeSpan[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.habitat[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.habitat[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.tankSize[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.tankSize[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.tankRegion[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.tankRegion[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.tankMates[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.tankMates[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.description[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.description[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.tempRangeL[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.tempRangeL[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.tempRangeH[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.tempRangeH[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.phRangeL[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.phRangeL[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.phRangeH[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.phRangeH[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.hardnessRangeL[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.hardnessRangeL[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.hardnessRangeH[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.hardnessRangeH[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.breedingInfo[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.breedingInfo[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.sexingInfo[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.sexingInfo[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.diet[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.diet[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.temperment[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.temperment[1] + "</div>" +
					"<div class='ui-block-a'><strong>" + data.commonDeseases[0] + "</strong></div>" + 
						"<div class='ui-block-b'>" + data.commonDeseases[1] + "</div>" +
					"</div>" +
					"<div><a href='' onclick='editFish(\"" + 
						fish + "\")' data-role='button' data-theme='b'>Edit Fish</a>" +
					"<a href='#' onclick='deleteFish(\"" + fish + 
						"\")' data-role='button' data-theme='e'>Delete Fish</a></div>" +
			"").appendTo($('#fishProfile article')).trigger('create');
		}
	});
});




//PhoneGap Camera Functions
$('#phoneGap-Camera').live('pageshow', function(){
    var pictureSource;   // picture source
    var destinationType; // sets the format of returned value

    // Wait for Cordova to connect with the device
    //
    document.addEventListener("deviceready",onDeviceReady,false);

    // Cordova is ready to be used!
    //
    function onDeviceReady() {
       pictureSource=navigator.camera.PictureSourceType;
       destinationType=navigator.camera.DestinationType;
    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoDataSuccess(imageData) {
       // Uncomment to view the base64 encoded image data
       console.log(imageData);
       
       // Get image handle
       //
       var smallImage = document.getElementById('smallImage');
       
       // Unhide image elements
       //
       smallImage.style.display = 'block';
       
       // Show the captured photo
       // The inline CSS rules are used to resize the image
       //
       smallImage.src = "data:image/jpeg;base64," + imageData;
    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoURISuccess(imageURI) {
       // Uncomment to view the image file URI
       console.log(imageURI);
       
       // Get image handle
       //
       var largeImage = document.getElementById('largeImage');
       
       // Unhide image elements
       //
       largeImage.style.display = 'block';
       
       // Show the captured photo
       // The inline CSS rules are used to resize the image
       //
       largeImage.src = imageURI;
    }

    // A button will call this function
    //
    $('#pgCamCapturePhoto').bind('click',function(){
       // Take picture using device camera and retrieve image as base64-encoded string
       navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50, destinationType: navigator.camera.DestinationType.DATA_URL });
    });

    // A button will call this function
    //
    $('#pgCamCapturePhotoEdit').bind('click',function(){
       // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
       navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true, destinationType: navigator.camera.DestinationType.DATA_URL });
    });

    // A button will call this function
    //
    $('#pgCamGetPhotoLib').bind('click',function(){
       var source = navigator.camera.pictureSource.PHOTOLIBRARY;
       // Retrieve image file location from specified source
       navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
                                   destinationType: navigator.camera.DestinationType.FILE_URI,
                                   sourceType: source });
    });

                           
    // A button will call this function
    //
    $('#pgCamGetPhotoAlbum').bind('click',function(){
        var source = pictureSource.SAVEDPHOTOALBUM;
        // Retrieve image file location from specified source
        navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
                                   destinationType: navigator.camera.DestinationType.FILE_URI,
                                   sourceType: source });
    });

                           
    // Called if something bad happens.
    //
    function onFail(message) {
       alert('Failed because: ' + message);
    }
    alert('camera page good!')
});



// PhoneGap connection
$('#phoneGap-Connection').live('pageshow', function() {
    // Wait for Cordova to load
    //
    document.addEventListener("deviceready", onDeviceReady, false);

    // Cordova is loaded and it is now safe to make calls Cordova methods
    //
    function onDeviceReady() {
        checkConnection();
    }

    function checkConnection() {
        var networkState = navigator.network.connection.type;
        
        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.NONE]     = 'No network connection';

        var alertMessage = 'Connection type: ' + states[networkState];

                               function alertDismissed() {
                               //do something
                               };
                               
            navigator.notification.alert(
                alertMessage,  // message
                alertDismissed,         // callback
                'Connection Status',            // title
                'Awesomesauce!!!'                  // buttonName
            );

    }

});







// phonegap storage testing
$('#phoneGap-Storage').live('pageshow', function() {
    // Wait for Cordova to load
    //
    document.addEventListener("deviceready", onDeviceReady, false);
    
    // Populate the database
    //
    function populateDB(tx) {
        tx.executeSql('DROP TABLE IF EXISTS DEMO');
        tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
        tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
        tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
    }
    
    // Query the database
    //
    function queryDB(tx) {
        tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
    }
    
    // Query the success callback
    //
    function querySuccess(tx, results) {
        var len = results.rows.length;
        console.log("DEMO table: " + len + " rows found.");
        $('#phoneGap-StorageListView').empty();
        for (var i=0; i<len; i++){
            console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).data);
            $('<li>'+results.rows.item(i).data+'</li>').appendTo($('#phoneGap-StorageListView')).trigger('create');
        }
        $('#phoneGap-StorageListView').listview('refresh');

        console.log("Returned rows = " + results.rows.length);
    }
    
    // Transaction error callback
    //
    function errorCB(err) {
        console.log("Error processing SQL: "+err.code);
    }
    
    // Transaction success callback
    //
    function successCB() {
        var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        db.transaction(queryDB, errorCB);
    }
    
    // Cordova is ready
    //
    function onDeviceReady() {
        var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        db.transaction(populateDB, errorCB, successCB);
    }
});