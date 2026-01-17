import { BaseResponse } from 'src/common/interfaces/response';

export const baseResponse = (message: string, data: any): BaseResponse => {
  if(data){
    return {
      message,
      data,
    };
  }
  return {
    message,
  };
};
