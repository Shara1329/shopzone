import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { ExternalBlob } from "../../backend";

interface ImageUploadProps {
  image: ExternalBlob | null;
  onImageChange: (image: ExternalBlob | null) => void;
}

export default function ImageUpload({
  image,
  onImageChange,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    image ? image.getDirectURL() : null,
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress(
        (percentage) => {
          setUploadProgress(percentage);
        },
      );

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageChange(blob);
      setUploadProgress(0);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    }
  };

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {previewUrl ? (
        <Card className="relative overflow-hidden">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-64 object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </Card>
      ) : (
        <Card
          className="border-2 border-dashed hover:border-earth-green transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="p-12 text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Click to upload product image
            </p>
            <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
          </div>
        </Card>
      )}

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="space-y-2">
          <Progress value={uploadProgress} />
          <p className="text-sm text-center text-muted-foreground">
            Uploading: {uploadProgress}%
          </p>
        </div>
      )}
    </div>
  );
}
