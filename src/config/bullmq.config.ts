import { ConfigurableModuleBuilder } from '@nestjs/common';

export interface BullQueueConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<BullQueueConfig>()
    .setExtras(
      {
        isGlobal: true,
      },
      (definition, extras) => ({
        ...definition,
        global: extras.isGlobal,
      }),
    )
    .build();
