import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { blink } from '@/blink/client'
import { 
  ArrowLeft, 
  Download, 
  Sparkles, 
  Eraser, 
  Focus, 
  Palette, 
  User, 
  Undo2, 
  Redo2,
  Camera,
  Zap,
  Settings,
  Share2
} from 'lucide-react'

export default function EditorPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [processingType, setProcessingType] = useState<string>('')
  const [showBefore, setShowBefore] = useState(false)

  useEffect(() => {
    const file = location.state?.uploadedFile
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [location.state])

  const getFilterPrompt = (filterName: string): string => {
    const prompts: Record<string, string> = {
      'Vintage': 'vintage film look, warm tones, slight grain, retro aesthetic',
      'Cinematic': 'cinematic color grading, dramatic lighting, movie-like atmosphere',
      'Portrait': 'professional portrait enhancement, soft lighting, skin smoothing',
      'Landscape': 'landscape photography enhancement, vibrant nature colors, HDR effect',
      'B&W': 'black and white conversion, high contrast, artistic monochrome',
      'Warm': 'warm color temperature, golden hour lighting, cozy atmosphere'
    }
    return prompts[filterName] || 'professional photo enhancement'
  }

  const handleProcessing = async (type: string) => {
    if (!uploadedImage) return
    
    setIsProcessing(true)
    setProgress(0)
    setProcessingType(type)
    setActiveFilter(type)
    
    try {
      // Upload image to storage first
      const response = await fetch(uploadedImage)
      const blob = await response.blob()
      const file = new File([blob], 'image.jpg', { type: 'image/jpeg' })
      
      // Upload to Blink storage
      const { publicUrl } = await blink.storage.upload(file, `editor/${Date.now()}.jpg`)
      setProgress(30)
      
      let processedImageUrl: string
      
      if (type === 'retouch' || type === 'avatar') {
        // Use AI image modification for face retouch and avatar generation
        const { data } = await blink.ai.modifyImage({
          images: [publicUrl],
          prompt: type === 'retouch' 
            ? 'Professional photo retouching: enhance facial features, smooth skin, brighten eyes, perfect lighting, high quality portrait'
            : 'Transform into a stylized AI avatar with artistic effects, digital art style, vibrant colors',
          quality: 'high',
          n: 1
        })
        processedImageUrl = data[0].url
        setProgress(80)
      } else if (type === 'remove' || type === 'blur' || type === 'filter') {
        // Use AI image generation for object removal, background blur, and filters
        const { data } = await blink.ai.modifyImage({
          images: [publicUrl],
          prompt: type === 'remove' 
            ? 'Remove unwanted objects and elements from the image, clean background, seamless editing'
            : type === 'blur'
            ? 'Add professional background blur with bokeh effect, shallow depth of field, focus on subject'
            : 'Apply trendy Instagram-style filter with enhanced colors, professional photo editing',
          quality: 'high',
          n: 1
        })
        processedImageUrl = data[0].url
        setProgress(80)
      } else if (type.startsWith('filter-')) {
        // Handle preset filters
        const filterName = type.replace('filter-', '')
        const { data } = await blink.ai.modifyImage({
          images: [publicUrl],
          prompt: `Apply ${filterName.toLowerCase()} filter effect: ${getFilterPrompt(filterName)}`,
          quality: 'high',
          n: 1
        })
        processedImageUrl = data[0].url
        setProgress(80)
      } else {
        // Fallback to general enhancement
        const { data } = await blink.ai.modifyImage({
          images: [publicUrl],
          prompt: 'Enhance image quality, improve lighting, increase sharpness, professional photo editing',
          quality: 'high',
          n: 1
        })
        processedImageUrl = data[0].url
        setProgress(80)
      }
      
      setProcessedImage(processedImageUrl)
      setProgress(100)
      
    } catch (error) {
      console.error('Processing failed:', error)
      alert('Processing failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }
  
  const handleDownload = async () => {
    const imageToDownload = processedImage || uploadedImage
    if (!imageToDownload) return
    
    const link = document.createElement('a')
    link.href = imageToDownload
    link.download = `lensa-edited-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  const handleReset = () => {
    setProcessedImage(null)
    setActiveFilter(null)
    setShowBefore(false)
  }

  const filters = [
    { id: 'retouch', name: 'Face Retouch', icon: Sparkles, color: 'bg-purple-100 text-purple-600' },
    { id: 'remove', name: 'Object Removal', icon: Eraser, color: 'bg-blue-100 text-blue-600' },
    { id: 'blur', name: 'Background Blur', icon: Focus, color: 'bg-green-100 text-green-600' },
    { id: 'filter', name: 'AI Filters', icon: Palette, color: 'bg-pink-100 text-pink-600' },
    { id: 'avatar', name: 'AI Avatar', icon: User, color: 'bg-orange-100 text-orange-600' }
  ]

  const presetFilters = [
    { name: 'Vintage', preview: 'bg-gradient-to-br from-amber-200 to-orange-300' },
    { name: 'Cinematic', preview: 'bg-gradient-to-br from-blue-200 to-purple-300' },
    { name: 'Portrait', preview: 'bg-gradient-to-br from-pink-200 to-rose-300' },
    { name: 'Landscape', preview: 'bg-gradient-to-br from-green-200 to-emerald-300' },
    { name: 'B&W', preview: 'bg-gradient-to-br from-gray-200 to-gray-400' },
    { name: 'Warm', preview: 'bg-gradient-to-br from-yellow-200 to-red-300' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Lensa AI
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Undo2 className="w-4 h-4 mr-2" />
                Undo
              </Button>
              <Button variant="outline" size="sm">
                <Redo2 className="w-4 h-4 mr-2" />
                Redo
              </Button>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-purple-600 to-blue-600"
                onClick={handleDownload}
                disabled={!uploadedImage}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">AI Tools</h2>
            
            <Tabs defaultValue="enhance" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="enhance">Enhance</TabsTrigger>
                <TabsTrigger value="filters">Filters</TabsTrigger>
              </TabsList>
              
              <TabsContent value="enhance" className="space-y-4 mt-6">
                {filters.map((filter) => (
                  <Card 
                    key={filter.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      activeFilter === filter.id ? 'ring-2 ring-primary' : ''
                    } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => {
                      if (!isProcessing) {
                        setActiveFilter(filter.id)
                        handleProcessing(filter.id)
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg ${filter.color} flex items-center justify-center`}>
                          <filter.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">{filter.name}</h3>
                          <p className="text-sm text-gray-500">
                            {filter.id === 'retouch' && 'Enhance facial features'}
                            {filter.id === 'remove' && 'Remove unwanted objects'}
                            {filter.id === 'blur' && 'Add depth of field'}
                            {filter.id === 'filter' && 'Apply trendy effects'}
                            {filter.id === 'avatar' && 'Generate AI avatar'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="filters" className="space-y-4 mt-6">
                <div className="grid grid-cols-2 gap-3">
                  {presetFilters.map((filter, index) => (
                    <Card 
                      key={index}
                      className={`cursor-pointer hover:shadow-md transition-all ${
                        isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={() => {
                        if (!isProcessing) {
                          handleProcessing(`filter-${filter.name}`)
                        }
                      }}
                    >
                      <CardContent className="p-3">
                        <div className={`w-full h-16 rounded-lg ${filter.preview} mb-2`}></div>
                        <p className="text-sm font-medium text-center">{filter.name}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Settings */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Settings</h3>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Adjust Parameters
              </Button>
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Processing Status */}
          {isProcessing && (
            <div className="bg-blue-50 border-b p-4">
              <div className="max-w-md mx-auto">
                <div className="flex items-center space-x-3 mb-2">
                  <Zap className="w-5 h-5 text-blue-600 animate-pulse" />
                  <span className="text-sm font-medium text-blue-900">
                    AI Processing in progress...
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          )}

          {/* Canvas */}
          <div className="flex-1 flex items-center justify-center p-8">
            {uploadedImage ? (
              <div className="relative max-w-4xl max-h-full">
                <img 
                  src={showBefore ? uploadedImage : (processedImage || uploadedImage)} 
                  alt={showBefore ? "Original" : "Processed"} 
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                />
                <canvas 
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full opacity-0"
                />
                
                {/* Before/After Toggle */}
                <div className="absolute top-4 left-4 flex space-x-2">
                  <Badge className="bg-white/90 text-gray-700">
                    {showBefore ? "Original" : processedImage ? "Processed" : "Original"}
                  </Badge>
                  {processedImage && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/90"
                      onClick={() => setShowBefore(!showBefore)}
                    >
                      {showBefore ? "Show After" : "Show Before"}
                    </Button>
                  )}
                </div>
                
                {/* Processing Overlay */}
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                    <div className="bg-white/90 rounded-lg p-4 text-center">
                      <Zap className="w-8 h-8 text-blue-600 animate-pulse mx-auto mb-2" />
                      <p className="text-sm font-medium">Processing with AI...</p>
                      <p className="text-xs text-gray-500">{processingType}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No image uploaded
                </h3>
                <p className="text-gray-500 mb-4">
                  Go back to upload an image to start editing
                </p>
                <Button onClick={() => navigate('/')}>
                  Upload Image
                </Button>
              </div>
            )}
          </div>

          {/* Bottom Toolbar */}
          <div className="bg-white border-t p-4">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {uploadedImage ? 'Image loaded' : 'No image'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleReset}
                  disabled={!processedImage}
                >
                  Reset
                </Button>
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-blue-600"
                  disabled={!uploadedImage || isProcessing}
                  onClick={() => handleProcessing('enhance')}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Auto Enhance
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}