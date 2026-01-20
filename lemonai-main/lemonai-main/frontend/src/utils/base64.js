export const decode = (encoded) => {
  const decodedString = decodeURIComponent(
    atob(encoded)
      .split("")
      .map(function (char) {
        return "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return decodedString;
};

export default {
  decode,
};
