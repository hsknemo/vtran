interface ChunkDefine {
  index: number;
  chunk: Blob;
  fileName: string;
  size: number;
  chunkSize: number;
  fileTotalLen: number;
}


interface UploadFileData {
  fileList: File[]
}
