"use client"
import { AvaliacaoProvider } from "@/contexts/avaliacao-context"
import { Providers } from "@/components/providers"
import PTSForm from "@/components/pts-form"

export default function AvaliacaoPage() {
  return (
    <Providers>
      <AvaliacaoProvider>
        <PTSForm />
      </AvaliacaoProvider>
    </Providers>
  )
}
