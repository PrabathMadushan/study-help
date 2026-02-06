#!/usr/bin/env node

/**
 * Script to list all available Gemini models and their capabilities
 * Usage: VITE_GEMINI_API_KEY=your_key node list-gemini-models.js
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
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
    // .env file not found, continue
  }
}

if (!apiKey) {
  console.error('❌ Error: VITE_GEMINI_API_KEY not found');
  console.error('\nOptions:');
  console.error('  1. Set as environment variable: VITE_GEMINI_API_KEY=your_key node list-gemini-models.js');
  console.error('  2. Add to .env file: VITE_GEMINI_API_KEY=your_key');
  console.error('\n💡 Get your key at: https://aistudio.google.com/apikey');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    console.log('🔍 Fetching available Gemini models...\n');
    
    // List all models
    const models = await genAI.listModels();
    
    console.log(`📊 Found ${models.length} models:\n`);
    console.log('='.repeat(80));
    
    for (const model of models) {
      console.log(`\n📦 Model: ${model.name}`);
      console.log(`   Display Name: ${model.displayName}`);
      console.log(`   Description: ${model.description}`);
      
      if (model.supportedGenerationMethods && model.supportedGenerationMethods.length > 0) {
        console.log(`   ✅ Supported Methods: ${model.supportedGenerationMethods.join(', ')}`);
      }
      
      if (model.inputTokenLimit) {
        console.log(`   📥 Input Token Limit: ${model.inputTokenLimit.toLocaleString()}`);
      }
      
      if (model.outputTokenLimit) {
        console.log(`   📤 Output Token Limit: ${model.outputTokenLimit.toLocaleString()}`);
      }
      
      // Check for multimodal support
      const supportsAudio = model.name.includes('audio') || model.description?.toLowerCase().includes('audio');
      const supportsVideo = model.name.includes('video') || model.description?.toLowerCase().includes('video');
      const supportsImages = model.name.includes('vision') || model.description?.toLowerCase().includes('image');
      
      if (supportsAudio || supportsVideo || supportsImages) {
        const capabilities = [];
        if (supportsAudio) capabilities.push('🎤 Audio');
        if (supportsVideo) capabilities.push('🎥 Video');
        if (supportsImages) capabilities.push('🖼️  Images');
        console.log(`   Multimodal: ${capabilities.join(', ')}`);
      }
      
      console.log('─'.repeat(80));
    }
    
    console.log('\n\n📋 Summary - Models for Audio Transcription:');
    console.log('='.repeat(80));
    
    const audioModels = models.filter(m => 
      m.supportedGenerationMethods?.includes('generateContent') &&
      (m.name.includes('flash') || m.name.includes('pro'))
    );
    
    if (audioModels.length > 0) {
      console.log('\n✅ Recommended models for audio transcription:\n');
      audioModels.forEach(m => {
        const modelId = m.name.replace('models/', '');
        console.log(`   • ${modelId}`);
        console.log(`     ${m.description || 'No description'}`);
      });
    }
    
    console.log('\n\n💡 Usage example:');
    console.log(`
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash'  // or another model ID from above
});
    `);
    
  } catch (error) {
    console.error('❌ Error fetching models:', error.message);
    if (error.message.includes('API key')) {
      console.error('\n💡 Make sure your API key is valid');
      console.error('Get a new key at: https://aistudio.google.com/apikey');
    }
  }
}

// Run the script
listModels();
