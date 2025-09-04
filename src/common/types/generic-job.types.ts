export interface GenericJobPayload {
  jobType: string;
  entityName: string;
  operation: 'CREATE' | 'FIND_ALL' | 'FIND_ONE' | 'UPDATE' | 'DELETE';
  data?: any;
}

export interface JobHandler<TData = any, TResult = any> {
  handle(data: TData): Promise<TResult>;
}

export interface JobHandlerRegistry {
  register<TData, TResult>(
    entityName: string,
    operation: string,
    handler: JobHandler<TData, TResult>,
  ): void;

  getHandler<TData, TResult>(
    entityName: string,
    operation: string,
  ): JobHandler<TData, TResult> | undefined;
}

export interface SerializedJob {
  entityName: string;
  operation: string;
  payload: any;
  timestamp: number;
}

export interface JobSerializer {
  serialize(jobName: string, data: any): SerializedJob;
  deserialize(serializedJob: SerializedJob): GenericJobPayload;
}
