import { FiUploadCloud } from "react-icons/fi";

interface UploadImageProps {
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
}

function UploadImage({ setSelectedImage }: UploadImageProps) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Receipt Parser
        </h1>

        <p className="text-gray-500 text-center mt-3 leading-7">
          Upload a receipt image to extract structured data.
        </p>

        <label
          htmlFor="Receipts"
          className="mt-8 border-2 border-dashed border-gray-300 rounded-2xl h-72 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
        >
          <div className="bg-blue-100 p-5 rounded-full">
            <FiUploadCloud className="text-5xl text-blue-600" />
          </div>

          <h2 className="text-xl font-semibold text-gray-700 mt-5">
            Upload Receipt
          </h2>

          <p className="text-sm text-gray-500 mt-2">JPG or PNG only</p>
        </label>

        <input
          type="file"
          hidden
          id="Receipts"
          accept=".jpg,.jpeg,.png"
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
}

export default UploadImage;
