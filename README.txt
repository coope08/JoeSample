Submission for challenge http://www.cloudspokes.com/challenges/2125

To deploy application, a simple server will suffice. For example a python based server:
$ python -m SimpleHTTPServer
followed by opening your browser and launching the URL: http://localhost:8000
Open the home-page.html file

Resources used:
    a. AngularJS (http://angularjs.org/)
    b. jQuery 1.9.1 (http://jquery.com/)
    c. Twitter Bootstrap (http://twitter.github.com/bootstrap/index.html)
    d. Font Awesome (http://fortawesome.github.com/Font-Awesome/)

    Note - Font Awesome is an awesome collection of icons that builds on the glyphicons
    provided by Twitter Bootstrap. It is meant to mimic the icons shown in the Chatter
    application. It can be easily replaced with existing icons, if provided.

JSON data Information
    The JSON data resides in a file called data.json

    Kindly take a look at the file to understand the structure.
    ALL KEYS ARE MANDATORY. Kindly provide them based on the domain values as described below

    "settings"
        "expandOnLoad": Can hold values true or false
            Will decide whether to show the entire chatter UI or not. A false value will hide
            the UI completely while a true value will show the application.

        "expandFeeds": Can hold values true or false
            Will decide whether to show the feeds section of the chatter application by 
            default or not. A false value will hide the feed when the application loads 
            initially while a true value will show it. When the feed is hidden, it can
            still be seen by clicking on the "Show Feed" link at the header bar

        "chatterModes": An array of objects containing the different chatter modes
            Will contain the different chatter modes. The structure of the object should
            be as follows:
            "mode": The name of the mode
            "icon": In my application, the icon class to represent the mode. Kindly take
                    a look at glyphicons in twitter bootstrap and font awesome.

        "activeMode": A single mode value which is active, picked from the list of modes above
            Will decide which is the active mode by default. Ensure that the mode specified
            is provided in the chatterModes defined earlier. This is case sensitive.

        "displayMode": Chose from the two values - "desktop" or "mobile"
            The application is responsive. Thus the application can be used in a mobile or
            a desktop browser. The application can also be used in a sidebar of width 
            equivalent to width offered by a mobile browser, in the header, footer or as main
            content.
            Depending on the width of the container holding the application, chose between
            two display modes.
                "desktop": Bigger width. Suitable when the application is used as the main
                            content or in a container of considerably bigger width.
                "mobile": Smaller width. Suitable when the application is used in the 
                            sidebar or in a container of considerably smaller width.

            Since the application is response, there will not be many changes in the UI
            for the two display modes. The difference lies in the way the different chatter 
            modes are displayed and the number of rows in the input textarea

        "allowComments": Can hold true or false values
            Will decide whether to allow the user to comment on a feed or not.
            In the current application, will decide whether to show the "Comment" link
            under the feed or not

        "allowLikes": Can hold true or false values
            Will decide whether to allow the user like a feed or not.
            In the current application, will decide whether to show the "Like" link under
            the feed or not

    "target" 
        "name": The name of the application
            This will be displayed at the top of the application

        "iconUrl": The icon to show for the application
            This will be displayed along with the name of the application at the top

        "feedItems": An array of objects containing the feed for the application
            Will contain the feeds for the application. The structure of the feeds should be
            as follows:
            "from": The author of the feed
            "profilePicUrl": The URL of the image to be used as a profile pic. Ensure that
                                the size of the image is at least 65 x 55 (W x H)px. The URL
                                is relative to the location of the application
            "type": The type of the feed. See "settings->chatterModes" for the different types
            "fileUrl": The URL of the file relative to the location of the application, if 
                        it is a feed of type "File". Else, this key need not be specified
            "linkUrl": The URL of the link - absolute URL. Valid for feed of type "Link". 
                        Else, this key need not be specified
            "body": The body of the feed.
            "timestamp": The timestamp provided in ISO 8601 format. Using AngularJS in 
                            built date filter, the timestamp is converted for suitable display

    There are other keys used in the JSON data, however, their significance at the time
    of submitting this application is not provided in the challenge and hence their
    purpose cannot be determined and thus explained. They exist only due to a mention
    in the challenge description
