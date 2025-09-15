
import React, { useState, useEffect, useMemo } from 'react';
import { generateKaomojiVariations, generateKaomojiDescription } from '../services/geminiService';
import { kaomojiData } from '../constants/kaomoji';
import type { Kaomoji } from '../types';
import { KaomojiCard } from './KaomojiCard';
import { Footer } from './Footer';
import { Generator } from './Generator';
import { AdsenseAd } from './AdsenseAd';

interface DetailPageProps {
  kaomoji: Kaomoji;
  onBack: () => void;
}

const SkeletonCard: React.FC = () => (
    <div className="bg-slate-800 rounded-lg p-4 h-24 flex items-center justify-center animate-pulse">
        <div className="w-24 h-6 bg-slate-700 rounded-md"></div>
    </div>
);

export const DetailPage: React.FC<DetailPageProps> = ({ kaomoji, onBack }) => {
    const [variations, setVariations] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copiedValue, setCopiedValue] = useState<string | null>(null);
    const [generationAttempted, setGenerationAttempted] = useState(false);
    
    const [description, setDescription] = useState<string>('');
    const [isDescriptionLoading, setIsDescriptionLoading] = useState(true);
    const [descriptionError, setDescriptionError] = useState<string | null>(null);

    useEffect(() => {
        // Set a dynamic, SEO-friendly title for the page
        const originalTitle = document.title;
        document.title = `${kaomoji.name} ${kaomoji.value} | Kaomoji World`;
    
        // Revert title on component unmount
        return () => {
          document.title = originalTitle;
        };
    }, [kaomoji]);

    useEffect(() => {
        const fetchDescription = async () => {
            setIsDescriptionLoading(true);
            setDescriptionError(null);
            try {
                const desc = await generateKaomojiDescription(kaomoji.value);
                setDescription(desc);
            } catch (err) {
                setDescriptionError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setIsDescriptionLoading(false);
            }
        };
    
        fetchDescription();
    }, [kaomoji.value]);

    const handleGenerateVariations = async () => {
        setGenerationAttempted(true);
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateKaomojiVariations(kaomoji.value);
            setVariations(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const relatedKaomoji = useMemo(() => {
        const category = kaomojiData.find(cat => cat.kaomojis.some(k => k.value === kaomoji.value));
        if (!category) return [];

        return category.kaomojis
            .filter(k => k.value !== kaomoji.value)
            .sort(() => 0.5 - Math.random()) // shuffle
            .slice(0, 5);
    }, [kaomoji.value]);

    const handleCopy = (value: string) => {
        navigator.clipboard.writeText(value);
        setCopiedValue(value);
        setTimeout(() => setCopiedValue(null), 2000);
    };

    const renderCard = (value: string, key: string | number) => (
        <KaomojiCard
            key={key}
            kaomoji={value}
            onClick={() => handleCopy(value)}
            title="Click to copy"
        >
            {copiedValue === value && (
                <span className="text-cyan-400 font-bold transition-opacity duration-300 opacity-100">
                    Copied!
                </span>
            )}
        </KaomojiCard>
    );

    return (
        <div className="bg-slate-900 text-white font-sans relative">
            {/* Left Ad Sidebar */}
            <aside className="hidden 2xl:block fixed top-20 left-8 w-[160px] h-[600px]">
                <AdsenseAd client="ca-pub-3685000706717214" slot="2760671227" style={{ width: '160px', height: '600px' }} />
            </aside>

            {/* Right Ad Sidebar */}
            <aside className="hidden 2xl:block fixed top-20 right-8 w-[160px] h-[600px]">
                <AdsenseAd client="ca-pub-3685000706717214" slot="2760671227" style={{ width: '160px', height: '600px' }} />
            </aside>

            <div className="container mx-auto px-4 py-8">
                <main className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Column (Detail Content) */}
                    <div className="lg:col-span-3 animate-fade-in">
                        <header className="mb-8">
                            <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors duration-200 group">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Back to Search
                            </button>
                        </header>

                        <section className="text-center mb-12">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-200 mb-2">{kaomoji.name}</h1>
                            {renderCard(kaomoji.value, "main")}
                        </section>

                        <section className="mb-12">
                            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-cyan-400 border-b-2 border-slate-700 pb-2">About this Kaomoji</h2>
                            {isDescriptionLoading && (
                                <div className="animate-pulse space-y-2">
                                    <div className="h-4 bg-slate-700 rounded w-full"></div>
                                    <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                                </div>
                            )}
                            {descriptionError && <p className="text-red-400">{descriptionError}</p>}
                            {!isDescriptionLoading && !descriptionError && (
                                <p className="text-slate-300 leading-relaxed">{description}</p>
                            )}
                        </section>

                        <section className="mb-12">
                            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-fuchsia-400 border-b-2 border-slate-700 pb-2">AI-Generated Variations</h2>
                            
                            {!generationAttempted && !isLoading && (
                                <div className="text-center py-4">
                                    <button
                                        onClick={handleGenerateVariations}
                                        className="px-6 py-3 bg-fuchsia-600 text-white font-semibold rounded-lg hover:bg-fuchsia-700 transition duration-300"
                                    >
                                        Generate by AI
                                    </button>
                                </div>
                            )}

                            {isLoading && (
                                <div className="flex flex-wrap items-start justify-start gap-4">
                                    {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
                                </div>
                            )}
                            
                            {generationAttempted && !isLoading && (
                                <>
                                    {error && <p className="text-red-400 text-center py-4">{error}</p>}
                                    {!error && variations.length > 0 && (
                                        <div className="flex flex-wrap items-start justify-start gap-4">
                                            {variations.map((v, i) => renderCard(v, i))}
                                        </div>
                                    )}
                                    {!error && variations.length === 0 && (
                                        <p className="text-slate-500 text-center py-4">Could not generate variations for this kaomoji.</p>
                                    )}
                                </>
                            )}
                        </section>

                        {relatedKaomoji.length > 0 && (
                            <section>
                                <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-cyan-300 border-b-2 border-slate-700 pb-2">Related Kaomoji</h2>
                                <div className="flex flex-wrap items-start justify-start gap-4">
                                    {relatedKaomoji.map((k) => renderCard(k.value, k.value))}
                                </div>
                            </section>
                        )}
                    </div>
                    {/* Right Sidebar (Generator) */}
                    <aside className="lg:col-span-1 lg:sticky lg:top-8 h-fit">
                        <Generator />
                    </aside>
                </main>
            </div>
            <Footer />
        </div>
    );
};