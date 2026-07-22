export function uploadFileWithProgress(
  file: File,
  onProgress: (percent: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        onProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.url) {
            resolve(res.url);
          } else {
            reject(new Error(res.error || "Upload failed"));
          }
        } catch {
          reject(new Error("Invalid server response"));
        }
      } else {
        try {
          const res = JSON.parse(xhr.responseText);
          reject(new Error(res.error || `Upload error ${xhr.status}`));
        } catch {
          reject(new Error(`Upload error ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during upload"));
    };

    xhr.open("POST", "/api/upload");
    xhr.send(formData);
  });
}
