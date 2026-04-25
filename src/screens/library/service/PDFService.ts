import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem      from 'expo-file-system';
export const PDFService = {

  pickPDF: async (): Promise<{ uri: string; name: string } | null> => {
    const result = await DocumentPicker.getDocumentAsync({
      type:                 'application/pdf',
      copyToCacheDirectory: true,
    });

    if (result.type !== 'success' || !result.uri) return null;
    return { uri: result.uri, name: result.name ?? 'book.pdf' };
  },

  // Read PDF as base64 for sending to AI
  readPDFAsBase64: async (uri: string): Promise<string> => {
    return await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  },

  // Extract raw text from PDF
  // expo-file-system can't parse PDFs natively so we
  // send base64 to Claude which handles PDF documents directly
  extractTextViaAI: async (base64: string): Promise<string> => {
    const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        'Missing Anthropic API key. Add EXPO_PUBLIC_ANTHROPIC_API_KEY to your environment.',
      );
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type:   'document',
                source: {
                  type:       'base64',
                  media_type: 'application/pdf',
                  data:       base64,
                },
              },
              {
                type: 'text',
                text: 'Extract and return all the text content from this PDF book. Return plain text only, no formatting.',
              },
            ],
          },
        ],
      }),
    });
    if (!response.ok) throw new Error(`PDF extraction failed ${response.status}`);
    const data = await response.json();
    return data.content?.[0]?.text ?? '';
  },
};