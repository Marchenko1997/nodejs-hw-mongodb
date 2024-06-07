// src/utils/parseFilterParams.js

const parseIsFavorite = (isFavorite) => {
    if (isFavorite === 'true') return true;
    if (isFavorite === 'false') return false;
    return undefined;
  };

  export const parseFilterParams = (query) => {
    const { isFavorite, type } = query;
    const parsedIsFavorite = parseIsFavorite(isFavorite);
    return {
      isFavorite: parsedIsFavorite,
      type,
    };
  };
