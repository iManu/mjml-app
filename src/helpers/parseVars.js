function getValue(object, keys) {
  return keys.split('.').reduce((o, k) => {
    return (o || {})[k];
  }, object);
}

export default function parseVars(content, userVars) {
  return content.replace(/{([^}]*)}/g, (r,k)=>getValue(userVars, k))
}
