import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/app/_user/gallery')({
  component: RouteComponent,
})

interface Photo {
  id: string
  url: string
  date: string
}

function RouteComponent() {
  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
      date: '2026-01-15',
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400',
      date: '2026-01-20',
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400',
      date: '2026-01-25',
    },
  ])

  const handleUpload = () => {
    // Create a file input element
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true

    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files) {
        Array.from(files).forEach((file) => {
          const reader = new FileReader()
          reader.onload = (event) => {
            const newPhoto: Photo = {
              id: Date.now().toString() + Math.random(),
              url: event.target?.result as string,
              date: new Date().toISOString().split('T')[0],
            }
            setPhotos((prev) => [newPhoto, ...prev])
          }
          reader.readAsDataURL(file)
        })
      }
    }

    input.click()
  }

  const handleDelete = (id: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id))
  }

  return (
    <div className="p-4 space-y-6 pb-32">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-2xl font-bold">Gallery</h1>
        <p className="text-muted-foreground">Your progress photos</p>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-2 gap-4">
        {photos.map((photo) => (
          <Card key={photo.id} className="relative overflow-hidden group">
            <img
              src={photo.url}
              alt="Progress photo"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(photo.id)}
              >
                <X className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2">
              {new Date(photo.date).toLocaleDateString()}
            </div>
          </Card>
        ))}
      </div>

      {/* Upload Button - Fixed above navbar */}
      <div className="fixed bottom-20 left-0 right-0 flex justify-center pb-4">
        <Button
          onClick={handleUpload}
          size="lg"
          className="rounded-full shadow-lg px-8"
        >
          <Upload className="w-5 h-5 mr-2" />
          Upload Photo
        </Button>
      </div>
    </div>
  )
}
