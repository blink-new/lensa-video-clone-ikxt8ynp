import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Trash2, 
  Camera,
  Grid3X3,
  List,
  Search,
  Filter,
  Plus
} from 'lucide-react'

export default function GalleryPage() {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  // Mock gallery data
  const galleryItems = [
    {
      id: '1',
      original: 'Original Portrait',
      enhanced: 'AI Enhanced Portrait',
      type: 'Face Retouch',
      date: '2024-01-20',
      size: '1920x1080'
    },
    {
      id: '2',
      original: 'Landscape Photo',
      enhanced: 'Enhanced Landscape',
      type: 'Background Blur',
      date: '2024-01-19',
      size: '2048x1536'
    },
    {
      id: '3',
      original: 'Group Photo',
      enhanced: 'Object Removed',
      type: 'Object Removal',
      date: '2024-01-18',
      size: '1600x1200'
    },
    {
      id: '4',
      original: 'Selfie',
      enhanced: 'AI Avatar',
      type: 'AI Avatar',
      date: '2024-01-17',
      size: '1080x1080'
    },
    {
      id: '5',
      original: 'Street Photo',
      enhanced: 'Vintage Filter',
      type: 'AI Filters',
      date: '2024-01-16',
      size: '1920x1280'
    },
    {
      id: '6',
      original: 'Nature Shot',
      enhanced: 'Cinematic Look',
      type: 'AI Filters',
      date: '2024-01-15',
      size: '2560x1440'
    }
  ]

  const toggleImageSelection = (id: string) => {
    setSelectedImages(prev => 
      prev.includes(id) 
        ? prev.filter(imgId => imgId !== id)
        : [...prev, id]
    )
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Face Retouch': return 'bg-purple-100 text-purple-700'
      case 'Object Removal': return 'bg-blue-100 text-blue-700'
      case 'Background Blur': return 'bg-green-100 text-green-700'
      case 'AI Filters': return 'bg-pink-100 text-pink-700'
      case 'AI Avatar': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

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
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/')}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Edit
              </Button>
              
              {selectedImages.length > 0 && (
                <>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download ({selectedImages.length})
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Gallery</h1>
          <p className="text-gray-600">
            {galleryItems.length} enhanced photos
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search photos..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Gallery Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {galleryItems.map((item) => (
              <Card 
                key={item.id} 
                className={`group cursor-pointer transition-all hover:shadow-lg ${
                  selectedImages.includes(item.id) ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => toggleImageSelection(item.id)}
              >
                <CardContent className="p-0">
                  {/* Before/After Images */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-lg overflow-hidden">
                    <div className="absolute inset-0 flex">
                      <div className="w-1/2 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                        <span className="text-xs text-gray-600">Before</span>
                      </div>
                      <div className="w-1/2 bg-gradient-to-br from-purple-200 to-blue-200 flex items-center justify-center">
                        <span className="text-xs text-purple-700">After</span>
                      </div>
                    </div>
                    
                    {/* Selection Indicator */}
                    {selectedImages.includes(item.id) && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    )}
                    
                    {/* Type Badge */}
                    <Badge className={`absolute top-2 left-2 ${getTypeColor(item.type)}`}>
                      {item.type}
                    </Badge>
                  </div>
                  
                  {/* Image Info */}
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1 truncate">
                      {item.enhanced}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{item.date}</span>
                      <span>{item.size}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {galleryItems.map((item) => (
              <Card 
                key={item.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedImages.includes(item.id) ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => toggleImageSelection(item.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Camera className="w-6 h-6 text-purple-600" />
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {item.enhanced}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {item.original}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <Badge className={`${getTypeColor(item.type)} text-xs`}>
                          {item.type}
                        </Badge>
                        <span className="text-xs text-gray-500">{item.date}</span>
                        <span className="text-xs text-gray-500">{item.size}</span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {galleryItems.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No photos yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start by uploading and enhancing your first photo
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-600 to-blue-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload Photo
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}