"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form gönderme işlemi burada yapılacak
    alert('Mesajınız başarıyla gönderildi!')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">E-posta:</span> 
              <a href="mailto:info@mevzuatgpt.org" className="text-blue-600 dark:text-blue-400 hover:underline font-medium ml-1">
                info@mevzuatgpt.org
              </a>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Adres:</span> 
              <span className="ml-1">
                Finans Plaza D:32, No:14 Gevher Nesibe Mahallesi Gök Geçidi Sokak, Kocasinan, Kayseri 38010, Türkiye
              </span>
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
              className="h-10 text-sm border-2 border-gray-200 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 rounded-xl bg-white dark:bg-gray-800"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
              className="h-10 text-sm border-2 border-gray-200 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 rounded-xl bg-white dark:bg-gray-800"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
            className="h-10 text-sm border-2 border-gray-200 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 rounded-xl bg-white dark:bg-gray-800"
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
            className="border-2 border-gray-200 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 rounded-xl bg-white dark:bg-gray-800"
          />
        </div>
        
        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-xl transition duration-200"
        >
          Mesajı Gönder
        </Button>
      </form>
    </div>
  )
}
