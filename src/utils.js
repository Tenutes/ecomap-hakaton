const Z_REGEXP = new RegExp(/(.?)(z)/gi);

export const getDateWithoutZ = string => {
  const match = string.match(Z_REGEXP);

  return match ? match[1] : string;
};
