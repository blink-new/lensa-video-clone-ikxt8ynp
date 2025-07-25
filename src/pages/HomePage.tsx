import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  Sparkles, 
  Eraser, 
  Focus, 
  Palette, 
  User, 
  Download,
  Star,
  ArrowRight,
  Camera,
  Zap,
  Shield,
  Clock
} from 'lucide-react'

export default function HomePage() {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const handleFiles = (files: FileList) => {
    const file = files[0]
    if (file && file.type.startsWith('image/')) {
      // Navigate to editor with the uploaded file
      navigate('/editor', { state: { uploadedFile: file } })
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  const features = [
    {
      icon: Sparkles,
      title: "AI Face Retouch",
      description: "Professional face enhancement with one tap",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: Eraser,
      title: "Object Removal",
      description: "Remove unwanted objects seamlessly",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Focus,
      title: "Background Blur",
      description: "Create stunning bokeh effects",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Palette,
      title: "Trendy Filters",
      description: "Apply Instagram-worthy filters",
      color: "bg-pink-100 text-pink-600"
    },
    {
      icon: User,
      title: "AI Avatars",
      description: "Generate unique digital avatars",
      color: "bg-orange-100 text-orange-600"
    },
    {
      icon: Download,
      title: "HD Downloads",
      description: "Export in high quality formats",
      color: "bg-indigo-100 text-indigo-600"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Content Creator",
      content: "Lensa AI has completely transformed my photo editing workflow. The results are incredible!",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      role: "Photographer",
      content: "The AI face retouch feature saves me hours of manual editing. It's like magic!",
      rating: 5
    },
    {
      name: "Emma Thompson",
      role: "Social Media Manager",
      content: "Perfect for creating consistent, professional-looking content for our brand.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Lensa AI
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Reviews</a>
              <Button variant="outline" size="sm">Sign In</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-purple-100 text-purple-700 hover:bg-purple-200">
            <Zap className="w-4 h-4 mr-1" />
            AI-Powered Photo Enhancement
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Your Photos with
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent block">
              AI Magic
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Professional photo editing made simple. Upload your photo and let our AI create stunning results in seconds.
          </p>

          {/* Upload Area */}
          <div className="max-w-lg mx-auto mb-8">
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-200 ${
                dragActive 
                  ? 'border-primary bg-primary/5 scale-105' 
                  : 'border-gray-300 hover:border-primary hover:bg-primary/5'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleChange}
              />
              
              <div className="text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Drop your photo here
                </h3>
                <p className="text-gray-500 mb-4">
                  or click to browse from your device
                </p>
                <Button 
                  onClick={onButtonClick}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Choose Photo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-6 mt-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                Secure
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Instant
              </div>
              <div className="flex items-center">
                <Sparkles className="w-4 h-4 mr-1" />
                AI-Powered
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful AI Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to create stunning photos with professional results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Section */}
      <section className="py-20 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              See the Magic in Action
            </h2>
            <p className="text-xl text-gray-600">
              Real results from our AI-powered photo enhancement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative group">
              <div className="aspect-square bg-gray-200 rounded-2xl overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <span className="text-gray-600 font-medium">Before</span>
                </div>
              </div>
              <Badge className="absolute top-4 left-4 bg-red-100 text-red-700">
                Original
              </Badge>
            </div>
            
            <div className="relative group">
              <div className="aspect-square bg-gray-200 rounded-2xl overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-purple-200 to-blue-200 flex items-center justify-center">
                  <span className="text-purple-700 font-medium">After</span>
                </div>
              </div>
              <Badge className="absolute top-4 left-4 bg-green-100 text-green-700">
                AI Enhanced
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Creators
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied users
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Photos?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join millions of users creating stunning photos with AI
          </p>
          <Button 
            size="lg" 
            onClick={onButtonClick}
            className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-3"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Lensa AI</span>
              </div>
              <p className="text-gray-400">
                AI-powered photo editing made simple and accessible for everyone.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Face Retouch</li>
                <li>Object Removal</li>
                <li>Background Blur</li>
                <li>AI Filters</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About</li>
                <li>Privacy</li>
                <li>Terms</li>
                <li>Support</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Twitter</li>
                <li>Instagram</li>
                <li>Facebook</li>
                <li>LinkedIn</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Lensa AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}