import React, { useState } from 'react';
import { Flashcard } from '../types';
import Icon from './Icon';

const sampleFlashcards: Flashcard[] = [
  { id: 1, question: 'What is the powerhouse of the cell?', answer: 'The Mitochondria' },
  { id: 2, question: 'What does "DOM" stand for in web development?', answer: 'Document Object Model' },
  { id: 3, question: 'In which year did World War II end?', answer: '1945' },
];

const AddCardForm = ({ onAddCard, onCancel }: { onAddCard: (q: string, a: string) => void, onCancel: () => void }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && answer.trim()) {
      onAddCard(question, answer);
      setQuestion('');
      setAnswer('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-30 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-xl p-6 w-full max-w-lg animate-fade-in-up">
            <h3 className="text-xl font-bold mb-4">Add New Flashcard</h3>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="question" className="block text-sm font-medium text-gray-400 mb-1">Question</label>
                        <textarea
                            id="question"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            rows={3}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., What is the capital of France?"
                        />
                    </div>
                    <div>
                        <label htmlFor="answer" className="block text-sm font-medium text-gray-400 mb-1">Answer</label>
                        <textarea
                            id="answer"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            rows={3}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Paris"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-600 hover:bg-gray-500">
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white">
                        Save Card
                    </button>
                </div>
            </form>
        </div>
        <style>{`
            @keyframes fade-in-up {
                from { opacity: 0; transform: translateY(20px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            .animate-fade-in-up {
                animation: fade-in-up 0.3s ease-out forwards;
            }
        `}</style>
    </div>
  )
};

const Flashcards: React.FC = () => {
  const [cards, setCards] = useState<Flashcard[]>(sampleFlashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleNext = () => {
    if (cards.length === 0) return;
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length), 150);
  };

  const handlePrev = () => {
    if (cards.length === 0) return;
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length), 150);
  };

  const handleAddCard = (question: string, answer: string) => {
      const newCard: Flashcard = {
          id: Date.now(),
          question,
          answer
      };
      const newCards = [...cards, newCard];
      setCards(newCards);
      // If it's the first card being added, set it as the current one
      if (cards.length === 0) {
          setCurrentIndex(0);
      }
      setShowAddForm(false);
  }

  return (
    <>
      <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-xl p-6 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Flashcards: General Knowledge</h2>
            <button
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
            >
                <Icon name="fa-plus" className="h-4 w-4" />
                <span>Add Card</span>
            </button>
        </div>
        
        {cards.length > 0 ? (
          <>
            <div className="w-full max-w-xl h-64 [perspective:1000px]">
              <div
                className={`relative w-full h-full transform-preserve-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div className="absolute w-full h-full backface-hidden bg-blue-600 rounded-lg flex items-center justify-center p-4 text-center cursor-pointer">
                  <p className="text-2xl font-semibold">{cards[currentIndex].question}</p>
                </div>
                <div className="absolute w-full h-full backface-hidden bg-green-600 rounded-lg flex items-center justify-center p-4 text-center cursor-pointer rotate-y-180">
                  <p className="text-2xl font-semibold">{cards[currentIndex].answer}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center w-full max-w-xl">
              <button onClick={handlePrev} className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
                <Icon name="fa-chevron-left" className="h-6 w-6" />
              </button>
              <span className="mx-6 text-lg font-medium">
                {currentIndex + 1} / {cards.length}
              </span>
              <button onClick={handleNext} className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
                <Icon name="fa-chevron-right" className="h-6 w-6" />
              </button>
            </div>
          </>
        ) : (
            <div className="w-full max-w-xl h-64 flex flex-col items-center justify-center bg-gray-900/50 rounded-lg">
                <Icon name="fa-layer-group" className="h-16 w-16 text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold">No Flashcards Yet</h3>
                <p className="text-gray-400 mt-2">Click "Add Card" to create your first flashcard.</p>
            </div>
        )}
      </div>

      {showAddForm && <AddCardForm onAddCard={handleAddCard} onCancel={() => setShowAddForm(false)} />}
    </>
  );
};

export default Flashcards;
