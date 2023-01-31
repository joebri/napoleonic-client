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
      moduleName,
      name,
    };
    console.error(`%cError: ${JSON.stringify(error)}`, 'color:red');
  };

  return { logError };
};

export { useLogError };
