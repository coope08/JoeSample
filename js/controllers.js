'use strict';

//Controller for home-page.html
function HomePageCtrl($scope, $http) {

    //Variable declarations
    //None

    //Get the json data that will determine the characteristics of the chatter directive
    $http.get('data.json').
        success(function(data) {

            //Assign it to the scope
            $scope.model = JSON.parse(JSON.stringify(data));
        });
        

}

function ChatterTemplateCtrl($scope) {

	$scope.choices = [];

    //Keep a watch over the settings attribute
    $scope.$watch('settings', function () {

        //In case the settings attribute is not defined, do not proceed
        if ($scope.settings === undefined) {
            return;
        }

        //Initialization
        $scope.focussedInput = false;

        $scope.showFileUploadModes = true;
        

        $scope.showFeeds = ($scope.settings.expandFeeds === undefined || $scope.settings.expandFeeds === "")? true : $scope.settings.expandFeeds;

        //On Focus of the text area input, increase the rows and place the button to
        //submit the input below the text area
        $scope.InputFocussed = function() {

            $scope.focussedInput = true;

            //Focus the expanded text area. We use setTimeout here to allow the browser a
            //split second do its stuff before focussing to prevent any interference of
            //other events
            setTimeout(function() {
                jQuery("div.focussed-input textarea").focus();
            }, 0);
        };

        //Toggle the display of feeds section
        $scope.toggleDisplayFeeds = function() {
            $scope.showFeeds = !$scope.showFeeds;
        };

        //Is the mode passed the active chatter mode?
        $scope.isChatterModeActive = function(mode) {
            return $scope.settings.activeMode === mode;
        };

        //Change the chatter mode
        $scope.changeChatterMode = function(mode) {
            $scope.settings.activeMode = mode;

            //Reset the file mode to show the upload modes
            $scope.showFileUploadModes = true;
        };

        //Returns the icon class of the active mode
        $scope.getActiveModeIconClass = function() {
            for (var i = 0; i < $scope.settings.chatterModes.length; i++) {
                if ($scope.settings.chatterModes[i].mode === $scope.settings.activeMode) {
                    return $scope.settings.chatterModes[i].icon;
                }
            }
        };

        //Decide which textarea to show for the post based chatter mode
        $scope.postModeTextarea = function(textareaType) {
            if ($scope.focussedInput === true) {
                return textareaType === 'focussed';
            } else if ($scope.settings.displayMode === 'mobile') {
                return textareaType === 'focussed';
            } else {
                return textareaType === 'non-focussed';
            }
        };

    });

    //Keep a watch over the target attribute
    $scope.$watch('target', function() {

        //Return if target is still not populated
        if ($scope.target === undefined) {
            return;
        }

        //Returns the number of feeds
        $scope.feedCount = function() {
            if ($scope.target.feedItems !== undefined) {
                return $scope.target.feedItems.length;
            }
        };

        //Determine if the current post is the last post / feed
        $scope.isLastPost = function(postIndex) {
            return postIndex !== ($scope.target.feedItems.length - 1);
        };
    });

    $scope.$watch('source', function() {

        //Return if source is still not populated
        if ($scope.source === undefined) {
            return;
        }

        //Things to do when source key is ready

        //Nothing to do as of now
    });
    
    //Keep a watch over the polls attribute
    $scope.$watch('choices', function() {
        //Return if polls choices is still not populated
        if ($scope.choices === undefined) {
            return;
        }

        //Returns the number of choices in a poll
        $scope.choiceCount = function() {
            if ($scope.choices !== undefined) {
                return $scope.choices.length;
            }
        };

        //Determine if the current choice is the last choice in the poll
        $scope.isLastChoice = function(choiceIndex) {
            return choiceIndex !== ($scope.choices.length - 1);
        };
    });
    
    //used to repopulate the feed
    $scope.clearFeed = function()
    {
    	$scope.target.feedItems=[];
    };
    
    //calls client .ajax() function with a url that retrieves all the feed items of a specific record
    //RecordID  is passed through the url. 
    $scope.getFeed = function(addPosts)
    {
      //$scope.$apply(function(){
    	 $scope.target.id = $scope.recordId;
    	 $scope.target.feedItems = [];
    	 //check for login
    	 if (client.sessionId != null)
    	 {
  
    		if (addPosts != true)
    		{
    			
    			$scope.alertMessage = "Loading feed items...";
    			
    		}
    		
    		//call forcetk client and request feed-items for a record
    			client.ajax('/v28.0/chatter/feeds/record/'+ $scope.recordId + '/feed-items',$scope.getFeedItemsSuccessCallback, $scope.getFeedItemsErrorCallback, "GET");
    			
    	 }
    	 else
    	 {
    		alert("You are not logged in.");
    	 }
      //});	 
    };
    
    //remove a choice from the poll
    $scope.removeChoices = function() 
    {
    	var oldChoices = $scope.polls.pollChoices;
    	$scope.polls.pollChoices = [];
    	angular.forEach(oldChoices, function(choice) {
        	if (!choice.remove) 
        		$scope.polls.pollChoices.push(choice);
    	});
  	};
  	
  	//add a choice to a poll
  	$scope.addPollChoice = function() 
  	{
  		$scope.choices.push({
            text: $scope.choiceText,
            done: false
        });
    	$scope.choiceText = "";
  	};
    
    //get the nextPageURL parameter from the scope and retrieve additional feed items
    $scope.getNextPage = function()
    {
    	if (client.sessionId !== null)
    	{
    		var tempNextPageUrl = $scope.nextPageUrl.substring(14,$scope.nextPageUrl.length);
    		
    		//call forcetk client and request feed-items from a record
    		client.ajax(tempNextPageUrl, $scope.getFeedSuccessCallback, $scope.errorCallback, "GET");
    		$scope.retrievingNextPage = true; //disable the showMore button so user can click only once
    	}
    	else
    	{
    		alert("You are not logged in anymore.");
    	}
    };
    
   
    //called on successful retrieval of the feed items
    $scope.getFeedItemsSuccessCallback = function(response)
    {
    //digest everything so the model gets updated
    $scope.$apply(function(){
    
    	//set nextPageUrl for getting more feeds that are located on the next page
    	$scope.nextPageUrl = response.nextPageUrl;
    	
    	//re-enable showMore button in case user was loading more feeds
    	$scope.retrievingNextPage = false;
    	
    	//loop through all the feed items and add them to the feedItems model
    	for (var i = 0; i < response.items.length; i++)
    	{
    		 
    		var newItem = {};
    		newItem.from = response.items[i].actor.name;
    		newItem.profilePicUrl = response.items[i].actor.photo.smallPhotoUrl;
    		newItem.type = response.items[i].type;
    		//newItem["body"] = response.items[i]["body"].text;
    		newItem.body = response.items[i].body.text;
    		
    		
    		//detect the type of the Post
    		if(newItem.type == "LinkPost")
    		{
    			newItem.linkName = response.items[i].attachment.title;
    			newItem.linkUrl = response.items[i].attachment.url;
    		}
    		if (newItem.type == "ContentPost")
    		{
    			newItem.fileUrl = client.instanceUrl + response.items[i].attachment.downloadUrl;
    			//newItem.linkUrl = response.items[i].attachment.url;
    		}
    		newItem.timestamp = response.items[i].createdDate;
    		//add it to the model
    		$scope.target.feedItems.push(newItem);
    		
    	};
    	
    	if (i == response.items.length)
    	{
    		$scope.target.id = response.items[0].parent.id;
    	    $scope.target.name = response.items[0].parent.name;
    	    $scope.target.type = response.items[0].parent.type;
    	    $scope.target.iconUrl = response.items[0].parent.motif.smallIconUrl;
    	}
    	
    	});
    };
  
    
    //called on unsuccessful retrieval of feed items and alerts the user
    $scope.getFeedItemsErrorCallback = function(response)
    {
    	alert("Something went wrong.");
    	console.log(response);
    };
    
    //post the link feed item to the chatter feed
    $scope.postLinkItem = function()
    {
    	//data for the link POST item must contain attachment, attachment type, body and body type
    	var data = {
    		"attachment": {
    			"attachmentType": "Link", 
    			"url": "http://",
    			"urlName": ""
    		},
    		"body": {
    			"messageSegments": [{
    				"type": "Text",
    				"text": ""
    			}]
    		}
    	};
    	//update the link data object with data from the input fields
    	data.body.messageSegments[0].text = $scope.linkModeTextAreaValue;
    	//check if any inputs are null, and set them to ""
    	if ($scope.linkModeTextAreaValue == null)
    	{	
    		data.body.messageSegments[0].text = "";
    	}
    	
    	data.attachment.url = $scope.linkModeLinkUrl;
    	data.attachment.urlName = $scope.linkModeLinkName;
    	
    	if ($scope.linkModeLinkName == null)
    	{
    		data.attachment.urlName = "";
    	}
    	
    	//url can't be null so we alert user if it is
    	if ($scope.linkModeLinkUrl != null && $scope.linkModeLinkUrl != "")
    	{
    		//turn the data into a string so we can send it over POST method
    		data = JSON.stringify(data);
    		//use forcetk.js ajax method to post the data
    		client.ajax('/v27.0/chatter/feeds/record/'+$scope.recordId+'/feed-items', $scope.postLinkSuccess, $scope.errorCallback, "POST", data);
    		$scope.postingState = true;
    	}
    	else
    	{
    		alert("Please enter the link url");
    	}
    	
    	$scope.$apply(function(){$scope.model});
    };
    
   
    //post the file feed item to the chatter feed
   /* $scope.onFileSelect = function(files)
    {
    	//data for the link POST item must contain attachment, attachment type, body and body type
	    if ($scope.showFileUploadModes == true)
	    {
	    
	    	console.log(files);
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                	
	    		var data = {
	    			"attachment": {
	    				"attachmentType": "ExistingContent", 
	    				"contentDocumentId": ""
	    			},
	    			"body": {
	    				"messageSegments": [{
	    					"type": "Text",
	    					"text": ""
	    				}]
	    			}
	    		};
	   	 } else 
	   	 {	
	    		var data = {
	    			"attachment": {
	    				"attachmentType": "NewFile", 
	    				"description": "",
	    				"title": ""
	    			},
	    			"body": {
	    				"messageSegments": [{
	    					"type": "Text",
	    					"text": ""
	    				}]
	    			}
	    		};
	    	}
    		//update the file data object with data from the input fields
    		data.body.messageSegments[0].text = $scope.fileModeTextAreaValue;
    		//check if any inputs are null, and set them to ""
    		if ($scope.fileModeTextAreaValue == null)
    		{	
    			data.body.messageSegments[0].text = "";
    		}
    	
    		data.attachment.description = $scope.fileModeTextAreaValue;
    		data.attachment.title = "Testing";
    	
    		
    	
    		//turn the data into a string so we can send it over POST method
    		data = JSON.stringify(data);
    		//use forcetk.js ajax method to post the data
    		client.ajax('/v27.0/chatter/feeds/record/'+$scope.recordId+'/feed-items', $scope.postFileSuccess, $scope.errorCallback, "POST", data);
    		$scope.postingState = true;
    	
    	}
    }; */
    
    //post the post items to the chatter feed
    $scope.postTextItem = function()
    {
    	//data for the post item must contain body and body type
    	var data = {
    		"body": {
    			"messageSegments": [{
    				"type": "Text",
    				"text": "New Post"
    			}]
    		}
    	};
    	
    	//update the link data object with tdata from the input fields
    	data.body.messageSegments[0].text = $scope.postModeTextAreaValue;
    	
    	//post has to contain some text or we alert the user
    	if ($scope.postModeTextAreaValue != null && $scope.postModeTextAreaValue != "")
    	{
    		data = JSON.stringify(data);
    		client.ajax('/v24.0/chatter/feeds/record/'+$scope.recordId+'/feed-items',$scope.postTextSuccess,$scope.errorCallback, "POST", data);
    		$scope.postingState = true;
    	}
    	else
    	{
    		alert("Please enter some text");
    	}
    };
    
    //called after link item is posted
    $scope.postLinkSuccess = function(response)
    {
    	$scope.clearFeed();                 //clear the feed
    	$scope.getFeed(true);               //refresh the feed
    	$scope.linkModeTextAreaValue = "";  //clear all inputs
    	$scope.linkModeLinkUrl = "";
    	$scope.linkModeLinkName = "";
    	$scope.postingState = false;        //enable back the share button
    };
    
    //called after post item is posted
    $scope.postTextSuccess = function(response)
    {
    	$scope.clearFeed();
    	$scope.getFeed(false);
    	$scope.postModeTextAreaValue = "";
    	$scope.postingState = false;
    };
    
    //called on unsuccessfull post of the link or post item
    $scope.errorCallback = function(response)
    {
    	alert ("Error while posting item.");
    	console.log(response)
    };
   
}

function logginCallback()
{
	angular.element($('#mainTest')).scope().recordId = "001i000000KoIVU";
	angular.element($('#mainTest')).scope().getFeed(false);
}
