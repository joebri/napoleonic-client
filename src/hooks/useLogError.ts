interface LogErrorBaseProps {
  name: string;
  exception: unknown;
}

const useLogError = (moduleName: string) => {
  const logError = <LogErrorProps extends LogErrorBaseProps>({
    name,
    exception,
    ...rest
  }: LogErrorProps) => {
    const error = {
      ...rest,
      exception,
      moduleName: moduleName,
      name,
    };
    console.error(`Error: ${error}`, 'color:red');
  };

  return { logError };
};

export { useLogError };
