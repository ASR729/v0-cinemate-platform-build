'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { OnboardingProgress } from '@/components/cinemate/OnboardingProgress'
import { Step1Profile } from '@/components/onboarding/Step1Profile'
import { Step2Genres } from '@/components/onboarding/Step2Genres'
import { Step3Movies } from '@/components/onboarding/Step3Movies'
import { Step4Series } from '@/components/onboarding/Step4Series'
import { Step5Storytelling } from '@/components/onboarding/Step5Storytelling'
import { Step6Emotional } from '@/components/onboarding/Step6Emotional'
import { CompletionScreen } from '@/components/onboarding/CompletionScreen'
import {
  OnboardingData,
  INITIAL_ONBOARDING_DATA,
  TOTAL_ONBOARDING_STEPS,
  STEP_LABELS,
} from '@/lib/onboarding/store'
import { updateUserProfile } from '@/lib/firebase/firestore'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<OnboardingData>(INITIAL_ONBOARDING_DATA)
  const [completed, setCompleted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const update = (partial: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...partial }))
  }

  const next = () => setStep(s => Math.min(s + 1, TOTAL_ONBOARDING_STEPS))
  const back = () => setStep(s => Math.max(s - 1, 1))

  const handleFinish = async () => {
    setSubmitting(true)
    try {
      // Persist to Firestore (or mock store)
      // In production, get the real uid from the auth context
      const mockUid = `user_${Date.now()}`
      await updateUserProfile(mockUid, {
        displayName: data.displayName,
        username: data.username,
        genres: data.genres,
        favoriteMovies: data.favoriteMovieIds.map(id => ({
          id,
          title: data.favoriteMovieTitles[id] || '',
          posterPath: data.favoriteMoviePosters[id] || null,
          releaseYear: data.favoriteMovieYears[id] || '',
          rating: 0,
        })),
        favoriteSeries: data.favoriteSeriesIds.map(id => ({
          id,
          title: data.favoriesSeriesTitles[id] || '',
          posterPath: data.favoriteSeriesPosters[id] || null,
          releaseYear: data.favoriteSeriesYears[id] || '',
          rating: 0,
        })),
        storytellingInterests: data.storytellingInterests,
        emotionalPreferences: data.emotionalPreferences,
        onboardingCompleted: true,
      })
    } catch (e) {
      console.error('[v0] Onboarding save error:', e)
    } finally {
      setSubmitting(false)
      setCompleted(true)
    }
  }

  if (completed) {
    return <CompletionScreen displayName={data.displayName} />
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Progress */}
        <div className="mb-10">
          <OnboardingProgress
            currentStep={step}
            totalSteps={TOTAL_ONBOARDING_STEPS}
            stepLabel={STEP_LABELS[step - 1]}
          />
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <Step1Profile key="step1" data={data} onUpdate={update} onNext={next} />
          )}
          {step === 2 && (
            <Step2Genres key="step2" data={data} onUpdate={update} onNext={next} onBack={back} />
          )}
          {step === 3 && (
            <Step3Movies key="step3" data={data} onUpdate={update} onNext={next} onBack={back} />
          )}
          {step === 4 && (
            <Step4Series key="step4" data={data} onUpdate={update} onNext={next} onBack={back} />
          )}
          {step === 5 && (
            <Step5Storytelling key="step5" data={data} onUpdate={update} onNext={next} onBack={back} />
          )}
          {step === 6 && (
            <Step6Emotional
              key="step6"
              data={data}
              onUpdate={update}
              onFinish={handleFinish}
              onBack={back}
              submitting={submitting}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
