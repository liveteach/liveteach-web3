## Creating The Classroom Configuration

Once you have been assigned the role of a teacher and a classroom has been created you will need to configure the
content available for the class. Accessing the Teacher tab in the dApp will take you to the teacher screen with
the classrooms listed to our wallet. The screen will appear something like this:

![](https://i.ibb.co/bK8VDHS/Teacher-Screen.png)

From this screen you can access the setup menu for each classroom, clicking the setup button will take you to the setup
screen which has various inputs for setting up the class JSON configuration. The initial box contains the classroom name
and a text field where you can add a basic class description:

![](https://i.ibb.co/p4qNHSy/Setup-Class.png)

### Image and Video

Moving on we can start adding Image and Video content to the class:

![](https://i.ibb.co/ZxNc3CZ/Images-And-Videos.png)

Both the Images and Video hold similar configuration fields, Source, Caption and Ratio. There is also a + and - button
to add fields for more Images or Videos. The content will need to be hosted somewhere to enable you to provide a source
url to the content. You can add the caption you wish for the Video and Image and set the ratio you require.

### 3D Models
We can also add 3D models to the class for displaying during the lesson, this is achieved by the models window and has
slightly more to it that the previous examples. The Input appears like so:

![](https://i.ibb.co/gZQ56DS/Models.png)


Setting the models source is the first step and this is the path to the model in the sdk project folder. Then we have a
few steps to configure the position and some functions of the model. Position and Scale are a good place to start, this 
will require some investigation in the sdk scene to get the x,y,z axis for the position you would like the model to be
displayed, in you sdk scene there is a tool next to the map to show you the current position your avatar is standing:

![](https://i.ibb.co/dbNK80y/position.png)

Once your happy with a position you can scale the model accordingly. 

>For more information about 3D models within the sdk check out Decentralands sdk documentation 
https://docs.decentraland.org/creator/development-guide/sdk7/entity-positioning/

Set these values in the x,y,z inputs available on the models Form for Position and Scale. You will notice that there are
two checkboxes also available for the model spin and replace, the spin box will add a rotating spin to the model and the
replace checkbox allows you to define whether to replace the model when cycling between models, or keep the model and
add the next model alongside this one. This can be useful to display stages of a concept to the class.

We can also add any animations that the model may have, we can add any number as long as they are present in the model,
simply enter the clip name, and check whether this is a looping animation or not. We can add and remove animations with
the + and - buttons, adding will appear like so:

![](https://i.ibb.co/fnCLKDY/Add-Animation.png)

Once our whole configuration has been setup we can then choose to download the JSON file and embed that into our scene
or we can publish the JSON to IPFS via Pinata and use the URL provided to reference the object storage. To download the
JSON simply click the "Download JSON" button at the top right of the configuration page.

>This can also be a handy way of reviewing the JSON object created to ensure it follows your desired configuration

Publishing to IPFS requires a little extra work as you will require a Pinata JWT token to your IPFS node. You will need 
to create a Pinata account and follow the steps in this tutorial to setup your ke and obtain a JWT token.

>Following the steps here will generate a key and secret and also the JWT token we will need to publish: 
>https://docs.pinata.cloud/docs/getting-started

Once you have obtained your token you simply press "Publish", a modal will appear like so:

![](https://i.ibb.co/bvGf85c/JWT.png)

Paste your JWT token into the input box and hit Publish, the Modal will close and you will see a P{ending message at
the top of the screen:

![](https://i.ibb.co/7Kjpk9K/pending.png)

Once the Pinning has completed you will see your URL, you must Copy this before navigating away from the Page:

![](https://i.ibb.co/1JpyQPq/URL.png)

And There you have your classroom configuration created and published.