import { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import ReceiptEditor from "./ReceiptEditor";
import type { ReceiptData } from "../types/receipt";

interface PreviewImageProps {
  selectedImage: File;
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
}

function PreviewImage({ selectedImage, setSelectedImage }: PreviewImageProps) {
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [progress, setProgress] = useState(0);

  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const url = URL.createObjectURL(selectedImage);
    setImageUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedImage]);

  const startFakeProgress = () => {
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }

        return prev + 10;
      });
    }, 300);

    return interval;
  };

  const handleParseReceipt = async () => {
    try {
      setIsParsing(true);

      const interval = startFakeProgress();

      const formData = new FormData();
      formData.append("receipt", selectedImage);

      const res = await fetch("https://reciepts-pareser-3.onrender.com/api/receipts/parse", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      clearInterval(interval);
      setProgress(100);

      if (!data.success) {
        alert(data.message || "Failed to parse receipt");
        return;
      }

      setTimeout(() => {
        setReceiptData(data.data);
        setIsParsing(false);
      }, 400);
    } catch (error) {
      console.log(error);
      setIsParsing(false);
      alert("Something went wrong while parsing");
    }
  };

  const handleUploadNew = () => {
    setReceiptData(null);
    setSelectedImage(null);
  };

  return (
    <div className="relative min-h-screen px-4 py-6">
      {isParsing && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800">
              Parsing receipt...
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Extracting merchant, date, line items and total.
            </p>

            <div className="mt-5 h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-right text-sm font-semibold text-gray-700 mt-2">
              {progress}% complete
            </p>
          </div>
        </div>
      )}

      {!receiptData ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6">
            <button
              onClick={() => setSelectedImage(null)}
              className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 hover:text-black"
            >
              <FiArrowLeft />
              Back
            </button>

            <h1 className="text-2xl font-bold text-gray-800 mt-5">
              Receipt Preview
            </h1>

            <div className="mt-6 h-96 overflow-hidden rounded-2xl bg-gray-100 flex items-center justify-center">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="receipt"
                  className="max-h-full max-w-full object-contain"
                />
              )}
            </div>

            <button
              onClick={handleParseReceipt}
              className="mt-6 cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-all"
            >
              Parse Receipt
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl py-5 mx-auto grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-5 h-fit">
            <h2 className="text-xl font-bold text-gray-800">
              Uploaded Receipt
            </h2>

            <div className="mt-4 h-96 overflow-hidden rounded-2xl bg-gray-100 flex items-center justify-center">
              <img
                src={imageUrl}
                alt="receipt"
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <button
              onClick={handleUploadNew}
              className="mt-5 w-full bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-xl cursor-pointer"
            >
              Upload New Receipt
            </button>
          </div>

          <ReceiptEditor
            receiptData={receiptData}
            setReceiptData={setReceiptData}
          />
        </div>
      )}
    </div>
  );
}

export default PreviewImage;
