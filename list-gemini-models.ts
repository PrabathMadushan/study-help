/**
 * TypeScript version - List all available Gemini models
 * Run with: npx tsx list-gemini-models.ts
 * Or add to package.json scripts: "list-models": "tsx list-gemini-models.ts"
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error('❌ Error: VITE_GEMINI_API_KEY not found');
  console.error('Please set it in your .env file');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    console.log('🔍 Fetching available Gemini models...\n');
    
    const models = await genAI.listModels();
    
    console.log(`📊 Found ${models.length} models:\n`);
    console.log('='.repeat(100));
    
    interface ModelInfo {
      id: string;
      name: string;
      methods: string[];
      inputLimit: number;
      outputLimit: number;
      supportsMultimodal: boolean;
    }
    
    const modelsList: ModelInfo[] = [];
    
    for (const model of models) {
      const modelId = model.name.replace('models/', '');
      
      console.log(`\n📦 ${modelId}`);
      console.log(`   Name: ${model.displayName}`);
      console.log(`   Description: ${model.description || 'N/A'}`);
      console.log(`   Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
      console.log(`   Input Tokens: ${model.inputTokenLimit?.toLocaleString() || 'N/A'}`);
      console.log(`   Output Tokens: ${model.outputTokenLimit?.toLocaleString() || 'N/A'}`);
      
      modelsList.push({
        id: modelId,
        name: model.displayName || modelId,
        methods: model.supportedGenerationMethods || [],
        inputLimit: model.inputTokenLimit || 0,
        outputLimit: model.outputTokenLimit || 0,
        supportsMultimodal: modelId.includes('pro') || modelId.includes('flash')
      });
      
      console.log('─'.repeat(100));
    }
    
    // Summary tables
    console.log('\n\n📋 QUICK REFERENCE - Models Supporting generateContent:\n');
    console.log('='.repeat(100));
    
    const generateContentModels = modelsList.filter(m => 
      m.methods.includes('generateContent')
    );
    
    console.log('\n✅ For Audio/Video/Image Transcription:\n');
    generateContentModels
      .filter(m => m.supportsMultimodal)
      .forEach(m => {
        console.log(`   ${m.id.padEnd(40)} | Input: ${String(m.inputLimit).padStart(8)} tokens`);
      });
    
    console.log('\n\n💡 RECOMMENDED FOR YOUR USE CASE:\n');
    console.log('─'.repeat(100));
    console.log('\nFor Audio Transcription (current implementation):');
    console.log('   • gemini-1.5-flash        - Fast, cost-effective, supports audio');
    console.log('   • gemini-1.5-pro          - More accurate, higher quality');
    console.log('   • gemini-2.0-flash-exp    - Latest experimental (may not always be available)');
    
    console.log('\n\nFor Live Audio Streaming (requires backend server):');
    console.log('   • gemini-2.5-flash-native-audio-preview-12-2025');
    console.log('     (Only available via Live API with WebSocket)');
    
    console.log('\n\n📖 Usage in your code:\n');
    console.log(`
// For audio transcription (current implementation)
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash'
});

// Send audio for transcription
const result = await model.generateContent([
  {
    inlineData: {
      mimeType: 'audio/webm',
      data: base64AudioData
    }
  },
  { text: 'Transcribe this audio' }
]);
    `);
    
    console.log('\n' + '='.repeat(100) + '\n');
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('API_KEY')) {
      console.error('\n💡 Get your API key at: https://aistudio.google.com/apikey');
    }
  }
}

listModels().catch(console.error);
