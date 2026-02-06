#!/usr/bin/env node

/**
 * List all available Gemini models using REST API
 * Usage: node list-models-rest.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to read API key from .env file
let apiKey = process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  try {
    const envPath = join(__dirname, '.env');
    const envContent = readFileSync(envPath, 'utf8');
    const match = envContent.match(/VITE_GEMINI_API_KEY=(.+)/);
    if (match) {
      apiKey = match[1].trim();
    }
  } catch (err) {
    // .env file not found
  }
}

if (!apiKey) {
  console.error('❌ Error: VITE_GEMINI_API_KEY not found');
  console.error('\n💡 Get your key at: https://aistudio.google.com/apikey');
  process.exit(1);
}

async function listModels() {
  try {
    console.log('🔍 Fetching available Gemini models via REST API...\n');
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    const models = data.models || [];
    
    console.log(`📊 Found ${models.length} models:\n`);
    console.log('='.repeat(100));
    
    const audioCompatibleModels = [];
    
    for (const model of models) {
      const modelId = model.name.replace('models/', '');
      
      console.log(`\n📦 ${modelId}`);
      console.log(`   Display Name: ${model.displayName || 'N/A'}`);
      console.log(`   Description: ${model.description || 'N/A'}`);
      
      if (model.supportedGenerationMethods && model.supportedGenerationMethods.length > 0) {
        console.log(`   ✅ Methods: ${model.supportedGenerationMethods.join(', ')}`);
        
        // Check if it supports generateContent (needed for audio)
        if (model.supportedGenerationMethods.includes('generateContent')) {
          audioCompatibleModels.push(modelId);
        }
      }
      
      if (model.inputTokenLimit) {
        console.log(`   📥 Input Limit: ${model.inputTokenLimit.toLocaleString()} tokens`);
      }
      
      if (model.outputTokenLimit) {
        console.log(`   📤 Output Limit: ${model.outputTokenLimit.toLocaleString()} tokens`);
      }
      
      console.log('─'.repeat(100));
    }
    
    // Summary
    console.log('\n\n📋 MODELS FOR AUDIO TRANSCRIPTION:');
    console.log('='.repeat(100));
    
    if (audioCompatibleModels.length > 0) {
      console.log('\n✅ These models support generateContent (can process audio):\n');
      audioCompatibleModels.forEach(id => {
        const model = models.find(m => m.name.includes(id));
        console.log(`   • ${id}`);
        if (model?.description) {
          console.log(`     ${model.description}`);
        }
        console.log('');
      });
    }
    
    console.log('\n💡 RECOMMENDATION FOR AUDIO TRANSCRIPTION:\n');
    console.log('   Use: gemini-1.5-flash or gemini-1.5-pro');
    console.log('   These models support multimodal input including audio\n');
    
    console.log('\n📖 Usage in your code:\n');
    console.log(`
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(apiKey)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

// Transcribe audio
const result = await model.generateContent([
  {
    inlineData: {
      mimeType: 'audio/webm',
      data: base64AudioData
    }
  },
  { text: 'Please transcribe this audio' }
])

const transcript = result.response.text()
    `);
    
    console.log('\n' + '='.repeat(100) + '\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('401') || error.message.includes('403')) {
      console.error('\n💡 Invalid API key. Get a new one at: https://aistudio.google.com/apikey');
    }
  }
}

listModels();
