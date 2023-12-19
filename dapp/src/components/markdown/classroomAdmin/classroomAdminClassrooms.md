## Setting Up A New Classroom

Creating a classroom is a very simple process, once logged in via metamask if you are registered on the contract as a
Classroom Administrator you will have access to the Classroom Administrator tab which will lead you to the following screen:

![](https://i.ibb.co/cTyqnDc/classroom-Admin-Screen.png)

In order to add a classroom we must first click the "ADD" button situated on the top right-hand side of the Classrooms table,
this leads us to the Add Classroom screen:

![](https://i.ibb.co/KxCwq1r/classroom-Admin-Add-Class.png)

When this page is loaded a new GUID is generated for the class to be created, now we need to give the class a Name, simply
enter the desired class name into the classname input.

>For reference the GUID generated here needs to be stored in the class config of the scene code, located in the src folder
> in the classroomConfigs Folder here is an example in out example SceneTemplate1: 
> [EXAMPLE](https://github.com/liveteach/liveteach-examples/blob/develop/SceneTemplate1/src/classroomConfigs/classroomConfig.json)

We need to now assign LAND parcels to the class, the Land parcels input accepts comma seperated coordinates from Decentralands 
map and will generate a map tile confirming the position, for example if we select 10,10 and hit enter we will see the following:

![](https://i.ibb.co/zxGrJFh/map-Screen-One.png)

>Alternatively you can copy the coords from the scene.json of the venue and paste them into the input for a quicker effect.

This input excepts multiple co-ordinates for the class and centres the image on the most logical centre coord. If you add a
co-ordinate by mistake simply click the "x" on the chip of the incorrect co-ordinate and that will be removed updating the 
image.

When both the Name and Co-ordinates are set we can add the classroom, Clicking the add button on the top right of this view
will begin the transaction opening metamask for you to confirm.

Once the transaction has been processed the new class should appear on the initial classroom admin screen on the classrooms table.

If you would like to remove a classroom the Classroom table on the Classroom Admin screen contains a "REMOVE" button on each
row in the table allowing you to remove that classroom, after clicking remove a metamask window will open for you to confirm the transaction.