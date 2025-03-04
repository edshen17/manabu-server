type ConvertToTitlecase = typeof convertToTitlecase;

const convertToTitlecase = (str: string): string => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export { convertToTitlecase, ConvertToTitlecase };
