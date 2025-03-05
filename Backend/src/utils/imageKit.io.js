import ImageKit from "imagekit";
import fs from "fs";

var imageKit = new ImageKit({
  publicKey: "your_public_key",
  privateKey: "your_private_key",
  urlEndpoint: "https://ik.imagekit.io/your_imagekit_id/",
});

export const UploadImages = (imageName, tags = []) => {
  fs.readFile(`./public/tmp/productImages/${imageName}`, function (err, data) {
    if (err) throw err; // Fail if the file can't be read.
    console.log(data);
    imageKit.upload(
      {
        file: data, //required
        fileName: imageName, //required
        tags,
      },
      function (error, result) {
        if (error) console.log(error);
        else console.log(result);
      }
    );
  });
};
