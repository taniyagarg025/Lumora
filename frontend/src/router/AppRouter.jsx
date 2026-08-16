import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { FeedPage } from '../pages/FeedPage';
import { ArticleDetailPage } from '../pages/ArticleDetailPage';
import { VocabularyVaultPage } from '../pages/VocabularyVaultPage';
import { QuizArenaPage } from '../pages/QuizArenaPage';
import { NotesPage } from '../pages/NotesPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { HomePage } from '../pages/HomePage';
import { LearnPage } from '../pages/LearnPage';
import { LifeSkillReaderPage } from '../pages/LifeSkillReaderPage';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/article/:id" element={<ArticleDetailPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/learn/skill/:topic" element={<LifeSkillReaderPage />} />
        <Route path="/vocabulary" element={<VocabularyVaultPage />} />
        <Route path="/quizzes" element={<QuizArenaPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
