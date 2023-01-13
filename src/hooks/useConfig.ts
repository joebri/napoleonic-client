const loadConfig = (name: string) => {
  try {
    // eslint-disable-next-line
    const path = require(`../config/${name}.config.js`);

    return require(`../config/${name}.config.js`);
  } catch (exception) {
    console.log(`useConfig.loadConfig: ${exception}`);
    return {};
  }
};

const replaceValue = (name: string, config: any, data: any) => {
  let value = config[name];
  if (data) {
    for (const key in data) {
      value = value.replace(`{${key}}`, data[key]);
    }
  }
  return value;
};

const getConfig = () => {
  const envConfig = loadConfig('local');
  const defaultConfig = loadConfig('default');
  return { ...defaultConfig, ...envConfig };
};

const useConfig = (name: string, data: any = null) => {
  const config = getConfig();
  return replaceValue(name, config, data);
};

export { useConfig };
