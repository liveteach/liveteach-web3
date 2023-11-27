### Publishing to IPFS
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