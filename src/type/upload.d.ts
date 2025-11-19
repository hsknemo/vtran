export declare interface ChunkDefine {
  index: number;
  chunk: Blob;
  fileName: string;
  size: number;
  chunkSize: number;
  fileTotalLen: number;
}


export declare interface UploadFileData {
  fileList: File[]
}
