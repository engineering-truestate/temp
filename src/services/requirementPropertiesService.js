import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { COLLECTIONS, PROPERTY_TYPES } from "../constants/collections";

const batchSize = 10;

const getCollectionRef = (propertyType) => {
  if (propertyType === PROPERTY_TYPES.auction) return collection(db, COLLECTIONS.AUCTIONS);
  if (propertyType === PROPERTY_TYPES.preLaunch) return collection(db, COLLECTIONS.PRE_LAUNCH);
  return null;
};

const getUserRequirementLinks = async (userId, requirementId) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return [];
    }

    const userData = userSnap.data();
    const { preLaunch = [], auction = [] } = userData.properties || {};

    const filterAndTag = (arr, type) =>
      arr
        .filter((property) => property?.requirementIds?.includes(requirementId))
        .map((property) => ({ ...property, propertyType: type }));

    const preLaunchFiltered = filterAndTag(preLaunch, PROPERTY_TYPES.preLaunch);
    const auctionFiltered = filterAndTag(auction, PROPERTY_TYPES.auction);

    return [...preLaunchFiltered, ...auctionFiltered];
  } catch (error) {
    console.error("Error getting user requirement links:", error);
    return [];
  }
};

const getAndMergeAssets = async (userProperties) => {
  if (!Array.isArray(userProperties) || userProperties.length === 0) {
    return [];
  }

  const grouped = userProperties.reduce((acc, prop) => {
    const key = prop.propertyType || "unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(prop);
    return acc;
  }, {});

  const merged = [];

  for (const [propertyType, props] of Object.entries(grouped)) {
    const ref = getCollectionRef(propertyType);
    if (!ref || props.length === 0) continue;

    const idSet = new Set(props.map((p) => p.projectId));
    const userPropMap = props.reduce((m, p) => {
      if (p?.projectId) m[p.projectId] = p;
      return m;
    }, {});

    const ids = Array.from(idSet);

    for (let i = 0; i < ids.length; i += batchSize) {
      const sliceIds = ids.slice(i, i + batchSize);
      if (sliceIds.length === 0) continue;

      try {
        const qRef = query(ref, where("__name__", "in", sliceIds));
        const snap = await getDocs(qRef);

        snap.docs.forEach((docSnap) => {
          const docId = docSnap.id;
          const assetData = docSnap.data() || {};
          const userProperty = userPropMap[docId];

          if (userProperty) {
            const mergedProperty = {
              ...assetData,
              id: docId,
              timestamp: userProperty.added,
              recommendedBy: userProperty.agentName,
              userStatus: userProperty.stage,
              propertyType: userProperty.propertyType,
            };
            merged.push(mergedProperty);
          }
        });
      } catch (error) {
        console.error(`Error fetching ${propertyType} properties:`, error);
      }
    }
  }

  return merged;
};

export const getRequirementProperties = async (userId, requirementId) => {
  try {
    const links = await getUserRequirementLinks(userId, requirementId);
    const items = await getAndMergeAssets(links);

    return {
      success: true,
      data: items,
      error: null
    };
  } catch (error) {
    console.error("Error in getRequirementProperties:", error);
    return {
      success: false,
      data: [],
      error: error?.message || "Failed to fetch properties"
    };
  }
};