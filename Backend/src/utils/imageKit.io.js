import ImageKit from "imagekit";
import fs from "fs";

var imageKit = new ImageKit({
  publicKey: process.env.imageKit_Public_Key,
  privateKey: process.env.imageKit_Private_Key,
  urlEndpoint: process.env.imageKit_Private_Key,
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
