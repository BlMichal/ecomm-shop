import { getWixClient } from "@/lib/wix-client.base";

type ProductSort = "last_update" | "price_asc" | "price_desc";

interface IProducts {
  collectionIds?: string | string[];
  sort?: ProductSort;
}

export async function queryProducts({
  collectionIds,
  sort = "last_update",
}: IProducts) {
  const wixClient = getWixClient();

  let query = wixClient.products.queryProducts();

  const collectionIdsArray = collectionIds
    ? Array.isArray(collectionIds)
      ? collectionIds
      : [collectionIds]
    : [];

  if (collectionIdsArray.length > 0) {
    query = query.hasSome("collectionIds", [collectionIdsArray]);
  }

  switch (sort) {
    case "price_asc":
      query = query.ascending("price");
      break;
    case "price_desc":
      query = query.descending("price");
      break;
    case "last_update":
      query = query.descending("lastUpdated");
      break;
  }

  return query.find();
}
