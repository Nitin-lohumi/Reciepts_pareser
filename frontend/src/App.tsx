import { useState } from "react";
import UploadImage from "./component/UploadImage";
import PreviewImage from "./component/PreviewImage";

function App() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  return (
    <div className="min-h-screen bg-gray-100">
      {!selectedImage ? (
        <UploadImage setSelectedImage={setSelectedImage} />
      ) : (
        <PreviewImage
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      )}
      
    </div>
  );
}

export default App;
