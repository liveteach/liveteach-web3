### 3D Models
We can also add 3D models to the class for displaying during the lesson, this is achieved by the models window and has
slightly more to it that the previous examples. The Input appears like so:

![](https://i.ibb.co/hVxS0rQ/Models.png)


Setting the models source is the first step and this is the path to the model in the sdk project folder. there are two
checkboxes that follow one to set if the model has spin and the other to set whether to replace this model in the 
sequence of models in the lesson, this can be useful if a model should remain in world and have another model overlay,
or be displayed at the same time, checking this box will mean the next model in order will replace the current one.



There are advanced configurations which can be added when we click on the advanced tab, These options should really be
setup by a fairly experienced developer.

![](https://i.ibb.co/CbLn0My/Models-Advanced.png)

The options are as follows Position and Scale, this will require some 
investigation in the sdk scene to get the x,y,z axis for the position you would like the model to be displayed, in you 
sdk scene there is a tool next to the map to show you the current position your avatar is standing:

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

![](https://i.ibb.co/LrgzD19/Models-Animations.png)