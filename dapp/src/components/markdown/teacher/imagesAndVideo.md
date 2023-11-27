### Image and Video

Moving on we can start adding Image and Video content to the class:

![](https://i.ibb.co/mX6JdpN/images-And-Videos.png)

Both the Images and Video hold similar configuration fields, Source, Caption and Ratio. There is also a + and - button
to add fields for more Images or Videos. You can add the caption you wish for the Video and Image and set the ratio you
require.

The source field needs to reference a url of where the image is hosted, there are options here, if you already have a
favoured service to host images and have the urls available simply use those in the source input. But alternatively we
can use Pinata to store the images on IPFS

>setup of Pinata is discussed later in this documentation
> for quick reference https://docs.pinata.cloud/docs/getting-started

Once you have your Pinata account setup it really couldn't be easier to add images, click the upload image button and
choose your image from you file system, then hit publish and paste your Pinata JWT token in the input, hit publish again,
and you will see a pending message as the file is being transferred. Once complete the url of the image will auto populate
the input.

We don't have the same functionality for Videos at present so a third party HLS provider will need to be implemented and
the URL pasted into the input.