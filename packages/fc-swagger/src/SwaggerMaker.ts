export interface SwaggerResource {
  cssMain: string
  jsBundle: string
  jsPreset: string
}

export class SwaggerMaker {
  public static defaultSwaggerResource: SwaggerResource = {
    cssMain: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.6.1/swagger-ui.min.css',
    jsBundle: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.6.1/swagger-ui-bundle.js',
    jsPreset: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.6.1/swagger-ui-standalone-preset.js',
  }

  public static makeSwaggerHTML(jsonURL: string, options: Partial<SwaggerResource> = {}) {
    const swaggerResource = {
      ...this.defaultSwaggerResource,
      ...options,
    }
    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Swagger UI</title>
    <link rel="stylesheet" type="text/css" href="${swaggerResource.cssMain}" />
    <style>
      html
      {
        box-sizing: border-box;
        overflow: -moz-scrollbars-vertical;
        overflow-y: scroll;
      }

      *,
      *:before,
      *:after
      {
        box-sizing: inherit;
      }

      body
      {
        margin:0;
        background: #fafafa;
      }
    </style>
  </head>

  <body>
    <div id="swagger-ui"></div>
    <script src="${swaggerResource.jsBundle}" charset="UTF-8"> </script>
    <script src="${swaggerResource.jsPreset}" charset="UTF-8"> </script>
    <script>
    window.onload = function() {
      // Begin Swagger UI call region
      const ui = SwaggerUIBundle({
        "dom_id": "#swagger-ui",
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        queryConfigEnabled: true,
        validatorUrl: "https://validator.swagger.io/validator",
        url: "${jsonURL}",
      })
      window.ui = ui;
    };
  </script>
  </body>
</html>
`
  }
}
