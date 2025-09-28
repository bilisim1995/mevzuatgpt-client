"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ContactModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContactModal({ open, onOpenChange }: ContactModalProps) {
  const [captchaCode, setCaptchaCode] = useState('A7B9')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    captcha: ''
  })

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Modalı kapat
      onOpenChange(false)
      
      // DOM'u temizle - setTimeout ile gecikme
      setTimeout(() => {
        // Body'yi tamamen sıfırla
        document.body.style.overflow = ''
        document.body.style.pointerEvents = ''
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.left = ''
        document.body.style.right = ''
        document.body.style.bottom = ''
        document.body.style.width = ''
        document.body.style.height = ''
        document.body.style.zIndex = ''
        
        // DocumentElement'i sıfırla
        document.documentElement.style.overflow = ''
        document.documentElement.style.pointerEvents = ''
        document.documentElement.style.position = ''
        document.documentElement.style.zIndex = ''
        
        // Tüm modal class'larını kaldır
        document.body.classList.remove('overflow-hidden', 'fixed', 'modal-open')
        document.documentElement.classList.remove('overflow-hidden', 'fixed', 'modal-open')
        
        // Tüm modal elementlerini kaldır
        const overlays = document.querySelectorAll('[data-radix-dialog-overlay]')
        overlays.forEach(overlay => {
          if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay)
          }
        })
        
        const portals = document.querySelectorAll('[data-radix-portal]')
        portals.forEach(portal => {
          if (portal.querySelector('[data-radix-dialog-content]') && portal.parentNode) {
            portal.parentNode.removeChild(portal)
          }
        })
        
        // Body'yi yeniden aktif hale getir
        document.body.style.pointerEvents = 'auto'
        document.documentElement.style.pointerEvents = 'auto'
        
        // Scroll'u geri yükle
        document.body.style.overflow = 'auto'
        document.documentElement.style.overflow = 'auto'
        
        // Focus'u geri yükle
        if (document.activeElement && document.activeElement !== document.body) {
          (document.activeElement as HTMLElement).blur()
        }
        document.body.focus()
        
        // Force reflow
        document.body.offsetHeight
        
      }, 300)
    } else {
      onOpenChange(newOpen)
    }
  }

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCaptchaCode(result)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.captcha.toUpperCase() !== captchaCode) {
      alert('Güvenlik kodunu yanlış girdiniz!')
      return
    }
    // Form gönderme işlemi burada yapılacak
    alert('Mesajınız başarıyla gönderildi!')
    setFormData({ name: '', email: '', subject: '', message: '', captcha: '' })
    generateCaptcha()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl w-[80vw] h-[70vh] max-h-[70vh] p-0 m-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg dark:rounded-xl">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  Bize Ulaşın
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenChange(false)}
                  className="h-8 px-3 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  Kapat
                </Button>
              </div>
            </DialogHeader>
          </div>
          
          <div className="flex-1 min-h-0 p-2 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="space-y-6">
                {/* İletişim Formu */}
                <div className="max-w-2xl mx-auto">
                  <div className="space-y-4">
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">E-posta:</span> 
                          <a href="mailto:info@mevzuatgpt.org" className="text-blue-600 dark:text-blue-400 hover:underline font-medium ml-1">
                            info@mevzuatgpt.org
                          </a>
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Ad Soyad *
                          </label>
                          <Input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder="Adınız ve soyadınız"
                            className="w-full"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            E-posta *
                          </label>
                          <Input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="ornek@email.com"
                            className="w-full"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Konu *
                        </label>
                        <Input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          placeholder="Mesaj konusu"
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Mesaj *
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={4}
                          placeholder="Mesajınızı buraya yazın..."
                          className="w-full"
                        />
                      </div>
                      
                      {/* Güvenlik Doğrulaması */}
                      <div>
                        <label htmlFor="captcha" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Güvenlik Doğrulaması *
                        </label>
                        <div className="flex items-center space-x-3">
                          <Input
                            type="text"
                            id="captcha"
                            name="captcha"
                            value={formData.captcha}
                            onChange={handleInputChange}
                            required
                            placeholder="Kod"
                            className="w-24"
                          />
                          <div className="flex items-center justify-center w-20 h-10 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-sm font-mono text-gray-800 dark:text-gray-200">
                            {captchaCode}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={generateCaptcha}
                            className="text-xs"
                          >
                            Yenile
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Yukarıdaki kodu aşağıdaki alana girin.
                        </p>
                      </div>
                      
                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-200"
                      >
                        Mesajı Gönder
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
