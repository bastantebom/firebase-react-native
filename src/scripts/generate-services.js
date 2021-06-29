const CodeGen = require('swagger-js-codegen').CodeGen
const Converter = require('api-spec-converter')
const fs = require('fs')
const prettier = require('prettier')

const baseURL =
  process.env.BASE_URL ||
  (() => {
    switch (process.env.NODE_ENV) {
      case 'prod':
      case 'production':
        return 'https://api.servbees.com'
      case 'staging':
        return 'https://servbees-api-staging.onrender.com'
      case 'local':
        return 'http://localhost:5000'
      case 'dev':
      case 'develop':
      case 'development':
      default:
        return 'https://servbees-api-dev.onrender.com'
    }
  })()

;(async () => {
  try {
    const swagger = (
      await Converter.convert({
        from: 'openapi_3',
        to: 'swagger_2',
        source: `${baseURL}/swagger.json`,
      })
    ).spec

    const config = JSON.parse(fs.readFileSync('.vscode/.prettierrc', 'utf-8'))
    let code = prettier.format(
      CodeGen.getReactCode({ className: 'API', swagger })
        .replace(
          /exports\.API = API/g,
          'const Api = new API(); \n export default Api'
        )
        .replace(
          'API.prototype.request = function',
          'API.prototype.request = async function'
        )
        .replace(
          'fetch(',
          "if (!this.tokenRefresher) this.tokenRefresher = checkToken().then(() => {this.tokenRefresher=null})\nawait this.tokenRefresher\nconst token = await AsyncStorage.getItem('token')\nheaders.Authorization = `Bearer ${token}`\nfetch("
        ),
      { ...config, parser: 'babel' }
    )
    code = `import { checkToken } from '@/context/UserContext'\nimport AsyncStorage from '@react-native-community/async-storage'\n${code}`
    fs.writeFileSync('./src/services/Api.js', code)
  } catch (error) {
    console.error(error)
  }
})()
