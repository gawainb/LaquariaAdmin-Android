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




