### Special Actions

#### Custom JSON

Our final box is the custom JSON box where we can add a custom block of JSON to perform special actions which are not 
covered by the previous inputs. For example here is some custom JSON which can be used to add interactions to a 3D
Model:

     [{
                "name": "Cell Model",
                "key": "interactive_model",
                "data": {
                    "parent": {
                        "src": "contentUnits/InteractiveModel/models/cell.glb",
                        "position": {
                            "x": 2,
                            "y": 1,
                            "z": 0
                        },
                        "rotation": {
                            "x": 0,
                            "y": 0,
                            "z": 0
                        },
                        "scale": {
                            "x": 0.3,
                            "y": 0.3,
                            "z": 0.3
                        }
                    },
                    "parts": [
                        {
                            "src": "contentUnits/InteractiveModel/models/nucleus.glb",
                            "srcSelected": "contentUnits/InteractiveModel/models/nucleus_selected.glb",
                            "caption": "Nucleus",
                            "title": "Nucleus",
                            "text": "The nucleus contains all\n
                                    the genetic material of\n
                                    the cell. It is circular\n
                                    in shape and dark in\n
                                    color having a double membrane.",
                            "trigger": {
                                "position": {
                                    "x": 0.4,
                                    "y": 0.2,
                                    "z": -0.5
                                },
                                "radius": 0.75
                            }
                        },
                        {
                            "src": "contentUnits/InteractiveModel/models/mitochondria.glb",
                            "srcSelected": "contentUnits/InteractiveModel/models/mitochondria.glb",
                            "caption": "Mitochondria",
                            "title": "Mitochondria",
                            "text": "Mitochondria are known as\n
                                    the powerhouse of the cell.\n
                                    It is a double membrane\n
                                    structure present in all\n
                                    eukaryotic cells.",
                            "trigger": {
                                "position": {
                                    "x": 0.4,
                                    "y": 0,
                                    "z": 3.2
                                },
                                "radius": 0.75
                            }
                        },
                        {
                            "src": "contentUnits/InteractiveModel/models/microtubules.glb",
                            "srcSelected": "contentUnits/InteractiveModel/models/microtubules.glb",
                            "caption": "Microtubules",
                            "title": "Microtubules",
                            "text": "Microtubules are major\n
                                    components of the cytoskeleton.\n
                                    They are found in all eukaryotic\n
                                    cells, and they are involved\n
                                    in mitosis, cell motility,\n
                                    intracellular transport, and\n
                                    maintenance of cell shape.",
                            "trigger": {
                                "position": {
                                    "x": 1,
                                    "y": 0,
                                    "z": 2.3
                                },
                                "radius": 0.85
                            }
                        },
                        {
                            "src": "contentUnits/InteractiveModel/models/lysosome.glb",
                            "srcSelected": "contentUnits/InteractiveModel/models/lysosome.glb",
                            "caption": "Lysosome",
                            "title": "Lysosome",
                            "text": "A lysosome is a membrane-\n
                                    bound cell organelle that\n
                                    contains digestive enzymes.\n
                                    Lysosomes are involved\n
                                    with various cell processes.",
                            "trigger": {
                                "position": {
                                    "x": 2.25,
                                    "y": -0.1,
                                    "z": 1.8
                                },
                                "radius": 0.4
                            }
                        },
                        {
                            "src": "contentUnits/InteractiveModel/models/golgiComplex.glb",
                            "srcSelected": "contentUnits/InteractiveModel/models/golgiComplex.glb",
                            "caption": "Golgi Complex",
                            "title": "Golgi Complex",
                            "text": "Golgi apparatus helps in\ntransporting the cargo,\n
                                    modifications, targeting, and
                                    \npackaging of proteins and
                                    \nlipids to the target site.",
                            "trigger": {
                                "position": {
                                    "x": -1,
                                    "y": -0.4,
                                    "z": 1.7
                                },
                                "radius": 1.5
                            }
                        }
                    ]
                }
            }]

Simply pasting this block of code is enough it will be included in the JSON, an experienced developer should carry 
out this step to ensure that the JSON is correctly formatted. Please take note that the JSON is in the form of an Array,
this is so that we can handle multiple "special action" objects within the config.