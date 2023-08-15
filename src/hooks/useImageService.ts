const useImageService = () => {
  // const moduleName = `${useImageService.name}.ts`;

  const getLocalImage = (path: string) => {
    if (!path) {
      return '';
    }
    const adjustedPath = path.replace('Napoleonic/', '');
    const uri = `${process.env.REACT_APP_IMAGE_URL}${adjustedPath}`;
    return uri;
  };

  return { getLocalImage };
};

export { useImageService };
