import React from 'react';
import { Sparkles, Send } from 'lucide-react';
import { Card, CardBody, Button } from '@heroui/react';

export default function AIScraperModal({
  isOpen,
  onClose,
  onParse,
  isParsing
}) {
  const [rawText, setRawText] = React.useState('');

  const handleParse = () => {
    onParse(rawText);
  };

  React.useEffect(() => {
    if (isOpen) {
      setRawText('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all font-sans">
      <Card className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg w-full max-w-lg shadow-lg overflow-hidden">
        <CardBody className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center space-x-1.5">
              <Sparkles className="h-4.5 w-4.5 text-zinc-500" />
              <span>AI Scraper Post Parser</span>
            </h3>
            <Button size="sm" variant="light" className="text-xs" onPress={onClose}>Cancel</Button>
          </div>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed">Paste raw text from drives alerts below to extract and fill fields dynamically.</p>
          <textarea
            rows={5}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Honeywell is hiring Associate Engineers with salary of 7 LPA in Bangalore..."
            className="w-full p-3 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 text-xs font-mono"
          />
          <div className="flex justify-end pt-1">
            <Button
              onPress={handleParse}
              isLoading={isParsing}
              className="bg-zinc-900 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:hover:bg-zinc-50/90 text-white dark:text-zinc-900 font-bold px-4 h-8 text-xs rounded-md shadow"
              startContent={<Send className="h-3.5 w-3.5" />}
            >
              Parse & Autofill
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
