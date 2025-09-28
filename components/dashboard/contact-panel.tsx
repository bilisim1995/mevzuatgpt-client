"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, Mail } from 'lucide-react'

interface ContactPanelProps {
  onClose: () => void
}

export function ContactPanel({ onClose }: ContactPanelProps) {
  const [captchaCode, setCaptchaCode] = useState('A7B9')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    captcha: ''
  })

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-white/20 dark:border-slate-700/30 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                İletişim
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Bize ulaşın
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 p-6">
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
    </div>
  )
}
