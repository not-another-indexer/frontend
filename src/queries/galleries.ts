import { defineQuery } from "@pinia/colada";
import { getGalleries } from "../requests/getGalleries";

export const useGalleries = defineQuery({
  key: ['galleries'],
  query: () => getGalleries(),
})