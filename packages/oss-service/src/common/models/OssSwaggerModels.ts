import { SwaggerModelDefinitionV2, TypicalSwaggerModel } from '@fangcha/swagger'
import { OssFileInfo } from './OssModels'

export const OssSwaggerModelData = {
  Swagger_OssFileInfo: {
    name: 'Swagger_OssFileInfo',
    schema: {
      type: 'object',
      properties: {
        ossKey: {
          type: 'string',
          description: 'OSS Key',
        },
        mimeType: {
          type: 'string',
          description: 'MIME Type',
        },
        size: {
          type: 'number',
          description: 'Size(B)',
          example: 1024,
        },
        url: {
          type: 'string',
          description: 'URL',
        },
      },
    },
  } as TypicalSwaggerModel<OssFileInfo>,
}

export const OssSwaggerModelList: SwaggerModelDefinitionV2[] = Object.keys(OssSwaggerModelData).map(
  (key) => OssSwaggerModelData[key]
)
