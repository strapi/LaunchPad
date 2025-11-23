export const initDictionary = (list) => {
  let obj = {};
  list.forEach(item => {
    obj[item.source_text] = item.target_text || "";
  });
  localStorage.setItem('dictionary', JSON.stringify(obj));
};

export const translateFunc = (key) => {
  const list = JSON.parse(localStorage.getItem('dictionary')) || {}
  return list[key] || key;
};

export default {
  initDictionary,
  translateFunc,
};
