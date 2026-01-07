"use client"
import React, { useState } from 'react'
import { Typography } from '../ui/typography'
import { Card } from '../ui/card'
import { Loader2, Star } from "lucide-react"
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { toast } from 'sonner'

interface AvisFormProps {
    heading: string
    sub_heading: string
    note_experience_text: string
    note_placeholder: string
    input_avis: InputAVI[]
    button: Button
    textarea_placeholder: string
}

interface Button {
    text: string
}

interface InputAVI {
    type: string
    name: string
    placeholder: string
}

export function AvisForm(props: AvisFormProps) {
    const [note, setNote] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState<Record<string, string>>({})
    const backendRoute = process.env.NEXT_PUBLIC_API_URL

    const handleStarClick = (starValue: number) => {
        setNote(starValue)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Préparation des données pour Strapi
        const payload = {
            data: {
                ...formData,
                note,
                description: [
                    {
                        type: "paragraph",
                        children: [
                            { type: "text", text: formData.description || "" }
                        ],
                    },
                ],
            }
        }

        try {
            const response = await fetch(`${backendRoute}/api/avis-clients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })

            if (response.ok) {
                setNote(0)
                setFormData({})
                toast.success('Merci pour votre avis !')
            } else {
                const errorData = await response.json();
                console.error('Erreur Strapi:', errorData);
                toast.error('Une erreur est survenue lors de l\'enregistrement')
            }
        } catch (error) {
            console.error('Erreur réseau:', error)
            toast.error('Erreur de connexion au serveur')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className='min-h-screen w-full px-4 py-8 flex flex-col items-center justify-center'>
            <div className='flex flex-col space-y-1 text-center mb-8'>
                <Typography variant='h2' className='font-bold'>{props.heading}</Typography>
                <Typography variant='p'>{props.sub_heading}</Typography>
            </div>

            <Card className='w-full max-w-5xl p-6 md:p-8'>
                <div className='flex flex-col space-y-8'>
                    <Typography variant='p' className='text-center text-lg'>{props.note_experience_text}</Typography>

                    <div className='flex justify-center gap-4'>
                        {[1, 2, 3, 4, 5].map((starValue) => (
                            <button
                                key={starValue}
                                type='button'
                                onClick={() => handleStarClick(starValue)}
                                className='transition-all hover:scale-110'
                            >
                                <Star
                                    size={48}
                                    className={`transition-colors ${starValue <= note
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-4 w-full p-8'>
                        {props.input_avis.map((input, index) =>
                            index === 0 ? (
                                <Textarea
                                    key={index}
                                    name={input.name}
                                    placeholder={input.placeholder}
                                    value={formData[input.name] || ''}
                                    onChange={handleInputChange}
                                    className='min-h-40 resize-none'
                                    required
                                />
                            ) : (
                                <div
                                    className='flex flex-colgap-2'
                                >
                                    <Input
                                        key={index}
                                        type={input.type}
                                        name={input.name}
                                        placeholder={input.placeholder}
                                        value={formData[input.name] || ''}
                                        onChange={handleInputChange}
                                        required={input.name !== 'entreprise_name'}
                                    />
                                </div>
                            )
                        )}

                        <Button
                            variant='default'
                            className='w-full text-center text-white bg-primary py-3'
                            type='submit'
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <span className="flex justify-center items-center"> <Loader2 className="animate-spin" /> Envoi en cours...</span> : props.button.text}
                        </Button>

                        <div className="flex justify-center items-center">
                            <Typography as='span' className='text-center'>
                                {props.textarea_placeholder}
                            </Typography>
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    )
}