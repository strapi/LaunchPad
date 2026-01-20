'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { IconCheck, IconStar } from '@tabler/icons-react';

const orderTypes = [
  {
    id: 'signed-hardcover',
    name: 'Signed Hardcover',
    price: 49.95,
    badge: 'Limited',
    description: 'Personally signed by Dr. Sung with custom message',
    features: ['Hand-signed dedication', 'Premium hardcover', 'Free shipping', 'Digital extras'],
  },
  {
    id: 'hardcover',
    name: 'Hardcover',
    price: 29.95,
    description: 'Premium hardcover edition',
    features: ['Hardcover edition', 'Fast shipping', 'Digital extras'],
  },
  {
    id: 'ebook',
    name: 'eBook',
    price: 19.95,
    description: 'Instant digital access',
    features: ['Instant download', 'PDF, ePub, Mobi', 'Searchable text', 'Digital extras'],
  },
  {
    id: 'bundle',
    name: 'Complete Bundle',
    price: 59.95,
    badge: 'Best Value',
    description: 'Signed hardcover + eBook + bonus content',
    features: ['Everything included', 'Signed hardcover', 'All digital formats', 'Exclusive bonus chapter'],
  },
];

export function PreorderSection() {
  const [selectedType, setSelectedType] = useState('signed-hardcover');
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    personalizationMessage: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  const selectedOrder = orderTypes.find((type) => type.id === selectedType);
  const totalAmount = selectedOrder ? selectedOrder.price * quantity : 0;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const shippingAddress = needsShipping ? {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
      } : null;

      const response = await fetch('/api/book/preorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderType: selectedType,
          quantity,
          fullName: formData.fullName,
          email: formData.email,
          personalizationMessage: formData.personalizationMessage,
          shippingAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(`Error: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  const needsShipping = selectedType !== 'ebook';
  const needsPersonalization = selectedType === 'signed-hardcover' || selectedType === 'bundle';

  return (
    <section id="preorder" className="py-24 bg-white dark:bg-charcoal">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Pre-Order Now</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
              Reserve Your Copy
            </h2>
            <p className="text-xl text-neutral-600 dark:text-gray-300">
              Be among the first to receive The Secure Base when it launches
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Order Type Selection */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Pricing Cards */}
              <RadioGroup value={selectedType} onValueChange={setSelectedType}>
                <div className="grid sm:grid-cols-2 gap-4">
                  {orderTypes.map((type) => (
                    <label key={type.id} className="cursor-pointer">
                      <Card 
                        className={`relative transition-all h-full ${
                          selectedType === type.id 
                            ? 'border-2 border-cyan-500 shadow-lg' 
                            : 'border-2 border-neutral-200 dark:border-neutral-800 hover:border-cyan-500/50'
                        }`}
                      >
                        {type.badge && (
                          <div className="absolute top-4 right-4">
                            <Badge variant="secondary" className="bg-cyan-500 text-white">
                              {type.badge}
                            </Badge>
                          </div>
                        )}
                        
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value={type.id} id={type.id} />
                            <div>
                              <CardTitle className="text-xl">{type.name}</CardTitle>
                              <CardDescription className="text-2xl font-bold text-cyan-500 mt-1">
                                ${type.price}
                              </CardDescription>
                            </div>
                          </div>
                          <p className="text-sm text-neutral-600 dark:text-gray-400 mt-2">
                            {type.description}
                          </p>
                        </CardHeader>
                        
                        <CardContent>
                          <ul className="space-y-2">
                            {type.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm">
                                <IconCheck className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </label>
                  ))}
                </div>
              </RadioGroup>

              {/* Order Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Basic Info */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        max="10"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-24"
                      />
                    </div>

                    {/* Personalization (for signed copies) */}
                    {needsPersonalization && (
                      <div className="space-y-2">
                        <Label htmlFor="personalization">
                          Personalization Message
                          <span className="text-sm text-neutral-500 ml-2">(Optional, max 50 chars)</span>
                        </Label>
                        <Input
                          id="personalization"
                          maxLength={50}
                          placeholder="e.g., 'To Sarah, Keep leading with courage!'"
                          value={formData.personalizationMessage}
                          onChange={(e) => setFormData({ ...formData, personalizationMessage: e.target.value })}
                        />
                      </div>
                    )}

                    {/* Shipping Address */}
                    {needsShipping && (
                      <div className="space-y-4 pt-4 border-t">
                        <h4 className="font-semibold">Shipping Address</h4>
                        
                        <div className="space-y-2">
                          <Label htmlFor="address">Street Address *</Label>
                          <Input
                            id="address"
                            required
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          />
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City *</Label>
                            <Input
                              id="city"
                              required
                              value={formData.city}
                              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State *</Label>
                            <Input
                              id="state"
                              required
                              value={formData.state}
                              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="zip">ZIP Code *</Label>
                            <Input
                              id="zip"
                              required
                              value={formData.zip}
                              onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="country">Country *</Label>
                          <Input
                            id="country"
                            required
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          />
                        </div>
                      </div>
                    )}

                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Processing...' : 'Continue to Payment'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600 dark:text-gray-400">Item</span>
                      <span className="font-medium">{selectedOrder?.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600 dark:text-gray-400">Quantity</span>
                      <span className="font-medium">{quantity}</span>
                    </div>
                    {needsShipping && (
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600 dark:text-gray-400">Shipping</span>
                        <span className="font-medium text-green-600">FREE</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-cyan-500">${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-cyan-50 dark:bg-cyan-950/30 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <IconStar className="w-4 h-4 text-cyan-500" />
                      <span>Pre-Order Benefits</span>
                    </div>
                    <ul className="text-sm space-y-1 text-neutral-600 dark:text-gray-400">
                      <li>• Priority delivery</li>
                      <li>• Exclusive digital extras</li>
                      <li>• Launch day webinar invite</li>
                    </ul>
                  </div>

                  <p className="text-xs text-neutral-500 dark:text-gray-500">
                    Secure payment via Stripe. Your card will be charged when the book ships.
                  </p>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
