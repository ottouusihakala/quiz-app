import type { LoaderFunctionArgs} from "@remix-run/node";
import imageService from '~/services/image'

export async function loader({
  params,
}: LoaderFunctionArgs) {
  console.log('image.imagename loader')
  const { imageName } = params
  if (!imageName) {
    return new Response('No image name specified', { status: 400 })
  }
  try {
    const imageInfo = await imageService.getImage(imageName)
    if (!imageInfo) {
      return new Response('No image found with image name', { status: 404 })
    }
    const { image, format } = imageInfo
    const mimeType = format ? `image/${format}` : 'application/octet-stream'
    return new Response(image, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
      },
    });
  } catch (e) {
    return new Response('Failed to get image file', { status: 500 })
  }
  
}