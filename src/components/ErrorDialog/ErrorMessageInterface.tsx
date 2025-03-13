export interface ErrorMessageInterface {
  message: string;
  name: string;
  stack: string;
  config: {
    // your config properties...
  };
  code: string;
  status: number;
  response: {
    data: {
      type: string;
      title: string;
      status: number;
      errors: {
        [key: string]: string[];
      };
    };
  };
}
