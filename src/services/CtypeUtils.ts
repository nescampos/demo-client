import * as sdk from '@kiltprotocol/sdk-js'
/**
 * Create the CTYPE model from a CTYPE input model (used in CTYPE editing components).
 * This is necessary because component editors rely on editing arrays of properties instead of
 * arbitrary properties of an object. Additionally the default language translations are integrated
 * into the input model and need to be separated for the CTYPE model.
 * This is the reverse function of CType.getCTypeInputModel(...).
 * @returns The CTYPE for the input model.
 */

class CTypeUtils {
  public fromInputModel(ctypeInput: any): sdk.CType {
    if (!sdk.CTypeUtils.verifySchema(ctypeInput, sdk.CTypeInputModel)) {
      throw new Error('CType input does not correspond to input model schema')
    }
    const ctype = {
      schema: {
        $id: ctypeInput.$id,
        $schema: sdk.CTypeModel.properties.$schema.default,
        properties: {},
        type: 'object',
      },
      metadata: {
        title: {
          default: ctypeInput.title,
        },
        description: {
          default: ctypeInput.description,
        },
        properties: {},
      },
    }

    const properties = {}
    ctypeInput.properties.forEach((p: any) => {
      const { title, $id, ...rest } = p
      properties[$id] = rest
      ctype.metadata.properties[$id] = {
        title: {
          default: title,
        },
      }
    })
    ctype.schema.properties = properties
    return new sdk.CType(ctype as sdk.ICType)
  }

  public getLocalized(o: any, lang?: string): any {
    if (lang == null || !o[lang]) {
      return o.default
    }
    return o[lang]
  }

  /**
   * Create the CTYPE input model for a CTYPE editing component form the CTYPE model.
   * This is necessary because component editors rely on editing arrays of properties instead of
   * arbitrary properties of an object. Additionally the default language translations are integrated
   * into the input model. This is the reverse function of CType.fromInputModel(...).
   * @returns The CTYPE input model.
   */
  public getCTypeInputModel(ctype: sdk.CType): any {
    // create clone
    const result = JSON.parse(JSON.stringify(ctype.schema))
    result.$schema = sdk.CTypeInputModel.$id
    result.title = getLocalized(ctype.metadata.title)
    result.description = getLocalized(ctype.metadata.description)
    result.required = []
    result.properties = []

    Object.entries(ctype.schema.properties as object).forEach(
      ([key, value]) => {
        result.properties.push({
          title: getLocalized(ctype.metadata.properties[key].title),
          $id: key,
          type: value.type,
        })
        result.required.push(key)
      }
    )

    return result
  }

  /**
   * This method creates an input model for a claim from a CTYPE.
   * It selects translations for a specific language from the localized part of the CTYPE meta data.
   * @param {string} lang the language to choose translations for
   * @returns {any} The claim input model
   */
  public getClaimInputModel(ctype: sdk.ICType, lang?: string): any {
    // create clone
    const result = JSON.parse(JSON.stringify(ctype.schema))
    result.title = getLocalized(ctype.metadata.title, lang)
    result.description = getLocalized(ctype.metadata.description, lang)
    result.required = []
    Object.entries(ctype.metadata.properties as object).forEach(
      ([key, value]) => {
        result.properties[key].title = getLocalized(value.title, lang)
        result.required.push(key)
      }
    )
    return result
  }
}

export default CTypeUtils
