"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock, MessageSquare, Users, Headphones, Building } from "lucide-react"

const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Get help via email within 24 hours",
    contact: "support@mashub.com",
    availability: "24/7",
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak directly with our support team",
    contact: "+1 (555) 123-4567",
    availability: "Mon-Fri 9AM-6PM EST",
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Real-time chat support for urgent issues",
    contact: "Available in dashboard",
    availability: "Mon-Fri 9AM-6PM EST",
  },
  {
    icon: Users,
    title: "Community Forum",
    description: "Connect with other developers and users",
    contact: "community.maschain.com",
    availability: "24/7",
  },
]

const offices = [
  {
    city: "Kuala Lumpur",
    country: "Malaysia",
    address: "Level 10, Menara UOA Bangsar\nNo. 5, Jalan Bangsar Utama 1\n59000 Kuala Lumpur",
    phone: "+60 3-2201 1234",
    email: "kl@maschain.com",
  },
  {
    city: "Singapore",
    country: "Singapore",
    address: "1 Raffles Place\n#20-61 One Raffles Place\nSingapore 048616",
    phone: "+65 6123 4567",
    email: "sg@maschain.com",
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    inquiryType: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Have questions about MAS Hub? Need help with integration? Our team is here to support you every step of the
            way.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How Can We Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <method.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{method.title}</CardTitle>
                  <CardDescription>{method.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">{method.contact}</p>
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {method.availability}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Office Info */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                  <CardDescription>Fill out the form below and we'll get back to you within 24 hours.</CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                      <p className="text-gray-600">
                        Thank you for contacting us. We'll get back to you within 24 hours.
                      </p>
                      <Button
                        className="mt-4"
                        onClick={() => {
                          setIsSubmitted(false)
                          setFormData({
                            name: "",
                            email: "",
                            company: "",
                            subject: "",
                            message: "",
                            inquiryType: "",
                          })
                        }}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            value={formData.company}
                            onChange={(e) => handleInputChange("company", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="inquiryType">Inquiry Type</Label>
                          <Select
                            value={formData.inquiryType}
                            onValueChange={(value) => handleInputChange("inquiryType", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select inquiry type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General Inquiry</SelectItem>
                              <SelectItem value="technical">Technical Support</SelectItem>
                              <SelectItem value="sales">Sales</SelectItem>
                              <SelectItem value="partnership">Partnership</SelectItem>
                              <SelectItem value="integration">Integration Help</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => handleInputChange("subject", e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          rows={6}
                          value={formData.message}
                          onChange={(e) => handleInputChange("message", e.target.value)}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Office Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Offices</h2>
                <div className="space-y-6">
                  {offices.map((office, index) => (
                    <Card key={index} className="border-0 shadow-lg">
                      <CardHeader>
                        <div className="flex items-center mb-2">
                          <Building className="h-5 w-5 text-blue-600 mr-2" />
                          <CardTitle className="text-lg">
                            {office.city}, {office.country}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-1 flex-shrink-0" />
                          <p className="text-sm text-gray-600 whitespace-pre-line">{office.address}</p>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          <p className="text-sm text-gray-600">{office.phone}</p>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          <p className="text-sm text-gray-600">{office.email}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Enterprise Support */}
              <Card className="border-0 shadow-lg bg-blue-50">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <Headphones className="h-5 w-5 text-blue-600 mr-2" />
                    <CardTitle className="text-lg">Enterprise Support</CardTitle>
                  </div>
                  <CardDescription>Need dedicated support for your enterprise deployment?</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Get priority support, dedicated account management, and custom SLA agreements for your enterprise
                    needs.
                  </p>
                  <Button className="w-full">Contact Enterprise Sales</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
