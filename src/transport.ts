import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { BACKEND_URL } from "./config";
import { AuthServiceClient } from "protos/gen/nai_auth.client";
import { GalleryServiceClient, MainServiceClient } from "protos/gen/nai.client"

const transport = new GrpcWebFetchTransport({
  baseUrl: BACKEND_URL
})

export const authServiceClient = new AuthServiceClient(transport)
export const mainServiceClient = new MainServiceClient(transport)
export const galleryServiceClient = new GalleryServiceClient(transport)
