// Mejora automática de fotos con Core Image (el mismo motor de la app Fotos de macOS).
// Uso: enhance <entrada> <salida.jpg>
//  1. "Auto mejorar": exposición, luces/sombras, curva de tonos y vibrancia calculadas para cada foto.
//  2. Si la foto es pequeña (< 1400 px), la agranda con Lanczos hasta 2× (máx. 1600 px).
//  3. Nitidez (máscara de enfoque) más fuerte en las fotos agrandadas.
//  4. Guarda JPEG al 95 % con perfil sRGB.
import CoreImage
import CoreImage.CIFilterBuiltins
import Foundation
import ImageIO
import UniformTypeIdentifiers

let args = CommandLine.arguments
guard args.count == 3 else {
  FileHandle.standardError.write("uso: enhance <entrada> <salida.jpg>\n".data(using: .utf8)!)
  exit(2)
}
let input = URL(fileURLWithPath: args[1])
let output = URL(fileURLWithPath: args[2])

guard var image = CIImage(contentsOf: input, options: [.applyOrientationProperty: true]) else {
  FileHandle.standardError.write("no se pudo leer \(input.path)\n".data(using: .utf8)!)
  exit(1)
}

// 1. Auto mejorar (sin corrección de ojos rojos).
for filter in image.autoAdjustmentFilters(options: [.redEye: false]) {
  filter.setValue(image, forKey: kCIInputImageKey)
  if let out = filter.outputImage { image = out }
}

// Un toque extra de vibrancia: el Caribe es de colores vivos, sin llegar a saturar la piel.
let vibrance = CIFilter.vibrance()
vibrance.inputImage = image
vibrance.amount = 0.18
image = vibrance.outputImage ?? image

// 2. Agrandar fotos pequeñas.
let width = image.extent.width
var upscaled = false
if width < 1400 {
  let target = min(1600, width * 2)
  let scale = Float(target / width)
  let lanczos = CIFilter.lanczosScaleTransform()
  lanczos.inputImage = image
  lanczos.scale = scale
  lanczos.aspectRatio = 1
  if let out = lanczos.outputImage, scale > 1.05 { image = out; upscaled = true }
}

// 3. Nitidez.
let sharpen = CIFilter.unsharpMask()
sharpen.inputImage = image
sharpen.radius = upscaled ? 2.2 : 1.4
sharpen.intensity = upscaled ? 0.65 : 0.35
image = sharpen.outputImage ?? image

// 4. Guardar.
let context = CIContext(options: [.workingColorSpace: CGColorSpace(name: CGColorSpace.extendedLinearSRGB)!])
let srgb = CGColorSpace(name: CGColorSpace.sRGB)!
guard let cg = context.createCGImage(image, from: image.extent.integral, format: .RGBA8, colorSpace: srgb),
      let dest = CGImageDestinationCreateWithURL(output as CFURL, UTType.jpeg.identifier as CFString, 1, nil) else {
  FileHandle.standardError.write("no se pudo escribir \(output.path)\n".data(using: .utf8)!)
  exit(1)
}
CGImageDestinationAddImage(dest, cg, [kCGImageDestinationLossyCompressionQuality: 0.95] as CFDictionary)
CGImageDestinationFinalize(dest)
print("\(Int(width)) → \(cg.width) px\(upscaled ? " (agrandada)" : "")")
