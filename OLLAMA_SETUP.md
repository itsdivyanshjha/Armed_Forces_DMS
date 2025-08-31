# Ollama Setup Instructions for Armed Forces Command Center

## Overview
The Armed Forces Command Center uses Ollama with Llama 3.1 for AI-powered military intelligence analysis.

## Quick Setup

### 1. Install Ollama
- **Windows/Linux/macOS**: Download from [https://ollama.ai](https://ollama.ai)
- **Or via command line**:
  ```bash
  curl -fsSL https://ollama.ai/install.sh | sh
  ```

### 2. Pull Llama 3.1 Model
```bash
ollama pull llama3.1:latest
```

### 3. Start Ollama Service
```bash
ollama serve
```

### 4. Verify Installation
```bash
ollama list
```

## Usage in Command Center

### Default Configuration
- **Server URL**: `http://localhost:11434`
- **Model**: `llama3.1:latest`
- **Fallback**: Built-in military responses if Ollama unavailable

### Features
- ✅ Real-time AI military analysis
- ✅ Context-aware responses
- ✅ Military terminology and structure
- ✅ Automatic fallback to demo mode
- ✅ Connection status indicator

### Connection Status
- 🟢 **Online**: "LLAMA 3.1 ONLINE" - Full AI capabilities
- 🟡 **Offline**: "OFFLINE MODE" - Demo responses active

## Troubleshooting

### Common Issues
1. **Connection Failed**: Ensure Ollama is running on port 11434
2. **Model Not Found**: Run `ollama pull llama3.1:latest`
3. **Slow Responses**: Model loading time varies by system specs

### Manual Restart
```bash
# Stop Ollama
pkill ollama

# Start Ollama
ollama serve
```

## System Requirements
- **RAM**: 8GB minimum (16GB recommended)
- **Storage**: 4GB for Llama 3.1 model
- **OS**: Windows 10+, macOS 10.15+, Linux

## Security Note
For production deployment, ensure Ollama server is properly secured and not exposed to unauthorized networks.

---

**Classification**: FOR OFFICIAL USE ONLY  
**Support**: Contact system administrator for technical assistance
