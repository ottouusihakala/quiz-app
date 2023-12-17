import fs from 'fs/promises'
import path from 'path'

type ImageInfo = {
  image: Buffer
  name: string
  format?: 'jpg' | 'png'
}

const getImage = async (imageName: string): Promise<ImageInfo | undefined> => {
  try {
    const image = await fs.readFile(path.resolve(`./app/data/${imageName}`))
    if (!image) {
      throw new Error('No image found with given imageName')
    }
    const imageNameSplit = imageName.split('.')
    const format = imageNameSplit.at(imageNameSplit.length - 1) as undefined | ('jpg' | 'png')
    return {
      image,
      name: imageName,
      format
    }
  } catch (e) {
    console.error('Encountered error while attempting to load image file', e)
    return undefined
  }
}
  

export default {
  getImage
}