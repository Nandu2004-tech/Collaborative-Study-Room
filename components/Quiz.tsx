
import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';
import { generateQuiz } from '../services/geminiService';
import Icon from './Icon';

type QuizState = 'idle' | 'loading' | 'active' | 'finished';

const Quiz: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizState, setQuizState] = useState<QuizState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }
    setQuizState('loading');
    setError(null);
    try {
      const generatedQuestions = await generateQuiz(topic);
      if (generatedQuestions.length === 0) {
          setError("Could not generate a quiz for this topic. Please try another.");
          setQuizState('idle');
          return;
      }
      setQuestions(generatedQuestions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setUserAnswer(null);
      setIsAnswered(false);
      setQuizState('active');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setQuizState('idle');
    }
  };

  const handleAnswer = (selectedIndex: number) => {
    if (isAnswered) return;
    setUserAnswer(selectedIndex);
    setIsAnswered(true);
    if (selectedIndex === questions[currentQuestionIndex].correctAnswerIndex) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizState('finished');
    }
  };
  
  const resetQuiz = () => {
      setQuizState('idle');
      setTopic('');
      setQuestions([]);
  }

  const renderContent = () => {
    switch (quizState) {
      case 'loading':
        return (
          <div className="text-center p-8">
            <Icon name="fa-spinner" className="fa-spin text-4xl text-blue-500" />
            <p className="mt-4">Generating your quiz on "{topic}"...</p>
          </div>
        );
      case 'active':
        const question = questions[currentQuestionIndex];
        return (
          <div>
            <div className="mb-4">
              <p className="text-gray-400">Question {currentQuestionIndex + 1} of {questions.length}</p>
              <h3 className="text-2xl font-bold mt-2">{question.question}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options.map((option, index) => {
                const isCorrect = index === question.correctAnswerIndex;
                const isSelected = userAnswer === index;
                let buttonClass = 'bg-gray-700 hover:bg-gray-600';
                if (isAnswered) {
                  if (isCorrect) {
                    buttonClass = 'bg-green-600';
                  } else if (isSelected) {
                    buttonClass = 'bg-red-600';
                  }
                }
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={isAnswered}
                    className={`p-4 rounded-lg text-left transition-colors duration-300 ${buttonClass}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
             {isAnswered && (
                <button
                onClick={handleNextQuestion}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
                >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </button>
            )}
          </div>
        );
      case 'finished':
        return (
          <div className="text-center p-8">
            <h3 className="text-3xl font-bold mb-4">Quiz Complete!</h3>
            <p className="text-xl">Your score: <span className="text-green-400 font-bold">{score} / {questions.length}</span></p>
            <button
              onClick={resetQuiz}
              className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Take Another Quiz
            </button>
          </div>
        );
      case 'idle':
      default:
        return (
          <div className="flex flex-col items-center justify-center p-8">
            <h2 className="text-2xl font-bold mb-4">Generate a Quiz</h2>
            <p className="text-gray-400 mb-6">Enter a topic and we'll create a quiz for you!</p>
            <div className="w-full max-w-md">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., The Solar System, React Hooks"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleGenerateQuiz}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Generate Quiz
              </button>
              {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-xl p-6">
      {renderContent()}
    </div>
  );
};

export default Quiz;
