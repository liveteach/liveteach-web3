# Getting Started

## Introduction

We will go through an example scene step by step to show how to get a Live Teach classroom up and running.

### Step 1: Import the LiveTeach NPM Package into your Scene.

Assuming LiveTeach is referenced correctly in your package.json you can import it into your scene:
`import * as dclu from '@dclu/dclu-liveteach'`

### Step 2: Activate LiveTeach

LiveTeach needs a handle on Decentraland ECS so we pass that in as an argument in the configuration we pass to our setup method:

```
    dclu.setup({
        ecs: ecs,
        Logger: null
    })
```

### Step 3: Setup Communication Channel

LiveTeach supports both decentralised communications using the peer to peer comms provided as part of the Decentraland SDK, or a server can be used. Note that Decentraland's peer to peer communications only work within a single realm. This could be a benefit for a basic classroom, but to broadcast to all users in all realms, a server must be used.
For the purposes of this quick start we will use Peer to Peer comms which is initialised as follows:
```
    const communicationChannel = new PeerToPeerChannel()
    let devLiveTeachContractAddress: string = "0x..."
    let devTeachersContractAddress: string = "0x..."
    let useDev = false;
    if (useDev) {
        ClassroomManager.Initialise(communicationChannel, devLiveTeachContractAddress, devTeachersContractAddress, false)
    }
    else {
        // mainnet
        ClassroomManager.Initialise(communicationChannel, undefined, undefined, false)
    }
```
_Note that you can provide alternative contract addresses so you can develop against testnet versions of the contracts. If you don't pass these arguments in, then the mainnet default contracts will be used._ 

### Step 4: Setup Classroom Config

The way LiveTeach works is that a LiveTeach Scene declares one or more classrooms within the scene, and then each classroom has a configuration block specific to it. 

Each classroom has a GUID which identifies it, and that GUID is written into the smart contract when a classroom administrator creates the classroom. The GUID is then typically provided to the scene in a configuration file which would be imported:
```
import * as classroom1Config from "/classroomConfigs/classroom1Config.json"
```


```
{
    "classroom": {
        "guid": "c73c16d2-e2a7-4acc-bdda-fb2205b5d634",
        "origin": {
            "x": 12,
            "y": 5,
            "z": 36
        },
        "volume": {
            "x": 20,
            "y": 10,
            "z": 20
        },
        "autojoin": true,
        "capacity": "20",
        "duration": "60",
        "seatingEnabled": true,
        "students": []
    }
}
```
_Please <a href>click here</a> for  more information on LiveTeach classroom configuration_ 

### Step 5: Register Classroom

Once you have a valid classroom configuration in the scene, it is necessary to register it for use.
This is done by using the [Classroom Manager](https://www.google.com) as follows:

```
ClassroomManager.RegisterClassroom(classroom1Config)
```

### Step 6: Add Teachers Podium

A teacher needs to control the classroom. This is done using the teachers Podium, which contains a control panel for the teachers to use. The podium is implemented in the scene so that classrooms can define their own UX. 

To get started it is recommended you use a Teacher's podium from one of the [Example Scenes](https://www.google.com)

### Step 6: Add Screens

LiveTeach classrooms can contain multiple instances of the screen that is used for showing presentations and videos. The classroom Manager is used as follows:

``` 
 const classroomGuid = classroom1Config.classroom.guid
 ClassroomManager.AddScreen(classroomGuid, _position, _rotation, _scale, _parent)
```

| That concludes the minimum setup of a LiveTeach classroom. Please browse the docs to incorporate other features such as a Seating Manager or 3D  Content Units |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
