export const makeImageUrl = (imageBytes: Uint8Array) => {
  return 'data:image/jpeg;base64,' + btoa(
    new Uint8Array(imageBytes)
      .reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
}