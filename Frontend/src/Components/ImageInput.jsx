import React from "react";

const ImageInput = ({ name, classname }) => {
  const [images, setImages] = useState([]);

  return (
    <div class="flex items-center space-x-6">
      <div class="shrink-0">
        {images[0] && (
          <img
            id="preview_img"
            class="h-16 aspect-video object-cover rounded"
            src={images[0]?.src}
            alt="uploaded image"
          />
        )}
      </div>
      <label class="block">
        <span class="sr-only">Choose photo</span>
        <input
          type="file"
          accept="image/*"
          name={name}
          className={`block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold   file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 border border-neutral-200 px-6 py-5 rounded-full ${classname}`}
          onChange={(e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
              setImages((prevImages) => [
                ...prevImages,
                {
                  id: Math.random(),
                  src: reader.result,
                },
              ]);
            };
            reader.readAsDataURL(file);
            // console.log(images);
          }}
        />
      </label>
    </div>
  );
};

export default ImageInput;
