import type { TypeTree } from './types'
import { converter, formatHex8 } from 'culori'
const convertToRGB = converter('rgb')

type ColorObject = {
  name: string
  hexValue: string
  transparency: number | undefined
}

// This is working for all react native supported color formats except
// const didntWork: {
//     number1: 'hwb(0, 0%, 22%)'; //Other HWB formats work
//     number2: 'hwb(360, 33%, 22%)'; //Other HWB formats work
//     number3: '0xff00ff00'; //int not working
// };

/**
 * Uses type info to return a string representation of the type
 *
 * Example:
 * { kind: 'union', types: [{ kind: 'string-literal', type: '"#000000"' }, { kind: 'string-literal', type: '"#FFFFFF"' }] }
 * Yields:
 * 'string | number'
 */
export function getColorsFromType (typeTree: TypeTree): ColorObject[] | undefined {
  const colorsList: ColorObject[] = []
  console.log('typeTree', typeTree)

  if (typeTree.kind === 'union') {
    typeTree.types.forEach((type) => {
      if (type.kind === 'string-literal') {
        const cleanString = type.typeName.replace(/"/g, '')
        const colorObject = getColorObjectFromType(cleanString)
        if (colorObject) colorsList.push(colorObject)
      }
    })
  }

  if (typeTree.kind === 'string-literal') {
    const cleanString = typeTree.typeName.replace(/"/g, '')
    const colorObject = getColorObjectFromType(cleanString)
    if (colorObject) colorsList.push(colorObject)
  }

  return colorsList.length > 0 ? colorsList : undefined
}

const getColorObjectFromType = (type: string): {
  name: string
  hexValue: string
  transparency: number | undefined
} | undefined => {
  const rgbFromString = convertToRGB(type)
  if (rgbFromString) {
    return {
      name: type,
      hexValue: formatHex8(rgbFromString),
      transparency: rgbFromString.alpha
    }
  }
}
