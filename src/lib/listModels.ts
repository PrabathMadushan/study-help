/**
 * Simple browser script to list Gemini models
 * Add this as a dev page or run in browser console
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

export async function listGeminiModels() {
  if (!apiKey) {
    console.error('❌ VITE_GEMINI_API_KEY not set in .env')
    return []
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  
  try {
    const models = await genAI.listModels()
    
    console.log(`\n🔍 Found ${models.length} Gemini models:\n`)
    
    const modelsList = models.map(model => ({
      id: model.name.replace('models/', ''),
      displayName: model.displayName,
      description: model.description,
      methods: model.supportedGenerationMethods || [],
      inputTokens: model.inputTokenLimit,
      outputTokens: model.outputTokenLimit
    }))
    
    // Log in a nice table format
    console.table(modelsList)
    
    // Filter models that support audio (generateContent)
    const audioModels = modelsList.filter(m => 
      m.methods.includes('generateContent') && 
      (m.id.includes('flash') || m.id.includes('pro'))
    )
    
    console.log('\n✅ Recommended for audio transcription:\n')
    audioModels.forEach(m => {
      console.log(`   📦 ${m.id}`)
      console.log(`      ${m.description || 'No description'}`)
      console.log(`      Tokens: ${m.inputTokens?.toLocaleString() || 'N/A'} input, ${m.outputTokens?.toLocaleString() || 'N/A'} output\n`)
    })
    
    return modelsList
  } catch (error) {
    console.error('❌ Error fetching models:', error)
    return []
  }
}

// For development: run this function
if (import.meta.env.DEV) {
  console.log('💡 Call listGeminiModels() in console to see all available models')
  // Uncomment to auto-run on dev server start:
  // listGeminiModels()
}
